import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  busy = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(12), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/)]],
    confirmPassword: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;

    const { currentPassword, newPassword, confirmPassword } = this.form.getRawValue();
    if (newPassword !== confirmPassword) {
      this.error.set('New passwords do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      this.error.set('Choose a password that is different from the current password.');
      return;
    }

    this.busy.set(true);
    this.error.set('');
    this.auth.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.auth.requiresPasswordChange.set(false);
        this.router.navigate(['/']);
      },
      error: err => {
        this.busy.set(false);
        this.error.set(err.status === 400
          ? 'The current password is wrong or the new password is not accepted.'
          : 'Could not change the password. Please try again.');
      },
    });
  }
}
