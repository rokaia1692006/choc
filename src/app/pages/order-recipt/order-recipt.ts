import { Component, inject, signal, OnInit, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order-service';
import { Order } from '../../core/models/order';
import { CurrencyService } from '../../core/services/currency';
import { LanguageService } from '../../core/services/language';
import { LanguagesPipe } from '../../shared/pipes/languages-pipe';
import { CurrencyPipe } from '../../shared/pipes/currency-pipe';

@Component({
  selector: 'app-order-receipt',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguagesPipe, CurrencyPipe],
  templateUrl: './order-recipt.html',
  styleUrl: './order-recipt.css',
})
export class OrderRecipt implements OnInit {
  private route = inject(ActivatedRoute);
  orderService = inject(OrderService);
  currency = inject(CurrencyService);
  lang = inject(LanguageService);

  order = signal<Order | null>(null);
  errorMessage = signal<string>('');

  ngOnInit() {
    const orderId = this.route.snapshot.queryParamMap.get('id');
    const phone = this.route.snapshot.queryParamMap.get('phone');

    if (orderId && phone) {
      this.loadReceipt(orderId, phone);
    } else {
      this.errorMessage.set('Invalid receipt access token or link.');
    }
  }

  loadReceipt(id: string, phone: string) {
    const ordersList = this.orderService.getOrdersByPhone(phone);
    const found = ordersList.find(o => o.id === id);
    
    if (found) {
      this.order.set(found);
    } else {
      this.errorMessage.set('Order could not be found.');
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(
      this.lang.current() === 'ar' ? 'ar-EG' : 'en-GB',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  }

  displayItemName(item: any): string {
    return this.lang.isArabic() && item.nameAr ? item.nameAr : item.name;
  }
}