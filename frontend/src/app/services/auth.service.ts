import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
 
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;
  constructor(private http: HttpClient) {}
 
  login(data: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data);
  }
 
  submitVendorDetails(token: string, payload: { firstName: string; lastName: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit-vendor-details/${token}`, payload);
  }

  getUserRole(): 'Admin' | 'Leadership' | 'Vendor' | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return roleClaim || null;
    }
    return null;
  }
}