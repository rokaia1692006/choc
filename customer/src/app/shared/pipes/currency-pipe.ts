import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyService } from '../../core/services/currency';

@Pipe({
  name: 'currency',
  pure: false 
})
export class CurrencyPipe implements PipeTransform {
  private currencyService = inject(CurrencyService);

  transform(egpAmount: number): string {
    return this.currencyService.format(egpAmount);
  }
}