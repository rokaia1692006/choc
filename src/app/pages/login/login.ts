import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  auth = inject(AuthService);
  router = inject(Router);

  phone = '';
  password = '';
  error = signal('');
  loading = signal(false);

  submit() {
    if (!this.phone || !this.password) {
      this.error.set('Please fill in all fields.');
      return;
    }
    this.loading.set(true);
    const success = this.auth.login(this.phone, this.password);
    this.loading.set(false);
    if (success) {
      this.router.navigate(['/']);
    } else {
      this.error.set('Invalid phone number or password.');
    }
  }
}