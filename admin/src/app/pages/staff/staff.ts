import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { StaffMember } from '../../core/models/staff.model';
import { StaffService } from '../../core/services/staff.service';

@Component({
  selector: 'app-staff',
  imports: [FormsModule],
  templateUrl: './staff.html',
  styleUrl: './staff.css',
})
export class StaffPage implements OnInit {
  private readonly staffApi = inject(StaffService);
  name = '';
  email = '';
  staff = signal<StaffMember[]>([]);
  error = signal('');
  notice = signal('');
  loading = signal(true);
  submitting = signal(false);
  resendingId = signal<string | null>(null);

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.staffApi.list().subscribe({
      next: staff => {
        this.staff.set(staff);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load staff accounts. Try refreshing the page.');
        this.loading.set(false);
      },
    });
  }

  addStaff() {
    const name = this.name.trim();
    const email = this.email.trim();
    if (!name || !email || this.submitting()) return;

    this.error.set('');
    this.notice.set('');
    this.submitting.set(true);
    this.staffApi.create({ name, email }).subscribe({
      next: member => {
        this.staff.update(entries => [...entries, member].sort((a, b) => a.name.localeCompare(b.name)));
        this.name = '';
        this.email = '';
        this.notice.set(`Invitation sent to ${member.email}.`);
        this.submitting.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(error.status === 409
          ? 'An account with this email already exists.'
          : error.status === 503
            ? 'The account may have been created, but email delivery failed. Check the roster and retry the invitation.'
            : 'Could not add this staff member. Try again.');
        this.submitting.set(false);
        if (error.status === 503) this.load();
      },
    });
  }

  resendInvitation(member: StaffMember) {
    if (this.resendingId()) return;
    this.error.set('');
    this.notice.set('');
    this.resendingId.set(member.id);
    this.staffApi.resendInvitation(member.id).subscribe({
      next: () => {
        this.notice.set(`A new invitation was sent to ${member.email}.`);
        this.resendingId.set(null);
      },
      error: () => {
        this.error.set(`Could not resend the invitation to ${member.email}.`);
        this.resendingId.set(null);
      },
    });
  }
}