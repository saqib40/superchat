import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5138/api/Auth';
  constructor(private http: HttpClient) {}
 
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // saved during login
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }
 
  login(data: { email: string; password: string }): Observable<{ token: string }> {
    // Login usually doesn’t need token
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
 
  submitVendorDetails(
    token: string,
    payload: { firstName: string; lastName: string; password: string }
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/submit-vendor-details/${token}`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }
}