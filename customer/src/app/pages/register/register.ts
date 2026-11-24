import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { LanguageService } from '../../core/services/language';
import { LanguagesPipe } from '../../shared/pipes/languages-pipe';
import { SHOW_LOCAL_VERIFICATION_CODE } from '../../core/api.config';

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

    if (this.form.password.length < 8) {
      this.error.set(this.lang.isArabic() ? 'يجب أن تتكون كلمة المرور من ٨ أحرف على الأقل.' : 'Password must be at least 8 characters.');
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
    this.auth.startRegistration(this.form).subscribe({
      next: response => {
        this.step.set('sms');
        const code = SHOW_LOCAL_VERIFICATION_CODE ? ` (${this.lang.isArabic() ? 'رمز التطوير' : 'development code'}: ${response.code})` : '';
        this.success.set((this.lang.isArabic() ? 'تم إرسال رمز تفعيل الحساب إلى رقم هاتفك.' : 'An account verification code has been sent to your number.') + code);
      },
      error: () => this.error.set(this.lang.isArabic() ? 'تعذر بدء التسجيل. تحقق مما إذا كان الرقم مسجلاً وحاول مجدداً.' : 'Could not start registration. Check whether this phone is already registered and try again.'),
      complete: () => this.loading.set(false)
    });
  }

  submitVerificationCode() {
    this.error.set(null);

    if (!this.verificationCode.trim()) {
      this.error.set(this.lang.isArabic() ? 'يرجى إدخال رمز التحقق.' : 'Please enter the verification code.');
      return;
    }

    this.loading.set(true);
    this.auth.verifyRegistration(this.form.phone, this.verificationCode.trim()).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.error.set(this.lang.isArabic() ? 'الرمز غير صحيح أو انتهت صلاحيته.' : 'The code is incorrect or expired.'),
      complete: () => this.loading.set(false)
    });
  }

  resendVerificationCode() {
    this.error.set(null);
    this.auth.resendVerification(this.form.phone, 'registration').subscribe({
      next: response => {
        const code = SHOW_LOCAL_VERIFICATION_CODE ? ` (${this.lang.isArabic() ? 'رمز التطوير' : 'development code'}: ${response.code})` : '';
        this.success.set((this.lang.isArabic() ? 'تم إرسال رمز جديد.' : 'A new registration code has been sent.') + code);
      },
      error: () => this.error.set(this.lang.isArabic() ? 'تعذر إعادة إرسال الرمز.' : 'Could not resend the verification code.')
    });
  }
}