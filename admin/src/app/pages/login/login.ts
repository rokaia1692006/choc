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
      next: r => this.router.navigate([r.requiresTwoFactor ? '/two-factor' : '/']),
      error: e => { this.busy.set(false); this.error.set(e.status === 423 ? 'Account locked. Try again in 15 minutes.' : 'Email or password is wrong.'); },
    });
  }
}
