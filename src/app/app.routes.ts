import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Products } from './pages/products/products';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { Login } from './pages/login/login';
import { ForgetPassPage } from './pages/forget-pass-page/forget-pass-page';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { cartGuardGuard } from './core/guards/cart-guard-guard';
import { Orders } from './pages/orders/orders';
import { OrderRecipt } from './pages/order-recipt/order-recipt';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: Products },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout, canActivate: [cartGuardGuard] },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'forgetpass', component: ForgetPassPage},
{path: 'orders', component: Orders, canActivate: [authGuard]},
{ path: 'order-receipt', component: OrderRecipt,canActivate:[guestGuard]},
{ path: '**', redirectTo: 'HomeComponent' },
];