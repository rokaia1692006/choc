import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({ selector: 'app-two-factor', imports: [ReactiveFormsModule], templateUrl: './two-factor.html', styleUrl: './two-factor.css' })
export class TwoFactor {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  recovery = signal(false);
  error = signal('');
  form = this.fb.nonNullable.group({ code: ['', Validators.required] });

  submit() {
    if (this.form.invalid) return;
    this.auth.verifyTwoFactor(this.form.getRawValue().code.replace(/\s/g, ''), this.recovery()).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.error.set('That code did not work. Check your authenticator app and try again.'),
    });
  }
}
