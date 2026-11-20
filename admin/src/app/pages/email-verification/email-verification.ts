import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-email-verification',
  imports: [ReactiveFormsModule],
  templateUrl: './email-verification.html',
  styleUrl: './email-verification.css',
})
export class EmailVerification {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  busy = signal(false);
  error = signal('');
  form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern(/^[A-Z2-7]{6}$/i)]],
  });

  submit() {
    if (this.form.invalid) return;
    this.busy.set(true);
    this.error.set('');
    this.auth.verifyFirstLoginEmailCode(this.form.getRawValue().code.trim().toUpperCase()).subscribe({
      next: () => this.router.navigate(['/two-factor-setup']),
      error: e => {
        this.busy.set(false);
        this.error.set(e.status === 429
          ? 'Too many attempts. Sign in again to request a new code.'
          : 'That code is invalid or expired. Sign in again to request a new code.');
      },
    });
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}