import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';

type Step = 'phone' | 'code' | 'newPassword';

@Component({
  selector: 'app-forget-pass-page',
  imports: [FormsModule, RouterModule],
  templateUrl: './forget-pass-page.html',
  styleUrl: './forget-pass-page.css',
})
export class ForgetPassPage {
  auth = inject(AuthService);
  router = inject(Router);

  step = signal<Step>('phone');
  phone = '';
  confirmCode = '';
  newPassword = '';
  confirmNewPassword = '';
  error = signal('');
  loading = signal(false);
  success = signal('');


  //Verify phone 
  submitPhone() {
    this.error.set('');
    if (!this.phone.trim()) {
      this.error.set('Please enter your phone number.');
      return;
    }
    this.loading.set(true);
    const found = this.auth.confirmCode(this.phone.trim());
    this.loading.set(false);
    if (found) {
     
      this.success.set('A verification code has been sent to your number.');
      this.step.set('code');
    } else {
      this.error.set('No account found with that phone number.');
    }
  }

  //Verify SMS code
  submitCode() {
    this.error.set('');
    if (!this.confirmCode.trim()) {
      this.error.set('Please enter the verification code.');
      return;
    }
    this.loading.set(true);
    const valid = this.auth.correctCode(this.confirmCode.trim());
    this.loading.set(false);
    if (valid) {
      this.success.set('');
      this.step.set('newPassword');
    } else {
      this.error.set('Incorrect code. Please try again.');
    }
  }

  // new password
 submitNewPassword() {
  this.error.set('');
  if (!this.newPassword || !this.confirmNewPassword) {
    this.error.set('Please fill in both password fields.');
    return;
  }
  if (this.newPassword.length < 6) {
    this.error.set('Password must be at least 6 characters.');
    return;
  }
  if (this.newPassword !== this.confirmNewPassword) {
    this.error.set('Passwords do not match.');
    return;
  }

  const wasLoggedIn = this.auth.isLoggedIn(); // ✅ capture BEFORE updatePassword clears _user

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
    this.error.set('Please try again.');
  }
}
  resendCode() {
    this.error.set('');
    this.success.set('A new code has been sent.');
   
  }
}