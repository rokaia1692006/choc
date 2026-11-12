import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../core/models/user.model';

@Component({ selector: 'app-customers', imports: [DatePipe], templateUrl: './customers.html', styleUrl: './customers.css' })
export class Customers implements OnInit {
  private svc = inject(CustomerService);
  all = signal<Customer[]>([]);
  q = signal('');
  error = signal('');
  shown = computed(() => {
    const q = this.q().trim().toLowerCase();
    return q ? this.all().filter(c => `${c.name} ${c.phone} ${c.city}`.toLowerCase().includes(q)) : this.all();
  });
  ngOnInit() { this.svc.list().subscribe({ next: c => this.all.set(c), error: () => this.error.set('Could not load customers.') }); }
}
