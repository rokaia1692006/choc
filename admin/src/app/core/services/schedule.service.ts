import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { ScheduleSettings } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private http = inject(HttpClient);
  private api = `${API_URL}/admin/schedule`;

  closedDays(from: string, to: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.api}/days`, { params: { from, to } });
  }

  setClosed(date: string, closed: boolean): Observable<void> {
    return this.http.put<void>(`${this.api}/days/${date}`, { closed });
  }

  settings(): Observable<ScheduleSettings> {
    return this.http.get<ScheduleSettings>(`${this.api}/settings`);
  }

  saveSettings(s: ScheduleSettings): Observable<void> {
    return this.http.put<void>(`${this.api}/settings`, s);
  }
}