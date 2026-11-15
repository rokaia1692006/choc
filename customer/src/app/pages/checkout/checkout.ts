import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { CartService } from '../../core/services/cart';
import { OrderService } from '../../core/services/order-service';
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
  blockedDates = signal<string[]>([]);

  constructor() {
    const from = new Date().toISOString().slice(0, 10);
    const to = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    this.order.getBlockedDates(from, to).subscribe({
      next: dates => this.blockedDates.set(dates),
      error: () => this.error.set(this.lang.isArabic() ? 'تعذر تحميل مواعيد التوصيل.' : 'Could not load delivery availability.')
    });
  }

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
    return this.blockedDates().includes(dateStr);
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
    const egPhoneRegex = /^(?:\+22)?(?:\+20|20|0)?1[0125]\d{8}$/;
    const cleanPhone = this.form.phone.trim().replace(/\s+/g, '');

    if (!egPhoneRegex.test(cleanPhone)) {
      this.error.set(
        this.lang.isArabic()
          ? 'يرجى إدخال رقم هاتف مصري صحيح (مثال: ٠١٠١٢٣٤٥٦٧٨).'
          : 'Please enter a valid Egyptian phone number (e.g., 01012345678).'
      );
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

    }

    this.form.phone = cleanPhone;
    if (this.auth.isLoggedIn()) {
      this.placeOrder();
      return;
    }
    this.loading.set(true);
    this.auth.startPhoneVerification(cleanPhone, 'checkout').subscribe({
      next: () => {
        this.step.set('sms');
        this.success.set(this.lang.isArabic() ? 'تم إرسال رمز التحقق إلى رقم هاتفك.' : 'A verification code has been sent to your number.');
      },
      error: () => this.error.set(this.lang.isArabic() ? 'تعذر إرسال رمز التحقق.' : 'Could not send a verification code.'),
      complete: () => this.loading.set(false)
    });
  }

  submitVerificationCode() {
    this.error.set('');

    if (!this.verificationCode.trim()) {
      this.error.set(this.lang.isArabic() ? 'يرجى إدخال رمز التحقق.' : 'Please enter the verification code.');
      return;
    }

    this.loading.set(true);
    this.auth.verifyPhone(this.form.phone, this.verificationCode.trim(), 'checkout').subscribe({
      next: () => {
        if (this.createAccount()) {
          this.auth.registerAfterVerification({
            name: this.form.name,
            phone: this.form.phone,
            password: this.form.password,
            address: this.form.address,
            city: this.form.city,
            apartment: this.form.apartment
          }, this.verificationCode.trim()).subscribe({
            next: () => this.placeOrder(),
            error: () => {
              this.loading.set(false);
              this.error.set(this.lang.isArabic() ? 'تعذر إنشاء الحساب.' : 'Could not create the account.');
            }
          });
        } else {
          this.placeOrder();
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set(this.lang.isArabic() ? 'الرمز غير صحيح أو انتهت صلاحيته.' : 'The code is incorrect or expired.');
      }
    });
  }

  resendVerificationCode() {
    this.error.set('');
    this.auth.resendVerification(this.form.phone, 'checkout').subscribe({
      next: () => this.success.set(this.lang.isArabic() ? 'تم إرسال رمز جديد.' : 'A new code has been sent.'),
      error: () => this.error.set(this.lang.isArabic() ? 'تعذر إعادة إرسال الرمز.' : 'Could not resend the code.')
    });
  }

  private placeOrder(): void {
    const firstCartProductId = this.cart.cartItems()[0]?.product.id;
    this.order.saveOrder({
      userId: this.auth.user()?.id || null,
      customerName: this.form.name,
      phone: this.form.phone,
      address: this.form.address,
      city: this.form.city,
      apartment: this.form.apartment,
      notes: this.form.notes,
      items: this.cart.cartItems().map(item => ({
        productId: item.product.id,
        name: item.product.name,
        nameAr: item.product.nameAr,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity
      })),
      subtotal: this.subtotal,
      deliveryFee: this.deliveryFee(),
      tax: this.tax,
      total: this.total,
      deliveryDate: this.form.deliveryDate
    }).subscribe({
      next: order => {
        this.cart.clearCart();
        this.loading.set(false);
        if (this.auth.isLoggedIn()) this.router.navigate(['/orders']);
        else if (firstCartProductId !== undefined) this.router.navigate(['/product', firstCartProductId]);
        else this.router.navigateByUrl('/shop');
        this.success.set(order.id);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(this.lang.isArabic() ? 'تعذر إنشاء الطلب. حاول مجدداً.' : 'Could not place the order. Please try again.');
      }
    });
  }

  notifyCardPaymentUnavailable() {
    this.error.set(
      this.lang.isArabic()
        ? 'الدفع بالبطاقة غير متاح حتى يتم إعداد خادم الدفع الآمن.'
        : 'Card payment is unavailable until the secure payment server is configured.'
    );
  }
}