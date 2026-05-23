import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  auth = inject(AuthService);
  router = inject(Router);

  form = {
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    apartment: ''
  };

  error = signal('');
  loading = signal(false);

  submit() {
    if (!this.form.name || !this.form.phone || !this.form.password || !this.form.address || !this.form.city) {
      this.error.set('Please fill in all required fields.');
      return;
    }
    if (this.form.password !== this.form.confirmPassword) {
      this.error.set('Passwords do not match.');
      return;
    }
    if (this.form.password.length < 6) {
      this.error.set('Password must be at least 6 characters.');
      return;
    }

    this.loading.set(true);
    const success = this.auth.register(this.form);
    this.loading.set(false);

    if (success) {
      this.router.navigate(['/']);
    } else {
      this.error.set('This phone number is already registered.');
    }
  }
}