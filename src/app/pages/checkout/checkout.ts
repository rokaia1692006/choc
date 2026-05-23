import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  auth = inject(AuthService);
  cart = inject(CartService);
  router = inject(Router);

  createAccount = signal(false);
  error = signal('');
  loading = signal(false);

  form = {
    name: this.auth.user()?.name || '',
    phone: this.auth.user()?.phone || '',
    address: this.auth.user()?.address || '',
    city: this.auth.user()?.city || '',
    apartment: this.auth.user()?.apartment || '',
    notes: '',
    password: '',
    confirmPassword: ''
  };

  get total() { return this.cart.cartTotal() + 30; }

  toggleCreateAccount() {
    this.createAccount.update(v => !v);
  }

  placeOrder() {
    if (!this.form.name || !this.form.phone || !this.form.address || !this.form.city) {
      this.error.set('Please fill in all required fields.');
      return;
    }

    if (this.createAccount() && !this.auth.isLoggedIn()) {
      if (!this.form.password || this.form.password.length < 6) {
        this.error.set('Password must be at least 6 characters.');
        return;
      }
      if (this.form.password !== this.form.confirmPassword) {
        this.error.set('Passwords do not match.');
        return;
      }
      const success = this.auth.register({
        name: this.form.name,
        phone: this.form.phone,
        password: this.form.password,
        address: this.form.address,
        city: this.form.city,
        apartment: this.form.apartment
      });
      if (!success) {
        this.error.set('This phone number is already registered.');
        return;
      }
    }

    this.loading.set(true);
    console.log('Order:', { ...this.form, items: this.cart.cartItems(), total: this.total });
    setTimeout(() => {
      this.cart.clearCart();
      this.loading.set(false);
      this.router.navigate(['/']);
    }, 1000);
  }
}