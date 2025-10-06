// src/app/services/vendor.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Job, Employee } from '../models';

@Injectable({ providedIn: 'root' })
export class VendorService {
  private apiUrl = `${environment.apiUrl}/Vendor`;

  constructor(private http: HttpClient) {}

  getMyAssignedJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`);
  }

  getEmployeesForJob(jobPublicId: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/jobs/${jobPublicId}/employees`);
  }

  createEmployee(formData: FormData): Observable<Employee> {
    // Note: The backend expects multipart/form-data, so we send FormData directly
    return this.http.post<Employee>(`${this.apiUrl}/employees`, formData);
  }

  deleteEmployee(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/employees/${publicId}`);
  }
}