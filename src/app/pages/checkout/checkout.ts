import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { CartService } from '../../core/services/cart';
import { OrderService } from '../../core/services/order-service';
import { Order } from '../../core/models/order';

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
  order = inject(OrderService);
  router = inject(Router);

  createAccount = signal(false);
  error = signal('');
  loading = signal(false);

  minDate = this.order.getMinDeliveryDate();
  blockedDates = this.order.getBlockedDates();

  form = {
    name: this.auth.user()?.name || '',
    phone: this.auth.user()?.phone || '',
    address: this.auth.user()?.address || '',
    city: this.auth.user()?.city || '',
    apartment: this.auth.user()?.apartment || '',
    notes: '',
    deliveryDate: '',
    password: '',
    confirmPassword: ''
  };

  get total() { return this.cart.cartTotal() + 30; }

  toggleCreateAccount() {
    this.createAccount.update(v => !v);
  }

  isDateBlocked(dateStr: string): boolean {
    return this.blockedDates.includes(dateStr);
  }

  onDateChange() {
     this.error.set('');
  if (!this.form.deliveryDate) return;

  const selected = new Date(this.form.deliveryDate);
  const min = new Date(this.minDate);

  selected.setHours(0, 0, 0, 0);
  min.setHours(0, 0, 0, 0);

  if (selected < min) {
    this.error.set('Delivery date must be at least 2 days from today.');
    this.form.deliveryDate = '';
    return;
  }

  if (this.isDateBlocked(this.form.deliveryDate)) {
    this.error.set('This date is unavailable. Please choose another date.');
    this.form.deliveryDate = '';
  }
  }

  placeOrder() {
    this.error.set('');

    if (!this.form.name || !this.form.phone || !this.form.address || !this.form.city) {
      this.error.set('Please fill in all required fields.');
      return;
    }

    if (!this.form.deliveryDate) {
      this.error.set('Please select a delivery date.');
      return;
    }

    if (!this.order.isDateValid(this.form.deliveryDate)) {
      this.error.set('Please select a valid delivery date (at least 2 days from today).');
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
    if (!this.form.deliveryDate) {
  this.error.set('Please select a delivery date.');
  return;
}

const selected = new Date(this.form.deliveryDate);
const min = new Date(this.minDate);
selected.setHours(0, 0, 0, 0);
min.setHours(0, 0, 0, 0);

if (selected < min) {
  this.error.set('Delivery date must be at least 2 days from today.');
  return;
}

if (this.isDateBlocked(this.form.deliveryDate)) {
  this.error.set('This date is not available. Please choose another date.');
  return;
}

    this.loading.set(true);

    const newOrder: Order = {
      id: Date.now().toString(),
      userId: this.auth.user()?.id || null,
      customerName: this.form.name,
      phone: this.form.phone,
      address: this.form.address,
      city: this.form.city,
      apartment: this.form.apartment,
      notes: this.form.notes,
    items: this.cart.cartItems().map(i => ({
  productId: i.product.id,
  name: i.product.name,
  image: i.product.image,
  price: i.product.price,
  quantity: i.quantity,
})),
      subtotal: this.cart.cartTotal(),
      delivery: 30,
      total: this.total,
      deliveryDate: this.form.deliveryDate,
      status: 'pending',
      placedAt: new Date().toISOString()
    };

    this.order.saveOrder(newOrder);

    setTimeout(() => {
      this.cart.clearCart();
      this.loading.set(false);
      this.router.navigate(['/orders']);
    }, 1000);
  }
}