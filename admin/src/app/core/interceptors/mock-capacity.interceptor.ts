import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { API_URL } from '../api.config';

let settings = { acceptingOrders: true, pausedMessage: '', pausedMessageAr: '', defaultMaxOrdersPerDay: 20, openWeekdays: [0, 1, 2, 3, 4, 6], leadTimeDays: 1 };
const overrides = new Map<string, { open: boolean; max: number }>();
const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

function days() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + settings.leadTimeDays + i);
    const date = iso(d), o = overrides.get(date);
    const max = o?.max ?? settings.defaultMaxOrdersPerDay;
    return { date, open: o?.open ?? settings.openWeekdays.includes(d.getDay()), max, used: (i * 4) % (max + 1), overridden: !!o };
  });
}

/** Fake capacity endpoints. Everything else falls through to the next interceptor. */
export const mockCapacityInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(`${API_URL}/admin/capacity`)) return next(req);
  const date = req.url.slice(API_URL.length).split('?')[0].split('/')[3];
  const b: any = req.body;
  if (req.method === 'PUT' && !date) settings = { ...settings, ...b };
  if (req.method === 'PUT' && date) overrides.set(date, { open: b.open, max: b.maxOrders });
  if (req.method === 'DELETE') overrides.delete(date);
  const body = req.method === 'GET' ? { settings, days: days() } : null;
  return of(new HttpResponse({ status: 200, body })).pipe(delay(150));
};
