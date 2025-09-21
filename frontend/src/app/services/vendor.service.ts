

// src/app/services/vendor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Vendor {
  id: number;
  companyName: string;
  contactEmail: string;
  status: 'approved' | 'pending' | 'requesting' | 'inactive';
}

@Injectable({ providedIn: 'root' })
export class VendorService {
  private apiUrl = 'http://localhost:5138/api/Admin/vendors'; // adjust base URL as needed

  constructor(private http: HttpClient) {}

  // Send invitation with companyName + email
  sendInvitation(companyName: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { companyName, contactEmail: email });
  }

  // Approve vendor
   getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(this.apiUrl);
  }

  // ✅ Approve vendor
  approveVendor(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {});
  }

  // ✅ Reject vendor (or delete if backend expects that)
  rejectVendor(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, {});
    // If backend deletes instead, use:
    // return this.http.delete(`${this.apiUrl}/${id}`);
  }

  deleteVendor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getVendorById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/vendors/${id}`);
}


}

