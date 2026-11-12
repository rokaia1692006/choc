import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'two-factor', loadComponent: () => import('./pages/two-factor/two-factor').then(m => m.TwoFactor) },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then(m => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'products', loadComponent: () => import('./pages/products/product-list/product-list').then(m => m.ProductList) },
      { path: 'products/new', loadComponent: () => import('./pages/products/product-form/product-form').then(m => m.ProductForm) },
      { path: 'products/:id', loadComponent: () => import('./pages/products/product-form/product-form').then(m => m.ProductForm) },
      { path: 'orders', loadComponent: () => import('./pages/orders/orders').then(m => m.Orders) },
      {path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardPage) },
      {path: 'ingredient', loadComponent: () => import('./pages/ingredients/ingredients').then(m => m.IngredientsPage) },
      {path: 'customers', loadComponent: () => import('./pages/customers/customers').then(m => m.CustomersPage) },
      {path: 'build',loadComponent: () => import('./pages/products/product').then(m => m.ProductPage) },

      
    ],
  },
  { path: '**', redirectTo: '' },
];
