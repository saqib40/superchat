

// src/app/services/vendor.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


export interface Vendor {
  id: number;
  companyName: string;
  contactEmail: string;
  status: 'approved' | 'pending' | 'requesting' | 'inactive';
}

@Injectable({ providedIn: 'root' })
export class VendorService {
  private apiUrl = 'http://localhost:5138/api/Admin/vendors';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('token'); // ✅ only one argument
  return new HttpHeaders({
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  });
}


  getVendors(): Observable<Vendor[]> {
  return this.http.get<Vendor[]>(this.apiUrl, {
    headers: this.getAuthHeaders()
  });
}

approveVendor(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}/approve`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  sendInvitation(companyName: string, contactEmail: string): Observable<any> {
    return this.http.post(
      this.apiUrl,
      { companyName, contactEmail },
      { headers: this.getAuthHeaders() }
    );
  }

  rejectVendor(id: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}/reject`, {}, {
    headers: this.getAuthHeaders()
  });
  // If backend deletes instead, use:
  // return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
}

deleteVendor(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`, {
    headers: this.getAuthHeaders()
  });
}

getVendorById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`, {
    headers: this.getAuthHeaders()
  });
}
}

