import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import * as QRCode from 'qrcode';
import { API_URL } from '../../core/api.config';
import { AuthService } from '../../core/services/auth.service';

interface Setup { sharedKey: string; otpauthUri: string; qr: string; }

@Component({ selector: 'app-settings', imports: [ReactiveFormsModule], templateUrl: './settings.html', styleUrl: './settings.css' })
export class Settings {
  auth = inject(AuthService);
  private http = inject(HttpClient);
  setup = signal<Setup | null>(null);
  codes = signal<string[]>([]);
  error = signal('');
  code = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  start() {
    this.error.set('');
    this.http.get<Omit<Setup, 'qr'>>(`${API_URL}/auth/2fa/setup`).subscribe({
      next: async s => this.setup.set({ ...s, qr: await QRCode.toDataURL(s.otpauthUri, { margin: 1, width: 200 }) }),
      error: () => this.error.set('Could not start setup. Try again.'),
    });
  }
  enable() {
    this.http.post<{ recoveryCodes: string[] }>(`${API_URL}/auth/2fa/enable`, { code: this.code.value.replace(/\s/g, '') }).subscribe({
      next: r => { this.codes.set(r.recoveryCodes); this.setup.set(null); this.auth.user.update(u => (u ? { ...u, twoFactorEnabled: true } : u)); },
      error: () => this.error.set('That code did not match. Check the app and try again.'),
    });
  }
}
