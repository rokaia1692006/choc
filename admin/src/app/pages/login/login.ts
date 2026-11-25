import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({ selector: 'app-login', imports: [ReactiveFormsModule], templateUrl: './login.html', styleUrl: './login.css' })
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  busy = signal(false);
  error = signal('');
  form = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });

  submit() {
    if (this.form.invalid) return;
    this.busy.set(true); this.error.set('');
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: r => this.router.navigate([
  r.requiresEmailVerification
    ? '/email-verification'
    : r.requiresTwoFactorSetup
      ? '/two-factor-setup'
      : r.requiresTwoFactor
        ? '/two-factor'
        : r.requiresPasswordChange
          ? '/change-password'
          : '/'
]),
      error: e => {
        this.busy.set(false);
        this.error.set(e.status === 423
          ? 'Account locked. Try again in 15 minutes.'
          : e.status === 401
            ? 'Email or password is wrong.'
            : e.status === 403
              ? 'The server blocked this sign-in request. Check the admin request header and CORS settings.'
              : e.status === 503
                ? 'The verification email could not be sent. Check the backend SMTP settings.'
                : e.status === 0
                  ? 'Unable to connect to the sign-in service. Check the backend URL, that the backend is running, and its CORS settings.'
                  : e.status >= 500
                    ? `The sign-in service returned an error (${e.status}). Check the backend logs.`
                    : `Sign-in failed with an unexpected response (${e.status}).`);
      },
    });
  }
}
