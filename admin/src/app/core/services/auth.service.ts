import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../api.config';
import { AdminUser } from '../models/user.model';

export interface LoginResult {
  requiresTwoFactor: boolean;
  requiresTwoFactorSetup?: boolean;
  user?: AdminUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  readonly user = signal<AdminUser | null>(null);
  readonly isLoggedIn = computed(() => this.user() !== null);

  login(email: string, password: string): Observable<LoginResult> {
    return this.http
      .post<LoginResult>(`${API_URL}/auth/login`, { email, password })
      .pipe(tap(r => r.user && this.user.set(r.user)));
  }

  verifyTwoFactor(code: string, isRecoveryCode = false): Observable<AdminUser> {
    return this.http
      .post<AdminUser>(`${API_URL}/auth/2fa`, { code, isRecoveryCode })
      .pipe(tap(u => this.user.set(u)));
  }

  me(): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${API_URL}/auth/me`).pipe(tap(u => this.user.set(u)));
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${API_URL}/auth/logout`, {}).pipe(tap(() => this.user.set(null)));
  }
}