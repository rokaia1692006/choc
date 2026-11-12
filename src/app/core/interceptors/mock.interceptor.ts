import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of, throwError } from 'rxjs';
import { API_URL } from '../api.config';

const img = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22%3E%3Crect width=%2240%22 height=%2240%22 fill=%22%235a3a2a%22/%3E%3C/svg%3E';
const now = new Date().toISOString();
const user = { id: 'u1', name: 'Demo Admin', email: 'admin@choc.test', role: 'Admin', twoFactorEnabled: false };
let loggedIn = false;
let cats: any[] = [{ id: 1, name: 'Bars', nameAr: 'ألواح', sortOrder: 1, isActive: true }, { id: 2, name: 'Gift boxes', nameAr: 'علب هدايا', sortOrder: 2, isActive: true }];
let products: any[] = [
  { id: 1, status: 'active', name: 'Kunafa Pistachio Bar', description: 'Crisp kunafa in dark chocolate.', price: 85, image: img, categoryId: 1, isSeasonal: false, seasonal: null, createdAt: now, updatedAt: now },
  { id: 2, status: 'active', name: 'Ramadan Box', description: 'Twelve assorted pieces.', price: 420, image: img, categoryId: 2, isSeasonal: true, seasonal: { seasonName: 'Ramadan 2027', startsAt: '2027-02-20T00:00:00Z', endsAt: '2027-03-30T00:00:00Z' }, createdAt: now, updatedAt: now },
];
let orders: any[] = [1, 2, 3].map(n => ({
  id: `ORD-100${n}`, userId: null, customerName: ['Mona Adel', 'Omar Hassan', 'Salma Nabil'][n - 1], phone: `010000000${n}`, address: `${n} Corniche St`, city: 'Alexandria',
  items: [{ productId: 1, name: 'Kunafa Pistachio Bar', image: img, price: 85, quantity: n }], subtotal: 85 * n, deliveryFee: 30, tax: 0, total: 85 * n + 30,
  deliveryDate: now, status: ['pending', 'preparing', 'delivered'][n - 1], placedAt: now, paymentStatus: n === 1 ? 'unpaid' : 'paid', paymentMethod: n === 1 ? 'cash_on_delivery' : 'card',
}));
const customers = orders.map((o, i) => ({ id: `c${i}`, name: o.customerName, phone: o.phone, address: o.address, city: o.city, ordersCount: i + 1, createdAt: now }));

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_URL)) return next(req);
  const p = req.url.slice(API_URL.length).split('?')[0].split('/'); // ['', 'admin', 'products', '5']
  const m = req.method, b: any = req.body, key = `${p[1]}/${p[2]}`, id = p[3];
  const ok = (body: unknown = null) => of(new HttpResponse({ status: 200, body })).pipe(delay(150));

  if (key === 'auth/login') { loggedIn = true; return ok({ requiresTwoFactor: false, user }); }
  if (key === 'auth/2fa' && !id) { loggedIn = true; return ok(user); }
  if (key === 'auth/me') return loggedIn ? ok(user) : throwError(() => new HttpErrorResponse({ status: 401 }));
  if (key === 'auth/logout') { loggedIn = false; return ok(); }
  if (key === 'auth/2fa' && id === 'setup') return ok({ sharedKey: 'JBSWY3DPEHPK3PXP', otpauthUri: 'otpauth://totp/Choc:admin@choc.test?secret=JBSWY3DPEHPK3PXP&issuer=Choc' });
  if (key === 'auth/2fa' && id === 'enable') return ok({ recoveryCodes: ['a1b2-c3d4', 'e5f6-g7h8', 'i9j0-k1l2', 'm3n4-o5p6', 'q7r8-s9t0'] });

  if (key === 'admin/categories') {
    if (m === 'GET') return ok(cats);
    if (m === 'POST') { cats = [...cats, { ...b, id: Date.now() }]; return ok(); }
    if (m === 'PUT') { cats = cats.map(c => (c.id === +id ? { ...c, ...b } : c)); return ok(); }
    cats = cats.filter(c => c.id !== +id); return ok();
  }
  if (key === 'admin/products') {
    if (m === 'GET') return ok(id ? products.find(x => x.id === +id) : products);
    if (m === 'POST') { products = [...products, { ...b, id: Date.now(), createdAt: now, updatedAt: now }]; return ok(); }
    if (m === 'PUT') { products = products.map(x => (x.id === +id ? { ...x, ...b, updatedAt: now } : x)); return ok(); }
    products = products.filter(x => x.id !== +id); return ok();
  }
  if (key === 'admin/orders') {
    if (m === 'PATCH') { orders = orders.map(o => (o.id === id ? { ...o, status: b.status } : o)); return ok(orders.find(o => o.id === id)); }
    const s = req.params.get('status');
    const items = s ? orders.filter(o => o.status === s) : orders;
    return ok({ items, total: items.length, page: 1, pageSize: 20 });
  }
  if (key === 'admin/customers') return ok(customers);
  if (key === 'admin/uploads') return ok({ url: img });
  if (key === 'admin/dashboard') {
    return ok({
      pendingOrders: orders.filter(o => o.status === 'pending').length, ordersToday: orders.length,
      revenue30d: orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0),
      productsOnSale: products.filter(x => x.status === 'active').length, latest: orders.slice(0, 5),
    });
  }
  return next(req);
};
