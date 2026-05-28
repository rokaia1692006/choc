import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { LanguageService } from '../../core/services/language';
import { LanguagesPipe } from '../../shared/pipes/languages-pipe'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, LanguagesPipe],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  auth = inject(AuthService);
  router = inject(Router);
  lang = inject(LanguageService);

  phone = '';
  password = '';
  error = signal('');
  loading = signal(false);

  submit() {
    this.error.set('');

    if (!this.phone || !this.password) {
      this.error.set(
        this.lang.isArabic() 
          ? 'يرجى ملء جميع الحقول المطلوبة.' 
          : 'Please fill in all fields.'
      );
      return;
    }

    const egPhoneRegex = /^(?:\+22)?(?:\+20|20|0)?1[0125]\d{8}$/;
    const cleanPhone = this.phone.trim().replace(/\s+/g, '');

    if (!egPhoneRegex.test(cleanPhone)) {
      this.error.set(
        this.lang.isArabic()
          ? 'يرجى إدخال رقم هاتف مصري صحيح (مثال: ٠١٠١٢٣٤٥٦٧٨).'
          : 'Please enter a valid Egyptian phone number (e.g., 01012345678).'
      );
      return;
    }

    this.loading.set(true);
    const success = this.auth.login(cleanPhone, this.password);
    this.loading.set(false);

    if (success) {
      this.router.navigate(['/']);
    } else {
      this.error.set(
        this.lang.isArabic() 
          ? 'رقم الهاتف أو كلمة المرور غير صحيحة.' 
          : 'Invalid phone number or password.'
      );
    }
  }
}