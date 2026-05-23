import { Injectable, signal, computed, PLATFORM_ID, inject, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {User} from '../models/user';


interface AuthCache {
  user: User;
  expiry: number;
}

@Injectable({ providedIn: 'root' })
export class ForgetPassService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private readonly CACHE_KEY = 'choooc_user';
  private readonly EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  private _user = signal<User | null>(this.loadFromStorage());

  user = computed(() => this._user());
  isLoggedIn = computed(() => this._user() !== null);

  constructor() {
    effect(() => {
      const user = this._user();
      if (user) {
        this.saveToStorage(user);
      } 
    });
  }

  private loadFromStorage(): User | null {
    if (!this.isBrowser) return null;
    try {
      const raw = localStorage.getItem(this.CACHE_KEY);
      if (!raw) return null;
      const cached: AuthCache = JSON.parse(raw);
      if (Date.now() > cached.expiry) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }
      return cached.user;
    } catch { return null; }
  }

  private saveToStorage(user: User) {
    if (!this.isBrowser) return;
    const cached: AuthCache = { user, expiry: Date.now() + this.EXPIRY_MS };
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(cached));
  }

  register(data: { name: string; phone: string; password: string; address: string; city: string; apartment?: string }): boolean {
    if (!this.isBrowser) return false;

    const users = JSON.parse(localStorage.getItem('choooc_users') || '[]');
    const exists = users.find((u: any) => u.phone === data.phone);
    if (exists) return false; 

    const user: User = {
      id: Date.now().toString(),
      name: data.name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      apartment: data.apartment
    };

    users.push({ ...user, password: data.password });
    localStorage.setItem('choooc_users', JSON.stringify(users));
    this._user.set(user);
    return true;
  }

  login(phone: string, password: string): boolean {
    if (!this.isBrowser) return false;
    const users = JSON.parse(localStorage.getItem('choooc_users') || '[]');
    const found = users.find((u: any) => u.phone === phone && u.password === password);
    if (!found) return false;
    const { password: _, ...user } = found;
    this._user.set(user);
    return true;
  }

  updateProfile(data: Partial<User>) {
    const current = this._user();
    if (!current) return;
    this._user.set({ ...current, ...data });

    if (this.isBrowser) {
      const users = JSON.parse(localStorage.getItem('choooc_users') || '[]');
      const updated = users.map((u: any) => u.id === current.id ? { ...u, ...data } : u);
      localStorage.setItem('choooc_users', JSON.stringify(updated));
    }
  }

  logout() {
    this._user.set(null);
  }
}
