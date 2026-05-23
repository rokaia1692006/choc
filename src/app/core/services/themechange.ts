import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  isDark = signal<boolean>(false);

  constructor() {
    if (this.isBrowser) {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDark.set(saved ? saved === 'dark' : prefersDark);
    }

    effect(() => {
      if (this.isBrowser) {
        document.documentElement.classList.toggle('dark', this.isDark());
        localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
      }
    });
  }

  toggle() {
    this.isDark.update(v => !v);
  }
}