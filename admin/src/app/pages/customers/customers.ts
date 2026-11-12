import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OnlineCustomer } from '../../core/models/customer.model';
import { CustomerService } from '../../core/services/customer.service';
import { ErrorLine } from '../../shared/components/error-line/error-line';
import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe';

const REFRESH_MS = 30_000;

@Component({
  selector: 'app-customers',
  imports: [FormsModule, ErrorLine, TimeAgoPipe],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class CustomersPage implements OnInit {
  private api = inject(CustomerService);
  private destroyRef = inject(DestroyRef);

  rows = signal<OnlineCustomer[]>([]);
  search = signal('');
  error = signal('');

  shown = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.rows();
    return this.rows().filter(r => `${r.name} ${r.email} ${r.phoneMasked}`.toLowerCase().includes(q));
  });

  ngOnInit() {
    this.load();
    const timer = setInterval(() => this.load(), REFRESH_MS);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }

  load() {
    this.api.online().subscribe({
      next: r => {
        this.rows.set(r);
        this.error.set('');
      },
      error: () => this.error.set('Could not refresh the list. Showing the last result.'),
    });
  }

  signOut(r: OnlineCustomer) {
    if (!confirm(`Sign ${r.name} out of this device? They will need to log in again.`)) return;
    this.api.signOut(r.sessionId).subscribe({
      next: () => this.rows.update(x => x.filter(y => y.sessionId !== r.sessionId)),
      error: () => this.error.set(`Could not sign ${r.name} out. Try again.`),
    });
  }
}