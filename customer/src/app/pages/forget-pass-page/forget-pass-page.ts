import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { LanguageService } from '../../core/services/language';
import { SHOW_LOCAL_VERIFICATION_CODE } from '../../core/api.config';

type Step = 'phone' | 'code' | 'newPassword';

@Component({
  selector: 'app-forget-pass-page',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './forget-pass-page.html',
  styleUrl: './forget-pass-page.css',
})
export class ForgetPassPage {
  auth = inject(AuthService);
  router = inject(Router);
  lang = inject(LanguageService);

  step = signal<Step>('phone');
  phone = '';
  confirmCode = '';
  newPassword = '';
  confirmNewPassword = '';
  error = signal('');
  loading = signal(false);
  success = signal('');

  submitPhone() {
    this.error.set('');
    this.success.set('');
    
    if (!this.phone.trim()) {
      this.error.set(
        this.lang.isArabic() ? 'يرجى إدخال رقم الهاتف الخاص بك.' : 'Please enter your phone number.'
      );
      return;
    }
    this.loading.set(true);
    this.auth.startPhoneVerification(this.phone.trim(), 'password-reset').subscribe({
      next: response => {
        const code = SHOW_LOCAL_VERIFICATION_CODE ? ` (${this.lang.isArabic() ? 'رمز التطوير' : 'development code'}: ${response.code})` : '';
        this.success.set((this.lang.isArabic() ? 'تم إرسال رمز التحقق إلى رقم هاتفك.' : 'A verification code has been sent to your number.') + code);
        this.step.set('code');
      },
      error: () => this.error.set(this.lang.isArabic() ? 'تعذر إرسال رمز التحقق.' : 'Could not send a verification code.'),
      complete: () => this.loading.set(false)
    });
  }

  submitCode() {
    this.error.set('');
    if (!this.confirmCode.trim()) {
      this.error.set(
        this.lang.isArabic() ? 'يرجى إدخال رمز التحقق.' : 'Please enter the verification code.'
      );
      return;
    }
    this.success.set('');
    this.step.set('newPassword');
  }


 submitNewPassword() {
  this.error.set('');
  if (!this.newPassword || !this.confirmNewPassword) {
    this.error.set(
      this.lang.isArabic() ? 'يرجى ملء كلا الحقلين لكلمة المرور.' : 'Please fill in both password fields.'
    );
    return;
  }
  if (this.newPassword.length < 6) {
    this.error.set(
      this.lang.isArabic() ? 'يجب أن تتكون كلمة المرور من ٦ أحرف على الأقل.' : 'Password must be at least 6 characters.'
    );
    return;
  }
  if (this.newPassword !== this.confirmNewPassword) {
    this.error.set(
      this.lang.isArabic() ? 'كلمات المرور غير متطابقة.' : 'Passwords do not match.'
    );
    return;
  }

  this.loading.set(true);
  this.auth.resetPassword(this.phone, this.confirmCode.trim(), this.newPassword).subscribe({
    next: () => this.router.navigate(['/login']),
    error: () => this.error.set(this.lang.isArabic() ? 'تعذر تحديث كلمة المرور.' : 'Could not update the password.'),
    complete: () => this.loading.set(false)
  });
}

  resendCode() {
    this.error.set('');
    this.auth.resendVerification(this.phone.trim(), 'password-reset').subscribe({
      next: response => {
        const code = SHOW_LOCAL_VERIFICATION_CODE ? ` (${this.lang.isArabic() ? 'رمز التطوير' : 'development code'}: ${response.code})` : '';
        this.success.set((this.lang.isArabic() ? 'تم إرسال رمز جديد.' : 'A new code has been sent.') + code);
      },
      error: () => this.error.set(this.lang.isArabic() ? 'تعذر إعادة إرسال الرمز.' : 'Could not resend the code.')
    });
  }
}