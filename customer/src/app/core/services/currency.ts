import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Currency = 'EGP' | 'USD' | 'EUR' | 'SAR' | 'AED';

export interface CurrencyConfig {
  code: Currency;
  label: string;
  symbol: string;
  rate: number; 
}

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  readonly currencies: CurrencyConfig[] = [
    { code: 'EGP', label: 'Egyptian Pound', symbol: 'EGP', rate: 1 },
    { code: 'USD', label: 'US Dollar',       symbol: '$',   rate: 0.020 },
    { code: 'EUR', label: 'Euro',             symbol: '€',   rate: 0.019 },
    { code: 'SAR', label: 'Saudi Riyal',      symbol: 'SAR', rate: 0.076 },
    { code: 'AED', label: 'UAE Dirham',       symbol: 'AED', rate: 0.074 },
  ];

  private _currency = signal<Currency>(this.loadCurrency());
  current = computed(() => this.currencies.find(c => c.code === this._currency())!);

  private loadCurrency(): Currency {
    if (!this.isBrowser) return 'EGP';
    return (localStorage.getItem('choooc_currency') as Currency) || 'EGP';
  }

  setCurrency(code: Currency) {
    this._currency.set(code);
    if (this.isBrowser) localStorage.setItem('choooc_currency', code);
  }

 
  format(egpAmount: number): string {
    const c = this.current();
    const converted = egpAmount * c.rate;
    const formatted = converted % 1 === 0
      ? converted.toFixed(0)
      : converted.toFixed(2);
    return `${c.symbol} ${formatted}`;
  }

  convert(egpAmount: number): number {
    return egpAmount * this.current().rate;
  }
}