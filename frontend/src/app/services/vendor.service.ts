import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';


export interface Vendor {
  id: number;
  companyName: string;
  contactEmail: string;
  status: 'Verified' | 'PendingApproval';
}

@Injectable({ providedIn: 'root' })
export class VendorService {
  private apiUrl = `${environment.apiUrl}/Admin/vendors`;

  constructor(private http: HttpClient) {}

  getVendors(): Observable<Vendor[]> {
  return this.http.get<Vendor[]>(this.apiUrl);
}

approveVendor(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {});
  }

  sendInvitation(companyName: string, contactEmail: string): Observable<any> {
    return this.http.post(
      this.apiUrl,
      { companyName, contactEmail });
  }

  rejectVendor(id: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}/reject`, {});
}

deleteVendor(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}

getVendorById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`);
}
}

