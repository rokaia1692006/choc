import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../api.config';
import { AdminUser } from '../models/user.model';

export interface LoginResult {
  requiresTwoFactor: boolean;
  requiresTwoFactorSetup?: boolean;
  requiresEmailVerification?: boolean;
  requiresPasswordChange?: boolean;
  user?: AdminUser;
}
export interface TwoFactorSetupData {
  secret: string;
  otpAuthUri: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  readonly user = signal<AdminUser | null>(null);
  readonly requiresPasswordChange = signal(false);
  readonly isLoggedIn = computed(() => this.user() !== null);

  login(email: string, password: string): Observable<LoginResult> {
    return this.http
      .post<LoginResult>(`${API_URL}/auth/login`, { email, password })
      .pipe(tap(r => {
        r.user && this.user.set(r.user);
        this.requiresPasswordChange.set(r.requiresPasswordChange ?? false);
      }));
  }

  verifyFirstLoginEmailCode(code: string): Observable<void> {
    return this.http.post<void>(`${API_URL}/auth/email/verify`, { code });
  }

  setupTwoFactor() {
    return this.http.post<TwoFactorSetupData>(`${API_URL}/auth/2fa/setup`, {});
  }

  verifyTwoFactor(code: string, isRecoveryCode = false): Observable<AdminUser> {
    return this.http
      .post<AdminUser>(`${API_URL}/auth/2fa`, { code, isRecoveryCode })
      .pipe(tap(u => this.user.set(u)));
  }
    startTwoFactorSetup(): Observable<TwoFactorSetupData> {
    return this.http.post<TwoFactorSetupData>(`${API_URL}/auth/2fa/setup`, {});
  }

  confirmTwoFactorSetup(code: string): Observable<AdminUser> {
    return this.http
      .post<AdminUser>(`${API_URL}/auth/2fa/enable`, { code })
      .pipe(tap(u => this.user.set(u)));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${API_URL}/auth/password/change`, {
      currentPassword,
      newPassword,
    });
  }

  me(): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${API_URL}/auth/me`).pipe(tap(u => {
      this.user.set(u);
      this.requiresPasswordChange.set(u.requiresPasswordChange ?? false);
    }));
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${API_URL}/auth/logout`, {}).pipe(tap(() => {
      this.user.set(null);
      this.requiresPasswordChange.set(false);
    }));
  }
}