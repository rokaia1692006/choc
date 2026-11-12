import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';

import { Product, Category } from '../models/product.model';
import { Order, OrderItem, OrderStatus, PaymentMethod, PaymentStatus, Paged } from '../models/order.model';
import { Ingredient } from '../models/Ingredient.model';
import { Customer, AdminUser } from '../models/user.model';
import { Period, PeriodSummary, SeriesPoint, ScheduleSettings } from '../models/dashboard.model';
import { CapacityDay, CapacitySettings, CapacityResponse } from '../models/capacity.model';

// If you already have OnlineCustomer exported from a model file, delete this
// local copy and import it instead.
interface OnlineCustomer {
  sessionId: string;
  customerId: number;
  name: string;
  email: string;
  phoneMasked: string;
  device: string;
  signedInAt: string;
  lastActiveAt: string;
}

const LATENCY_MS = 150;
const DB_VERSION = '3'; // bump this whenever the seed shape changes -> auto reseeds
const HOUR = 3_600_000;
const DAY = 24 * HOUR;

interface Result {
  status: number;
  body: any;
}
const ok = (body: any): Result => ({ status: 200, body });
const created = (body: any): Result => ({ status: 201, body });
const notFound = (what = 'Resource'): Result => ({ status: 404, body: { message: `${what} not found` } });

/* ------------------------------------------------------------------ */
/* Interceptor                                                         */
/* ------------------------------------------------------------------ */

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('/api/')) {
    return next(req);
  }

  seedIfNeeded();

  let result = route(req);
  if (!result) {
    // Never let an /api/ call escape to the real network (that's what caused the CORS errors)
    console.warn('[mock] Unhandled request:', req.method, req.url);
    result = { status: 404, body: { message: `Mock route not found: ${req.method} ${req.url}` } };
  }

  const r = result;
  return timer(LATENCY_MS).pipe(
    mergeMap(() =>
      r.status >= 400
        ? throwError(() => new HttpErrorResponse({ status: r.status, error: r.body, url: req.url }))
        : of(new HttpResponse({ status: r.status, body: r.body, url: req.url }))
    )
  );
};

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

function route(req: HttpRequest<any>): Result | null {
  const url = new URL(req.url, window.location.origin);
  // "/api/admin/orders/ORD-1" and "/api/orders/ORD-1" both become "orders/ORD-1"
  const path = url.pathname
    .replace(/^.*?\/api\//, '')
    .replace(/^admin\//, '')
    .replace(/\/+$/, '');
  const seg = path.split('/');
  const q = url.searchParams;
  const m = req.method.toUpperCase();
  const body = req.body ?? {};

  switch (seg[0]) {
    case 'auth':
    case 'login':
    case 'signin':
      return authRoutes(seg, m, body);

    case 'dashboard':
    case 'analytics':
      return dashboardRoutes(seg, q);

    case 'schedule':
      return scheduleRoutes(seg, m, body);

    case 'capacity':
      return capacityRoutes(seg, m, body);

    case 'products':
      return productRoutes(seg, m, body, q);

    case 'categories':
      return categoryRoutes(seg, m, body);

    case 'ingredients':
      return ingredientRoutes(seg, m, body);

    case 'online-customers':
      return onlineCustomerRoutes(seg, m);

    case 'customers':
      // supports /customers/online as well
      if (seg[1] === 'online') return onlineCustomerRoutes(seg, m);
      return customerRoutes(seg, m);

    case 'orders':
      return orderRoutes(seg, m, body, q);
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

function authRoutes(seg: string[], m: string, body: any): Result | null {
  const last = seg[seg.length - 1];
  const user = db.get<AdminUser>('adminUser', DEFAULT_ADMIN);

  if (last === 'me') {
    if (m === 'GET') return ok(user);
    if (m === 'PUT' || m === 'PATCH') {
      const updated = { ...user, ...body, id: user.id };
      db.set('adminUser', updated);
      return ok(updated);
    }
  }
  if (last === 'logout' && m === 'POST') return ok({ success: true });

  if (m === 'POST') {
    // login / signin / anything else under /auth
    const u: AdminUser = { ...user, email: body.email || user.email };
    return ok({
      token: 'mock-jwt-token-success-xyz',
      accessToken: 'mock-jwt-token-success-xyz',
      user: u,
      admin: u
    });
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Dashboard / analytics (always PeriodSummary[] and SeriesPoint[])    */
/* ------------------------------------------------------------------ */

function dashboardRoutes(seg: string[], q: URLSearchParams): Result | null {
  if (seg[1] === 'summary') return ok(buildSummaries());
  if (seg[1] === 'series') {
    const p = (q.get('period') as Period) || 'month';
    return ok(buildSeries(p));
  }
  return null;
}

function activeOrders(): Order[] {
  return db.get<Order[]>('orders', []).filter(o => o.status !== 'cancelled');
}

function buildSummaries(): PeriodSummary[] {
  const orders = activeOrders();
  const now = Date.now();
  const windows: Record<Period, number> = { day: 1, week: 7, month: 30, year: 365 };

  return (Object.keys(windows) as Period[]).map(period => {
    const since = now - windows[period] * DAY;
    const inRange = orders.filter(o => new Date(o.placedAt).getTime() >= since);
    const sales = inRange.reduce((s, o) => s + o.total, 0);
    const costs = Math.round(sales * 0.4);
    return { period, orders: inRange.length, sales, costs, profit: sales - costs };
  });
}

function buildSeries(period: Period): SeriesPoint[] {
  const orders = activeOrders();
  const now = Date.now();
  const cfg = {
    day: { buckets: 6, size: 4 * HOUR },
    week: { buckets: 7, size: DAY },
    month: { buckets: 4, size: 7 * DAY },
    year: { buckets: 12, size: 30 * DAY }
  }[period] ?? { buckets: 4, size: 7 * DAY };

  const points: SeriesPoint[] = [];
  for (let i = cfg.buckets - 1; i >= 0; i--) {
    const end = now - i * cfg.size;
    const start = end - cfg.size;
    const sales = orders
      .filter(o => {
        const t = new Date(o.placedAt).getTime();
        return t > start && t <= end;
      })
      .reduce((s, o) => s + o.total, 0);

    let label: string;
    const d = new Date(end);
    if (period === 'day') label = `${String(new Date(start).getHours()).padStart(2, '0')}:00`;
    else if (period === 'week') label = d.toLocaleDateString('en-US', { weekday: 'short' });
    else if (period === 'year') label = d.toLocaleDateString('en-US', { month: 'short' });
    else label = `Week ${cfg.buckets - i}`;

    points.push({ label, sales, profit: Math.round(sales * 0.6) });
  }
  return points;
}

/* ------------------------------------------------------------------ */
/* Schedule + capacity                                                 */
/* ------------------------------------------------------------------ */

function scheduleRoutes(seg: string[], m: string, body: any): Result | null {
  if (seg[1] === 'settings') {
    const cap = db.get<CapacitySettings>('capacitySettings', DEFAULT_CAPACITY);
    if (m === 'GET') {
      const s: ScheduleSettings = { dailyOrderLimit: cap.defaultMaxOrdersPerDay };
      return ok(s);
    }
    if (m === 'PUT' || m === 'POST' || m === 'PATCH') {
      const limit = Number(body.dailyOrderLimit ?? cap.defaultMaxOrdersPerDay);
      db.set('capacitySettings', { ...cap, defaultMaxOrdersPerDay: limit });
      return ok({ dailyOrderLimit: limit } as ScheduleSettings);
    }
  }
  if (seg[1] === 'days') return capacityDaysRoutes(seg.slice(2), m, body);
  return null;
}

function capacityRoutes(seg: string[], m: string, body: any): Result | null {
  if (seg.length === 1 && m === 'GET') {
    const res: CapacityResponse = {
      settings: db.get<CapacitySettings>('capacitySettings', DEFAULT_CAPACITY),
      days: db.get<CapacityDay[]>('capacityDays', [])
    };
    return ok(res);
  }
  if (seg[1] === 'settings') {
    const cur = db.get<CapacitySettings>('capacitySettings', DEFAULT_CAPACITY);
    if (m === 'GET') return ok(cur);
    if (m === 'PUT' || m === 'POST' || m === 'PATCH') {
      const updated = { ...cur, ...body };
      db.set('capacitySettings', updated);
      return ok(updated);
    }
  }
  if (seg[1] === 'days') return capacityDaysRoutes(seg.slice(2), m, body);
  return null;
}

/** seg = remaining path after ".../days", e.g. [] or ['2026-11-02'] */
function capacityDaysRoutes(seg: string[], m: string, body: any): Result | null {
  const days = db.get<CapacityDay[]>('capacityDays', []);

  if (m === 'GET') {
    if (seg[0]) {
      const d = days.find(x => x.date === seg[0]);
      return d ? ok(d) : notFound('Day');
    }
    return ok(days);
  }

  if (m === 'PUT' || m === 'POST' || m === 'PATCH') {
    const incoming: Partial<CapacityDay>[] = Array.isArray(body) ? body : [{ ...body, date: body.date ?? seg[0] }];
    for (const inc of incoming) {
      if (!inc.date) continue;
      const i = days.findIndex(d => d.date === inc.date);
      if (i >= 0) days[i] = { ...days[i], ...inc, overridden: true } as CapacityDay;
      else days.push({ open: true, max: 25, used: 0, overridden: true, ...inc } as CapacityDay);
    }
    days.sort((a, b) => a.date.localeCompare(b.date));
    db.set('capacityDays', days);
    return ok(Array.isArray(body) ? days : days.find(d => d.date === incoming[0]?.date));
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Products + categories                                               */
/* ------------------------------------------------------------------ */

function productRoutes(seg: string[], m: string, body: any, q: URLSearchParams): Result | null {
  let products = db.get<Product[]>('products', []);
  const id = seg[1] ? parseInt(seg[1], 10) : null;

  if (m === 'GET') {
    if (id !== null) {
      const p = products.find(x => x.id === id);
      return p ? ok(p) : notFound('Product');
    }
    const status = q.get('status');
    const categoryId = q.get('categoryId');
    const search = q.get('search')?.toLowerCase();
    if (status) products = products.filter(p => p.status === status);
    if (categoryId) products = products.filter(p => p.categoryId === Number(categoryId));
    if (search) products = products.filter(p => p.name.toLowerCase().includes(search));
    return ok(products);
  }

  if (m === 'POST') {
    const now = new Date().toISOString();
    const p: Product = {
      status: 'draft',
      boxType: 'single',
      isSeasonal: false,
      description: '',
      image: '',
      categoryId: 1,
      price: 0,
      name: 'Untitled',
      ...body,
      id: Date.now(),
      createdAt: now,
      updatedAt: now
    };
    products.push(p);
    db.set('products', products);
    return created(p);
  }

  if ((m === 'PUT' || m === 'PATCH') && id !== null) {
    const i = products.findIndex(x => x.id === id);
    if (i < 0) return notFound('Product');
    products[i] = { ...products[i], ...body, id, updatedAt: new Date().toISOString() };
    db.set('products', products);
    return ok(products[i]);
  }

  if (m === 'DELETE' && id !== null) {
    db.set('products', products.filter(x => x.id !== id));
    return ok({ success: true });
  }
  return null;
}

function categoryRoutes(seg: string[], m: string, body: any): Result | null {
  let cats = db.get<Category[]>('categories', []);
  const id = seg[1] ? parseInt(seg[1], 10) : null;

  if (m === 'GET') {
    if (id !== null) {
      const c = cats.find(x => x.id === id);
      return c ? ok(c) : notFound('Category');
    }
    return ok(cats);
  }
  if (m === 'POST') {
    const c: Category = { isActive: true, sortOrder: cats.length + 1, ...body, id: Date.now() };
    cats.push(c);
    db.set('categories', cats);
    return created(c);
  }
  if ((m === 'PUT' || m === 'PATCH') && id !== null) {
    const i = cats.findIndex(x => x.id === id);
    if (i < 0) return notFound('Category');
    cats[i] = { ...cats[i], ...body, id };
    db.set('categories', cats);
    return ok(cats[i]);
  }
  if (m === 'DELETE' && id !== null) {
    db.set('categories', cats.filter(x => x.id !== id));
    return ok({ success: true });
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Ingredients                                                         */
/* ------------------------------------------------------------------ */

function ingredientRoutes(seg: string[], m: string, body: any): Result | null {
  const list = db.get<Ingredient[]>('ingredients', []);
  const id = seg[1] ? parseInt(seg[1], 10) : null;

  if (m === 'GET') {
    if (id !== null) {
      const i = list.find(x => x.id === id);
      return i ? ok(i) : notFound('Ingredient');
    }
    return ok(list);
  }
  if (m === 'POST') {
    const ing: Ingredient = { ...body, id: Date.now() };
    list.push(ing);
    db.set('ingredients', list);
    return created(ing);
  }
  if ((m === 'PUT' || m === 'PATCH') && id !== null) {
    const i = list.findIndex(x => x.id === id);
    if (i < 0) return notFound('Ingredient');
    list[i] = { ...list[i], ...body, id };
    db.set('ingredients', list);
    return ok(list[i]);
  }
  if (m === 'DELETE' && id !== null) {
    db.set('ingredients', list.filter(x => x.id !== id));
    return ok({ success: true });
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Customers                                                           */
/* ------------------------------------------------------------------ */

function customerRoutes(seg: string[], m: string): Result | null {
  const customers = db.get<Customer[]>('customers', []);
  if (m === 'GET') {
    if (seg[1]) {
      const c = customers.find(x => x.id === seg[1]);
      return c ? ok(c) : notFound('Customer');
    }
    return ok(customers);
  }
  return null;
}

function onlineCustomerRoutes(seg: string[], m: string): Result | null {
  const online = db.get<OnlineCustomer[]>('onlineCustomers', []);
  if (m === 'GET') return ok(online);
  // sign a session out: DELETE /online-customers/:sessionId
  if (m === 'DELETE') {
    const sessionId = seg[seg.length - 1];
    db.set('onlineCustomers', online.filter(o => o.sessionId !== sessionId));
    return ok({ success: true });
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

function orderRoutes(seg: string[], m: string, body: any, q: URLSearchParams): Result | null {
  const orders = db.get<Order[]>('orders', []);
  const id = seg[1] ? decodeURIComponent(seg[1]) : null;

  if (m === 'GET') {
    if (id) {
      const o = orders.find(x => x.id === id);
      return o ? ok(o) : notFound('Order');
    }

    let list = [...orders];
    const status = q.get('status');
    const payment = q.get('paymentStatus');
    const search = q.get('search')?.toLowerCase();
    if (status && status !== 'all') list = list.filter(o => o.status === status);
    if (payment && payment !== 'all') list = list.filter(o => o.paymentStatus === payment);
    if (search) {
      list = list.filter(
        o =>
          o.id.toLowerCase().includes(search) ||
          o.customerName.toLowerCase().includes(search) ||
          o.phone.includes(search)
      );
    }

    if (q.has('page') || q.has('pageSize')) {
      const page = Math.max(1, parseInt(q.get('page') || '1', 10));
      const pageSize = Math.max(1, parseInt(q.get('pageSize') || '20', 10));
      const paged: Paged<Order> = {
        items: list.slice((page - 1) * pageSize, page * pageSize),
        total: list.length,
        page,
        pageSize
      };
      return ok(paged);
    }
    return ok(list);
  }

  if (m === 'POST') {
    const items: OrderItem[] = body.items ?? [];
    const subtotal = body.subtotal ?? items.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = body.deliveryFee ?? 50;
    const tax = body.tax ?? Math.round(subtotal * 0.14);
    const o: Order = {
      userId: null,
      customerName: '',
      phone: '',
      address: '',
      city: '',
      deliveryDate: new Date(Date.now() + DAY).toISOString().split('T')[0],
      paymentMethod: 'cash_on_delivery',
      ...body,
      items,
      subtotal,
      deliveryFee,
      tax,
      total: body.total ?? subtotal + deliveryFee + tax,
      id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
      placedAt: new Date().toISOString(),
      status: 'pending',
      paymentStatus: 'unpaid'
    };
    orders.unshift(o);
    db.set('orders', orders);
    return created(o);
  }

  if ((m === 'PUT' || m === 'PATCH' || m === 'POST') && id) {
    const i = orders.findIndex(x => x.id === id);
    if (i < 0) return notFound('Order');
    const patch: Partial<Order> = { ...body };
    if (patch.status === 'cancelled' && orders[i].status !== 'cancelled') {
      patch.cancelledAt = new Date().toISOString();
    }
    orders[i] = { ...orders[i], ...patch, id };
    db.set('orders', orders);
    return ok(orders[i]);
  }

  if (m === 'DELETE' && id) {
    db.set('orders', orders.filter(x => x.id !== id));
    return ok({ success: true });
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* localStorage helpers                                                */
/* ------------------------------------------------------------------ */

const db = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(`mock_db_${key}`);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    localStorage.setItem(`mock_db_${key}`, JSON.stringify(value));
  }
};

/* ------------------------------------------------------------------ */
/* Seed data                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_ADMIN: AdminUser = {
  id: 'admin-1',
  name: 'Store Administrator',
  email: 'admin@choooc.com',
  role: 'Admin',
  twoFactorEnabled: false
};

const DEFAULT_CAPACITY: CapacitySettings = {
  acceptingOrders: true,
  defaultMaxOrdersPerDay: 25,
  openWeekdays: [0, 1, 2, 3, 4, 6],
  leadTimeDays: 1
};

function seedIfNeeded(): void {
  if (localStorage.getItem('mock_db_version') === DB_VERSION) return;

  // wipe any old/incompatible mock data
  Object.keys(localStorage)
    .filter(k => k.startsWith('mock_db_'))
    .forEach(k => localStorage.removeItem(k));

  const now = Date.now();
  const isoDay = (offsetDays: number) => new Date(now + offsetDays * DAY).toISOString().split('T')[0];

  // deterministic pseudo-random so the data is the same after every reseed
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

  const categories: Category[] = [
    { id: 1, name: 'Gourmet Chocolates', nameAr: 'شوكولاتة فاخرة', sortOrder: 1, isActive: true },
    { id: 2, name: 'Gift Boxes', nameAr: 'صناديق هدايا', sortOrder: 2, isActive: true },
    { id: 3, name: 'Bars', nameAr: 'ألواح', sortOrder: 3, isActive: true }
  ];

  const variants = [
    { id: 'v1', flavour: 'Sea Salt Caramel', flavourAr: 'كراميل بملح البحر', label: 'Caramel', labelAr: 'كراميل', priceModifier: 0, crossSectionImage: '', available: true },
    { id: 'v2', flavour: 'Hazelnut Praline', flavourAr: 'برالين البندق', label: 'Hazelnut', labelAr: 'بندق', priceModifier: 0, crossSectionImage: '', available: true },
    { id: 'v3', flavour: 'Pistachio Ganache', flavourAr: 'جاناك الفستق', label: 'Pistachio', labelAr: 'فستق', priceModifier: 20, crossSectionImage: '', available: true },
    { id: 'v4', flavour: 'Raspberry', flavourAr: 'توت', label: 'Raspberry', labelAr: 'توت', priceModifier: 0, crossSectionImage: '', available: false }
  ];

  const iso = new Date(now).toISOString();
  const products: Product[] = [
    {
      id: 101,
      status: 'active',
      name: 'Dark Chocolate Truffle Box',
      nameAr: 'صندوق ترافل الشوكولاتة الداكنة',
      description: 'Rich 70% dark chocolate handcrafted truffles.',
      descriptionAr: 'ترافل شوكولاتة داكنة 70% مصنوعة يدويًا.',
      price: 350,
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500',
      categoryId: 1,
      boxType: 'mixed',
      mixedBox: { totalPieces: 12, minPerFlavour: 2, label: 'Selection Box', labelAr: 'صندوق مختارات' },
      variantLabel: 'Flavour',
      variants,
      isSeasonal: true,
      seasonal: {
        seasonName: 'Winter Collection',
        seasonNameAr: 'مجموعة الشتاء',
        startsAt: new Date(now - 5 * DAY).toISOString(),
        endsAt: new Date(now + 30 * DAY).toISOString()
      },
      sku: 'TRF-012',
      allergens: ['Milk', 'Soy', 'Nuts'],
      weightGrams: 240,
      shelfLifeDays: 30,
      stockQuantity: 40,
      featured: true,
      sortOrder: 1,
      createdAt: iso,
      updatedAt: iso
    },
    {
      id: 102,
      status: 'active',
      name: 'Classic Gift Set',
      nameAr: 'طقم الهدايا الكلاسيكي',
      description: 'A fixed assortment of our best sellers.',
      descriptionAr: 'تشكيلة ثابتة من أفضل منتجاتنا.',
      price: 520,
      image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500',
      categoryId: 2,
      boxType: 'set',
      boxContents: [
        { flavour: 'Sea Salt Caramel', flavourAr: 'كراميل بملح البحر', quantity: 4 },
        { flavour: 'Hazelnut Praline', flavourAr: 'برالين البندق', quantity: 4 },
        { flavour: 'Pistachio Ganache', flavourAr: 'جاناك الفستق', quantity: 4 }
      ],
      isSeasonal: false,
      seasonal: null,
      sku: 'GIFT-012',
      allergens: ['Milk', 'Nuts'],
      weightGrams: 300,
      shelfLifeDays: 45,
      stockQuantity: 25,
      featured: true,
      badge: 'Best seller',
      badgeAr: 'الأكثر مبيعًا',
      sortOrder: 2,
      createdAt: iso,
      updatedAt: iso
    },
    {
      id: 103,
      status: 'active',
      name: 'Milk Chocolate Bar',
      nameAr: 'لوح شوكولاتة بالحليب',
      description: 'Smooth 38% milk chocolate bar.',
      descriptionAr: 'لوح شوكولاتة بالحليب ناعم 38%.',
      price: 90,
      image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500',
      categoryId: 3,
      boxType: 'single',
      isSeasonal: false,
      seasonal: null,
      sku: 'BAR-038',
      allergens: ['Milk', 'Soy'],
      weightGrams: 100,
      shelfLifeDays: 120,
      stockQuantity: null,
      sortOrder: 3,
      createdAt: iso,
      updatedAt: iso
    },
    {
      id: 104,
      status: 'draft',
      name: 'Valentine Heart Box',
      nameAr: 'صندوق قلب عيد الحب',
      description: 'Limited heart-shaped box (draft).',
      price: 420,
      image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500',
      categoryId: 2,
      boxType: 'single',
      isSeasonal: true,
      seasonal: {
        seasonName: 'Valentine',
        startsAt: new Date(now + 60 * DAY).toISOString(),
        endsAt: new Date(now + 80 * DAY).toISOString()
      },
      createdAt: iso,
      updatedAt: iso
    },
    {
      id: 105,
      status: 'archived',
      name: 'Autumn Spice Truffles',
      nameAr: 'ترافل توابل الخريف',
      description: 'Past seasonal item.',
      price: 300,
      image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500',
      categoryId: 1,
      boxType: 'single',
      isSeasonal: true,
      seasonal: {
        seasonName: 'Autumn',
        startsAt: new Date(now - 120 * DAY).toISOString(),
        endsAt: new Date(now - 60 * DAY).toISOString()
      },
      createdAt: iso,
      updatedAt: iso
    }
  ];

  const ingredients: Ingredient[] = [
    { id: 1, name: 'Belgian Dark Chocolate 70%', packSize: 1000, packUnit: 'g', packPrice: 450, allergens: 'Milk, Soy', supplier: 'Callebaut' },
    { id: 2, name: 'Heavy Cream 35%', packSize: 1000, packUnit: 'ml', packPrice: 120, allergens: 'Milk', supplier: 'Local Dairy' },
    { id: 3, name: 'Roasted Hazelnuts', packSize: 500, packUnit: 'g', packPrice: 210, allergens: 'Nuts', supplier: 'Nut House' },
    { id: 4, name: 'Pistachio Paste', packSize: 1, packUnit: 'kg', packPrice: 900, allergens: 'Nuts', supplier: 'Sicily Imports' },
    { id: 5, name: 'Gift Ribbon', packSize: 50, packUnit: 'pc', packPrice: 150, allergens: '', supplier: 'Pack & Co' }
  ];

  // customers
  const names = ['Sarah Ahmed', 'Omar Hassan', 'Nour El-Din', 'Layla Mostafa', 'Youssef Khaled', 'Mariam Adel'];
  const cities = ['Cairo', 'Giza', 'Alexandria'];
  const customers: Customer[] = names.map((name, i) => ({
    id: `cust-${i + 1}`,
    name,
    phone: `+2010${String(10000000 + i * 1111111).slice(0, 8)}`,
    email: `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`,
    address: `${10 + i} Garden Street`,
    city: cities[i % cities.length],
    apartment: i % 2 === 0 ? `Apt ${i + 3}` : undefined,
    ordersCount: 0,
    createdAt: new Date(now - (200 - i * 20) * DAY).toISOString()
  }));

  // orders (60 over the last ~90 days, newest first)
  const methods: PaymentMethod[] = ['card', 'wallet', 'cash_on_delivery'];
  const orders: Order[] = [];
  for (let n = 0; n < 60; n++) {
    const hoursAgo = n < 6 ? Math.floor(rand() * 20) + 1 : Math.floor(rand() * 90 * 24);
    const placed = new Date(now - hoursAgo * HOUR);
    const c = pick(customers);
    const itemCount = 1 + Math.floor(rand() * 3);
    const items: OrderItem[] = [];
    for (let k = 0; k < itemCount; k++) {
      const p = pick(products.filter(x => x.status === 'active'));
      const v = p.variants?.find(x => x.available);
      items.push({
        productId: p.id,
        name: p.name,
        nameAr: p.nameAr,
        image: p.image,
        price: p.price,
        quantity: 1 + Math.floor(rand() * 2),
        variant: p.boxType === 'mixed' ? v?.flavour : undefined,
        variantAr: p.boxType === 'mixed' ? v?.flavourAr : undefined
      });
    }
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = 50;
    const tax = Math.round(subtotal * 0.14);
    const ageDays = hoursAgo / 24;

    let status: OrderStatus;
    if (ageDays > 3) status = rand() < 0.08 ? 'cancelled' : 'delivered';
    else if (ageDays > 1) status = rand() < 0.5 ? 'preparing' : 'delivered';
    else status = rand() < 0.6 ? 'pending' : 'preparing';

    const paymentMethod = pick(methods);
    let paymentStatus: PaymentStatus;
    if (status === 'cancelled') paymentStatus = paymentMethod === 'cash_on_delivery' ? 'unpaid' : 'refunded';
    else if (status === 'delivered') paymentStatus = 'paid';
    else paymentStatus = paymentMethod === 'cash_on_delivery' ? 'unpaid' : rand() < 0.9 ? 'paid' : 'failed';

    const deliveryDate = new Date(placed.getTime() + 2 * DAY).toISOString().split('T')[0];

    orders.push({
      id: `ORD-${1001 + n}`,
      userId: c.id,
      customerName: c.name,
      phone: c.phone,
      address: c.address,
      city: c.city,
      apartment: c.apartment,
      notes: n % 7 === 0 ? 'Please call before arriving' : undefined,
      items,
      subtotal,
      deliveryFee,
      tax,
      total: subtotal + deliveryFee + tax,
      deliveryDate,
      status,
      placedAt: placed.toISOString(),
      cancelledAt: status === 'cancelled' ? new Date(placed.getTime() + 2 * HOUR).toISOString() : undefined,
      paymentStatus,
      paymentMethod,
      paymobTransactionId: paymentMethod === 'card' && paymentStatus === 'paid' ? `PMB-${900000 + n}` : undefined,
      internalNotes: n % 11 === 0 ? 'VIP customer' : undefined
    });
  }
  orders.sort((a, b) => b.placedAt.localeCompare(a.placedAt));
  customers.forEach(c => (c.ordersCount = orders.filter(o => o.userId === c.id).length));

  // capacity
  const capacitySettings: CapacitySettings = { ...DEFAULT_CAPACITY };
  const capacityDays: CapacityDay[] = [];
  for (let d = -7; d <= 30; d++) {
    const date = isoDay(d);
    const weekday = new Date(date + 'T00:00:00').getDay();
    const open = capacitySettings.openWeekdays.includes(weekday);
    const used = orders.filter(o => o.deliveryDate === date && o.status !== 'cancelled').length;
    capacityDays.push({ date, open, max: open ? capacitySettings.defaultMaxOrdersPerDay : 0, used, overridden: false });
  }
  // one manual override for demo
  const ov = capacityDays.find(x => x.date === isoDay(5));
  if (ov) Object.assign(ov, { open: true, max: 10, overridden: true });

  const onlineCustomers: OnlineCustomer[] = [
    {
      sessionId: 'sess-1',
      customerId: 1,
      name: customers[0].name,
      email: customers[0].email!,
      phoneMasked: '+20 10****5678',
      device: 'Chrome / macOS',
      signedInAt: new Date(now - 10 * 60_000).toISOString(),
      lastActiveAt: new Date(now - 30_000).toISOString()
    },
    {
      sessionId: 'sess-2',
      customerId: 3,
      name: customers[2].name,
      email: customers[2].email!,
      phoneMasked: '+20 11****2210',
      device: 'Safari / iPhone',
      signedInAt: new Date(now - 45 * 60_000).toISOString(),
      lastActiveAt: new Date(now - 4 * 60_000).toISOString()
    }
  ];

  db.set('adminUser', DEFAULT_ADMIN);
  db.set('categories', categories);
  db.set('products', products);
  db.set('ingredients', ingredients);
  db.set('customers', customers);
  db.set('orders', orders);
  db.set('onlineCustomers', onlineCustomers);
  db.set('capacitySettings', capacitySettings);
  db.set('capacityDays', capacityDays);
  localStorage.setItem('mock_db_version', DB_VERSION);
}