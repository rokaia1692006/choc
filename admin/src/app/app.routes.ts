import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { passwordChangeGuard } from './core/guards/password-change.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  { path: 'email-verification', loadComponent: () => import('./pages/email-verification/email-verification').then((m) => m.EmailVerification) },
  { path: 'two-factor', loadComponent: () => import('./pages/two-factor/two-factor').then((m) => m.TwoFactorSetup) },
  { path: 'two-factor-setup', loadComponent: () => import('./pages/two-factor/two-factor').then((m) => m.TwoFactorSetup) },
  { path: 'staff/activate', loadComponent: () => import('./pages/staff-activation/staff-activation').then((m) => m.StaffActivationPage) },
  { path: 'change-password', canActivate: [passwordChangeGuard], loadComponent: () => import('./pages/change-password/change-password').then((m) => m.ChangePassword) },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'products', loadComponent: () => import('./pages/products/product-list/product-list').then((m) => m.ProductList) },
      { path: 'products/new', loadComponent: () => import('./pages/products/product-form/product-form').then((m) => m.ProductForm) },
      { path: 'products/:id', loadComponent: () => import('./pages/products/product-form/product-form').then((m) => m.ProductForm) },
      { path: 'orders', loadComponent: () => import('./pages/orders/orders').then((m) => m.Orders) },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardPage) },
      { path: 'ingredient', canActivate: [roleGuard('Admin')], loadComponent: () => import('./pages/ingredients/ingredients').then((m) => m.IngredientsPage) },
      { path: 'customers', canActivate: [roleGuard('Admin')], loadComponent: () => import('./pages/customers/customers').then((m) => m.CustomersPage) },
      { path: 'staff', canActivate: [roleGuard('Admin')], loadComponent: () => import('./pages/staff/staff').then((m) => m.StaffPage) },
      { path: 'build', loadComponent: () => import('./pages/products/product').then((m) => m.ProductPage) },
    ],
  },
  { path: '**', redirectTo: '' },
];
