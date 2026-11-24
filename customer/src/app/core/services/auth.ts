import { Injectable, computed, effect, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, tap } from 'rxjs';
import { User } from '../models/user';
import { API_URL } from '../api.config';

type AuthResponse = User | { user: User };
export interface VerificationCodeResponse { code: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly cacheKey = 'choooc_user';
  private _user = signal<User | null>(this.readUserCache());

  user = computed(() => this._user());
  isLoggedIn = computed(() => this._user() !== null);

  constructor() {
    effect(() => {
      const user = this._user();
      if (!this.isBrowser) return;
      if (user) localStorage.setItem(this.cacheKey, JSON.stringify(user));
      else localStorage.removeItem(this.cacheKey);
    });
    if (this.isBrowser) {
      this.http.get<AuthResponse>(`${API_URL}/customer-auth/me`, { withCredentials: true }).pipe(
        map(response => this.unwrapUser(response))
      ).subscribe({ next: user => this._user.set(user), error: () => this._user.set(null) });
    }
  }

  login(phone: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${API_URL}/customer-auth/login`, { phone, password }, { withCredentials: true }).pipe(
      map(response => this.unwrapUser(response)),
      tap(user => this._user.set(user))
    );
  }

  startRegistration(data: { name: string; phone: string; password: string; address: string; city: string; apartment?: string }): Observable<VerificationCodeResponse> {
    return this.http.post<VerificationCodeResponse>(`${API_URL}/customer-auth/register`, data, { withCredentials: true });
  }

  verifyRegistration(phone: string, code: string): Observable<User> {
    return this.http.post<AuthResponse>(`${API_URL}/customer-auth/register/verify`, { phone, code }, { withCredentials: true }).pipe(
      map(response => this.unwrapUser(response)),
      tap(user => this._user.set(user))
    );
  }

  registerAfterVerification(data: { name: string; phone: string; password: string; address: string; city: string; apartment?: string }, code: string): Observable<User> {
    return this.http.post<AuthResponse>(`${API_URL}/customer-auth/register/verified`, { profile: data, code }, { withCredentials: true }).pipe(
      map(response => this.unwrapUser(response)),
      tap(user => this._user.set(user))
    );
  }

  startPhoneVerification(phone: string, purpose: 'checkout' | 'password-reset'): Observable<VerificationCodeResponse> {
    return this.http.post<VerificationCodeResponse>(`${API_URL}/customer-auth/verification/start`, { phone, purpose }, { withCredentials: true });
  }

  resendVerification(phone: string, purpose: 'registration' | 'checkout' | 'password-reset'): Observable<VerificationCodeResponse> {
    return this.http.post<VerificationCodeResponse>(`${API_URL}/customer-auth/verification/resend`, { phone, purpose }, { withCredentials: true });
  }

  verifyPhone(phone: string, code: string, purpose: 'checkout' | 'password-reset'): Observable<void> {
    return this.http.post<void>(`${API_URL}/customer-auth/verification/confirm`, { phone, code, purpose }, { withCredentials: true });
  }

  resetPassword(phone: string, code: string, password: string): Observable<void> {
    return this.http.post<void>(`${API_URL}/customer-auth/password/reset`, { phone, code, password }, { withCredentials: true });
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.put<AuthResponse>(`${API_URL}/customers/me`, data, { withCredentials: true }).pipe(
      map(response => this.unwrapUser(response)),
      tap(user => this._user.set(user))
    );
  }

  logout(): void {
    this.http.post<void>(`${API_URL}/customer-auth/logout`, {}, { withCredentials: true }).subscribe({ complete: () => this._user.set(null), error: () => this._user.set(null) });
  }

  setUser(user: User | null): void {
    this._user.set(user);
  }

  private unwrapUser(response: AuthResponse): User {
    return 'user' in response ? response.user : response;
  }

  private readUserCache(): User | null {
    if (!this.isBrowser) return null;
    try {
      const value = localStorage.getItem(this.cacheKey);
      return value ? JSON.parse(value) as User : null;
    } catch {
      localStorage.removeItem(this.cacheKey);
      return null;
    }
  }
}