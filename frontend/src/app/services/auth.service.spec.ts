// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Keep this import
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient) {}

  // This new method is our "seam" for testing.
  // We can easily spy on it.
  private decodeToken(token: string): any {
    return jwtDecode(token);
  }

  login(data: { email: string; password: string; captchaToken: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data);
  }

  setupVendor(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/setup-vendor/${token}`, { password });
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  public getDecodedToken(): any | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Use the new wrapper method here.
        return this.decodeToken(token);
      } catch (e) {
        console.error('Error decoding token:', e);
        return null;
      }
    }
    return null;
  }

  getUserRole(): string | string[] | null {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return roleClaim || null;
    }
    return null;
  }
}