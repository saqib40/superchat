import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendor, CreateVendorRequest, RejectVendorRequest } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = `${environment.apiUrl}/api/Admin`;

  constructor(private http: HttpClient) {}

  getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.baseUrl}/vendors`);
  }

  getVendor(id: number): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.baseUrl}/vendors/${id}`);
  }

  createVendor(request: CreateVendorRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/vendors`, request);
  }

  approveVendor(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/vendors/${id}/approve`, {});
  }

  rejectVendor(id: number, request: RejectVendorRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/vendors/${id}/reject`, request);
  }

  deleteVendor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/vendors/${id}`);
  }
}
