import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Job, Employee, VendorJobDetailDto } from '../models';

@Injectable({ providedIn: 'root' })
export class VendorService {
  private apiUrl = `${environment.apiUrl}/Vendor`;

  constructor(private http: HttpClient) {}

  getMyAssignedJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`);
  }

  getAssignedJobDetails(jobPublicId: string): Observable<VendorJobDetailDto> {
    return this.http.get<VendorJobDetailDto>(`${this.apiUrl}/jobs/${jobPublicId}`);
  }

  createEmployee(formData: FormData): Observable<Employee> {
    // Note: The backend expects multipart/form-data, so we send FormData directly
    return this.http.post<Employee>(`${this.apiUrl}/employees`, formData);
  }

  deleteEmployee(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/employees/${publicId}`);
  }
}