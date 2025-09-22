import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/Auth';

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data);
  }

   submitVendorDetails(token: string, payload: { firstName: string; lastName: string; password: string; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit-vendor-details/${token}`, payload);
  }
}
