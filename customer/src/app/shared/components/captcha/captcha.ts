import { Component, ElementRef, OnDestroy, PLATFORM_ID, ViewChild, AfterViewInit, inject, output, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TURNSTILE_SITE_KEY } from '../../../../environments/env';

declare const turnstile: {
  render(el: HTMLElement, opts: object): string;
  reset(id: string): void;
  remove(id: string): void;
};

@Component({
  selector: 'app-captcha',
  standalone: true,
  templateUrl: './captcha.html',
  styleUrl: './captcha.css',
})
export class Captcha implements AfterViewInit, OnDestroy {
  @ViewChild('box') box!: ElementRef<HTMLElement>;
  solved = output<string>();
  expired = output<void>();
  configurationError = signal('');

  private platformId = inject(PLATFORM_ID);
  private widgetId: string | null = null;

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!TURNSTILE_SITE_KEY) {
      this.configurationError.set('CAPTCHA is unavailable: configure a Cloudflare Turnstile site key.');
      return;
    }
    this.whenReady(() => {
      this.widgetId = turnstile.render(this.box.nativeElement, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => this.solved.emit(token),
        'expired-callback': () => this.expired.emit(),
      });
    });
  }

  reset() {
    if (this.widgetId) turnstile.reset(this.widgetId);
  }

  ngOnDestroy() {
    if (this.widgetId) turnstile.remove(this.widgetId);
  }

  private whenReady(run: () => void) {
    if (typeof turnstile !== 'undefined') return run();
    setTimeout(() => this.whenReady(run), 100);
  }
}