import { Component, signal, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { LanguageService } from '../../core/services/language';
import { LanguagesPipe } from '../../shared/pipes/languages-pipe';
import { Captcha } from '../../shared/components/captcha/captcha';
import { finalize, switchMap } from 'rxjs';

type RegStep = 'register' | 'email';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LanguagesPipe, Captcha],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  @ViewChild(Captcha) captcha?: Captcha;

  lang = inject(LanguageService);
  auth = inject(AuthService);
  router = inject(Router);
  
  step = signal<RegStep>('register');
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  captchaToken = '';
  emailVerificationCode = '';
  form = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    apartment: ''
  };

  submitRegistration() {
    this.error.set(null);
    this.success.set(null);

   
    if (this.form.password !== this.form.confirmPassword) {
      this.error.set(this.lang.isArabic() ? 'كلمات المرور غير متطابقة.' : 'Passwords do not match.');
      return;
    }

    if (this.form.password.length < 8) {
      this.error.set(this.lang.isArabic() ? 'يجب أن تتكون كلمة المرور من ٨ أحرف على الأقل.' : 'Password must be at least 8 characters.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email.trim())) {
      this.error.set(this.lang.isArabic() ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
      return;
    }

    if (!this.captchaToken) {
      this.error.set(this.lang.isArabic() ? 'يرجى إكمال اختبار التحقق.' : 'Please complete the CAPTCHA.');
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

    this.loading.set(true);
    this.form.phone = cleanPhone;
    this.auth.startVerification(this.form.email.trim(), 'registration', this.captchaToken).pipe(
      finalize(() => {
        this.loading.set(false);
        this.captchaToken = '';
        this.captcha?.reset();
      })
    ).subscribe({
      next: () => {
        this.captchaToken = '';
        this.step.set('email');
        this.success.set(this.lang.isArabic() ? 'تم إرسال رمز التحقق إلى بريدك الإلكتروني.' : 'An email verification code has been sent to your inbox.');
      },
      error: () => this.error.set(this.lang.isArabic() ? 'تعذر إرسال رسالة التحقق. تحقق من إعدادات البريد الإلكتروني في الخادم وسجلاته.' : 'Could not send the verification email. Check the backend SMTP settings and server logs.'),
    });
  }

  submitEmailVerification() {
    this.error.set(null);
    this.success.set(null);
    if (!this.emailVerificationCode.trim()) {
      this.error.set(this.lang.isArabic() ? 'يرجى إدخال رمز التحقق المرسل إلى بريدك الإلكتروني.' : 'Enter the verification code sent to your email.');
      return;
    }

    this.loading.set(true);
    this.auth.confirmVerification(this.form.email.trim(), 'registration', this.emailVerificationCode.trim()).pipe(
      switchMap(verificationToken => this.auth.startRegistration({
        name: this.form.name,
        email: this.form.email.trim(),
        phone: this.form.phone,
        password: this.form.password,
        address: this.form.address,
        city: this.form.city,
        apartment: this.form.apartment
      }, verificationToken))
    ).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.error.set(this.lang.isArabic() ? 'تعذر تأكيد البريد الإلكتروني أو بدء التسجيل. تحقق من الرمز وحاول مجدداً.' : 'Could not verify the email or start registration. Check the code and try again.'),
    });
  }

  resendEmailVerification() {
    this.error.set(null);
    this.success.set(null);
    if (!this.captchaToken) {
      this.error.set(this.lang.isArabic() ? 'يرجى إكمال اختبار التحقق أولاً.' : 'Complete the CAPTCHA first.');
      return;
    }

    this.loading.set(true);
    this.auth.startVerification(this.form.email.trim(), 'registration', this.captchaToken).pipe(
      finalize(() => {
        this.loading.set(false);
        this.captchaToken = '';
        this.captcha?.reset();
      })
    ).subscribe({
      next: () => {
        this.captchaToken = '';
        this.success.set(this.lang.isArabic() ? 'تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.' : 'A new email verification code has been sent.');
      },
      error: () => this.error.set(this.lang.isArabic() ? 'تعذر إعادة إرسال الرمز.' : 'Could not resend the verification code.'),
    });
  }

  onCaptchaSolved(token: string) {
    this.captchaToken = token;
    this.error.set(null);
  }

  onCaptchaExpired() {
    this.captchaToken = '';
    this.error.set(this.lang.isArabic() ? 'انتهت صلاحية التحقق. يرجى إكمال اختبار CAPTCHA مرة أخرى.' : 'The CAPTCHA expired. Please complete it again before registering.');
  }

}