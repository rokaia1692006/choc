import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as QRCode from 'qrcode';
import { AuthService } from '../../core/services/auth.service';

@Component({ selector: 'app-two-factor-setup', imports: [ReactiveFormsModule], templateUrl: './two-factor.html', styleUrl: './two-factor.css' })
export class TwoFactorSetup implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  qr = signal('');
  error = signal('');
  busy = signal(false);
  form = this.fb.nonNullable.group({ code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]] });
  isSetup = signal(false);

  ngOnInit() {
    this.isSetup.set(this.router.url.split('?')[0].endsWith('/two-factor-setup'));

    if (!this.isSetup()) return;

    this.auth.startTwoFactorSetup().subscribe({
      next: r => QRCode.toDataURL(r.otpAuthUri, { margin: 1, width: 220 })
        .then(url => this.qr.set(url))
        .catch(() => this.error.set('Could not draw the QR code. Reload the page.')),
      error: err => this.error.set(
        err.status === 401
          ? 'Your session expired. Sign in again.'
          : 'Could not prepare the QR code. Reload the page.'
      ),
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.busy.set(true); this.error.set('');

    const confirmation = this.isSetup()
      ? this.auth.confirmTwoFactorSetup(this.form.getRawValue().code)
      : this.auth.verifyTwoFactor(this.form.getRawValue().code);

    confirmation.subscribe({
      next: () => this.router.navigate([this.auth.requiresPasswordChange() ? '/change-password' : '/']),
      error: () => { this.busy.set(false); this.error.set('That code did not match. Wait for a new one and try again.'); },
    });
  }
}