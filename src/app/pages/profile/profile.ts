import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { LanguageService } from '../../core/services/language';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  auth = inject(AuthService);
  router = inject(Router);
  lang = inject(LanguageService); 
  editing = signal(false);
  saved = signal(false);
  error = signal<string | null>(null); 

  form = {
    name: this.auth.user()?.name || '',
    phone: this.auth.user()?.phone || '',
    address: this.auth.user()?.address || '',
    city: this.auth.user()?.city || '',
    apartment: this.auth.user()?.apartment || '',
  };

  save() {
    this.error.set(null);
    this.saved.set(false);
    if (!this.form.name || !this.form.phone || !this.form.address || !this.form.city) {
      this.error.set(
        this.lang.isArabic() 
          ? 'يرجى ملء جميع الحقول المطلوبة.' 
          : 'Please fill in all required fields.'
      );
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
    this.form.phone = cleanPhone;

    this.auth.updateProfile(this.form);
    this.editing.set(false);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  forgetPass() {
    this.router.navigate(['forgetpass']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}