import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/enviroment';
import { Period, PeriodSummary, SeriesPoint } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private api = environment.apiUrl + '/admin/dashboard';

  summary(): Observable<PeriodSummary[]> {
    return this.http.get<PeriodSummary[]>(`${this.api}/summary`);
  }

  series(period: Period): Observable<SeriesPoint[]> {
    return this.http.get<SeriesPoint[]>(`${this.api}/series`, { params: { period } });
  }
}