import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/enviroment';
import { OnlineCustomer } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private api = environment.apiUrl + '/admin/customers';

  online(): Observable<OnlineCustomer[]> {
    return this.http.get<OnlineCustomer[]>(`${this.api}/online`);
  }

  signOut(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/online/${sessionId}`);
  }
}