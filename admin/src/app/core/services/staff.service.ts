import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { CreateStaffRequest, StaffInvitationActivationRequest, StaffMember } from '../models/staff.model';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${API_URL}/admin/staff`;

  list(): Observable<StaffMember[]> {
    return this.http.get<StaffMember[]>(this.endpoint);
  }

  create(request: CreateStaffRequest): Observable<StaffMember> {
    return this.http.post<StaffMember>(this.endpoint, request);
  }

  resendInvitation(id: string): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/${id}/invitation`, {});
  }

  activateInvitation(request: StaffInvitationActivationRequest): Observable<void> {
    return this.http.post<void>(`${API_URL}/auth/staff-invitation/activate`, request);
  }
}