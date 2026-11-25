import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { StaffService } from '../../core/services/staff.service';

@Component({
  selector: 'app-staff-activation',
  imports: [FormsModule, RouterLink],
  templateUrl: './staff-activation.html',
  styleUrl: './staff-activation.css',
})
export class StaffActivationPage {
  private readonly staffApi = inject(StaffService);
  email = '';
  code = '';
  password = '';
  confirmPassword = '';
  error = signal('');
  complete = signal(false);
  submitting = signal(false);

  activate() {
    this.error.set('');
    if (this.password !== this.confirmPassword) {
      this.error.set('The passwords do not match.');
      return;
    }
    if (this.submitting()) return;

    this.submitting.set(true);
    this.staffApi.activateInvitation({
      email: this.email.trim(),
      code: this.code.trim().toUpperCase(),
      password: this.password,
    }).subscribe({
      next: () => {
        this.complete.set(true);
        this.submitting.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(error.status === 400
          ? 'Choose a password with at least 12 characters, including upper-case, lower-case, a number, and a symbol.'
          : 'That invitation could not be verified. Check the email and code, or ask the administrator to resend it.');
        this.submitting.set(false);
      },
    });
  }
}