import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { LanguageService } from '../../core/services/language';

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
    const found = this.auth.confirmCode(this.phone.trim());
    this.loading.set(false);
    if (found) {
      this.success.set(
        this.lang.isArabic() 
          ? 'تم إرسال رمز التحقق إلى رقم هاتفك.' 
          : 'A verification code has been sent to your number.'
      );
      this.step.set('code');
    } else {
      this.error.set(
        this.lang.isArabic() ? 'لم يتم العثور على حساب مسجل برقم الهاتف هذا.' : 'No account found with that phone number.'
      );
    }
  }

  submitCode() {
    this.error.set('');
    if (!this.confirmCode.trim()) {
      this.error.set(
        this.lang.isArabic() ? 'يرجى إدخال رمز التحقق.' : 'Please enter the verification code.'
      );
      return;
    }
    this.loading.set(true);
    const valid = this.auth.correctCode(this.confirmCode.trim());
    this.loading.set(false);
    if (valid) {
      this.success.set('');
      this.step.set('newPassword');
    } else {
      this.error.set(
        this.lang.isArabic() ? 'الرمز غير صحيح، يرجى المحاولة مرة أخرى.' : 'Incorrect code. Please try again.'
      );
    }
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

  const wasLoggedIn = this.auth.isLoggedIn();

  this.loading.set(true);
  const updated = this.auth.updatePassword(this.phone, this.newPassword);
  this.loading.set(false);

  if (updated) {
    if (wasLoggedIn) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  } else {
    this.error.set(
      this.lang.isArabic() ? 'حدث خطأ، يرجى المحاولة مرة أخرى.' : 'Please try again.'
    );
  }
}

  resendCode() {
    this.error.set('');
    this.success.set(
      this.lang.isArabic() ? 'تم إرسال رمز جديد بنجاح.' : 'A new code has been sent.'
    );
  }
}