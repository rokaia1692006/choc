import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { CartService } from '../../core/services/cart';
import { OrderService } from '../../core/services/order-service';
import { Order } from '../../core/models/order';
import { CurrencyService } from '../../core/services/currency';
import { LanguageService } from '../../core/services/language';
import { LanguagesPipe } from '../../shared/pipes/languages-pipe';
import { CurrencyPipe } from '../../shared/pipes/currency-pipe';

type CheckoutStep = 'checkout' | 'sms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, LanguagesPipe, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  auth = inject(AuthService);
  cart = inject(CartService);
  order = inject(OrderService);
  router = inject(Router);
  lang = inject(LanguageService);

  step = signal<CheckoutStep>('checkout');
  createAccount = signal(false);
  error = signal('');
  success = signal('');
  loading = signal(false);
  verificationCode = '';

  deliveryFee = signal(30); 
  taxRate = signal(0); 
  minDate = this.order.getMinDeliveryDate();
  blockedDates = this.order.getBlockedDates();

  get subtotal() { return this.cart.cartTotal(); }
  get tax() { return this.subtotal * this.taxRate(); }
  get total() { return this.subtotal + this.deliveryFee() + this.tax; }

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

  toggleCreateAccount() {
    this.createAccount.update(v => !v);
  }

  isDateBlocked(dateStr: string): boolean {
    return this.blockedDates.includes(dateStr);
  }

  onDateChange() {
    this.error.set('');
    if (!this.form.deliveryDate) return;

    if (this.isDateBlocked(this.form.deliveryDate) || !this.order.isDateValid(this.form.deliveryDate)) {
      this.error.set(
        this.lang.isArabic() 
          ? 'هذا التاريخ غير متاح للتوصيل. يرجى اختيار تاريخ آخر.' 
          : 'This date is unavailable. Please choose another date.'
      );
      this.form.deliveryDate = '';
    }
  }

  handleCheckoutSubmit() {
    this.error.set('');
    this.success.set('');

    if (!this.form.name || !this.form.phone || !this.form.address || !this.form.city) {
      this.error.set(this.lang.isArabic() ? 'يرجى ملء جميع الحقول المطلوبة.' : 'Please fill in all required fields.');
      return;
    }

    if (!this.form.deliveryDate || !this.order.isDateValid(this.form.deliveryDate) || this.isDateBlocked(this.form.deliveryDate)) {
      this.error.set(this.lang.isArabic() ? 'يرجى اختيار تاريخ توصيل صحيح.' : 'Please select a valid delivery date.');
      return;
    }

    if (this.createAccount() && !this.auth.isLoggedIn()) {
      if (!this.form.password || this.form.password.length < 6) {
        this.error.set(this.lang.isArabic() ? 'يجب أن تتكون كلمة المرور من ٦ أحرف على الأقل.' : 'Password must be at least 6 characters.');
        return;
      }
      if (this.form.password !== this.form.confirmPassword) {
        this.error.set(this.lang.isArabic() ? 'كلمات المرور غير متطابقة.' : 'Passwords do not match.');
        return;
      }

      const isAlreadyRegistered = this.auth.confirmCode(this.form.phone.trim());
      if (isAlreadyRegistered) {
        this.error.set(this.lang.isArabic() ? 'رقم الهاتف هذا مسجل بالفعل.' : 'This phone number is already registered.');
        return;
      }
    }

    this.loading.set(true);
    this.auth.confirmCode(this.form.phone.trim()); 
    this.loading.set(false);

    this.step.set('sms');
    this.success.set(
      this.lang.isArabic() 
        ? 'تم إرسال رمز التحقق لتأكيد طلبك إلى رقم هاتفك.' 
        : 'A verification code to confirm your order has been sent to your number.'
    );
  }

  submitVerificationCode() {
    this.error.set('');

    if (!this.verificationCode.trim()) {
      this.error.set(this.lang.isArabic() ? 'يرجى إدخال رمز التحقق.' : 'Please enter the verification code.');
      return;
    }

    this.loading.set(true);
    const isValidCode = this.auth.correctCode(this.verificationCode.trim());

    if (!isValidCode) {
      this.loading.set(false);
      this.error.set(this.lang.isArabic() ? 'الرمز غير صحيح، يرجى المحاولة مرة أخرى.' : 'Incorrect code. Please try again.');
      return;
    }

    if (this.createAccount() && !this.auth.isLoggedIn()) {
      this.auth.register({
        name: this.form.name,
        phone: this.form.phone,
        password: this.form.password,
        address: this.form.address,
        city: this.form.city,
        apartment: this.form.apartment
      });
    }

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
        nameAr: i.product.nameAr,
        image: i.product.image,
        price: i.product.price,
        quantity: i.quantity,
      })),
      subtotal: this.subtotal,
      deliveryFee: this.deliveryFee(),
      tax: this.tax,
      total: this.total,
      deliveryDate: this.form.deliveryDate,
      status: 'pending',
      placedAt: new Date().toISOString()
    };

    this.order.saveOrder(newOrder);

    setTimeout(() => {
      this.cart.clearCart();
      this.loading.set(false);
      if (!this.auth.isLoggedIn()) {
        this.router.navigate(['/order-receipt'], { queryParams: { id: newOrder.id, phone: newOrder.phone } });
      } else {
        this.router.navigate(['/orders']);
      }
    }, 1000);
  }

  resendVerificationCode() {
    this.error.set('');
    this.success.set(
      this.lang.isArabic() ? 'تم إعادة إرسال رمز التحقق بنجاح.' : 'A new verification code has been sent.'
    );
  }
}