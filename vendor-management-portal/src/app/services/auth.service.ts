import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, User, UserRole, VendorSubmissionRequest } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'vendor_portal_token';
  private readonly USER_KEY = 'vendor_portal_user';
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  // CHANGED: The response type is now an object with just a token property
  login(credentials: LoginRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/api/Auth/login`, credentials)
      .pipe(
        tap(response => {
          // CHANGED: We now only pass the token to setAuthData
          this.setAuthData(response.token);
        })
      );
  }

  submitVendorDetails(token: string, details: VendorSubmissionRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/Auth/submit-vendor-details/${token}`, details);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.Admin);
  }

  isLeadership(): boolean {
    return this.hasRole(UserRole.Leadership);
  }

  isVendor(): boolean {
    return this.hasRole(UserRole.Vendor);
  }

  // CHANGED: The method now only accepts a token and decodes it internally
  private setAuthData(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    
    const user = this.decodeToken(token); // Decode the token to get the user

    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
    } else {
      localStorage.removeItem(this.USER_KEY);
      this.currentUserSubject.next(null);
    }
    
    this.isAuthenticatedSubject.next(true);
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  // NEW: This helper function decodes the JWT payload
  private decodeToken(token: string): User | null {
    try {
      // 1. Get the payload from the token (the middle part)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // 2. Define the key for the role claim (from your backend's JWT setup)
      const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

      // 3. Build the User object from the token's claims
      const user: User = {
        id: payload.sub,
        email: payload.email,
        role: payload[roleClaim] as UserRole,
      };
      return user;

    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  }
}