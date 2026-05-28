import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { LanguageService } from '../../core/services/language';
import { LanguagesPipe } from '../../shared/pipes/languages-pipe';

type RegStep = 'register' | 'sms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LanguagesPipe],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  lang = inject(LanguageService);
  auth = inject(AuthService);
  router = inject(Router);
  
  step = signal<RegStep>('register');
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  verificationCode = '';
  form = {
    name: '',
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

    if (this.form.password.length < 6) {
      this.error.set(this.lang.isArabic() ? 'يجب أن تتكون كلمة المرور من ٦ أحرف على الأقل.' : 'Password must be at least 6 characters.');
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
    const isAlreadyRegistered = this.auth.confirmCode(cleanPhone); 
    this.loading.set(false);

    if (!isAlreadyRegistered) {
      this.step.set('sms');
      this.success.set(
        this.lang.isArabic() 
          ? 'تم إرسال رمز تفعيل الحساب إلى رقم هاتفك.' 
          : 'An account verification code has been sent to your number.'
      );
    } else {
      this.error.set(
        this.lang.isArabic() 
          ? 'رقم الهاتف هذا مسجل بالفعل.' 
          : 'This phone number is already registered.'
      );
    }
  }

  submitVerificationCode() {
    this.error.set(null);

    if (!this.verificationCode.trim()) {
      this.error.set(this.lang.isArabic() ? 'يرجى إدخال رمز التحقق.' : 'Please enter the verification code.');
      return;
    }

    this.loading.set(true);
    const isValid = this.auth.correctCode(this.verificationCode.trim());
    
    if (isValid) {
      const success = this.auth.register({ ...this.form, phone: this.form.phone.trim().replace(/\s+/g, '') });
      this.loading.set(false);

      if (success) {
        this.router.navigate(['/']);
      } else {
        this.error.set(this.lang.isArabic() ? 'فشلت عملية إنشاء الحساب. حاول مرة أخرى.' : 'Registration failed. Please try again.');
      }
    } else {
      this.loading.set(false);
      this.error.set(this.lang.isArabic() ? 'الرمز غير صحيح، يرجى المحاولة مرة أخرى.' : 'Incorrect code. Please try again.');
    }
  }

  resendVerificationCode() {
    this.error.set(null);
    this.success.set(
      this.lang.isArabic() ? 'تم إعادة إرسال رمز التحقق بنجاح.' : 'A new registration code has been sent.'
    );
  }
}