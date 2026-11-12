import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const page = (path: string, load: () => Promise<any>) => ({ path, loadComponent: load });

export const routes: Routes = [
  page('login', () => import('./pages/login/login').then(m => m.Login)),
  page('two-factor', () => import('./pages/two-factor/two-factor').then(m => m.TwoFactor)),
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then(m => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      page('dashboard', () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)),
      page('products', () => import('./pages/products/product-list/product-list').then(m => m.ProductList)),
      page('products/new', () => import('./pages/products/product-form/product-form').then(m => m.ProductForm)),
      page('products/:id', () => import('./pages/products/product-form/product-form').then(m => m.ProductForm)),
      page('categories', () => import('./pages/categories/categories').then(m => m.Categories)),
      page('orders', () => import('./pages/orders/orders').then(m => m.Orders)),
      page('customers', () => import('./pages/customers/customers').then(m => m.Customers)),
      page('settings', () => import('./pages/settings/settings').then(m => m.Settings)),
    ],
  },
  { path: '**', redirectTo: '' },
];
