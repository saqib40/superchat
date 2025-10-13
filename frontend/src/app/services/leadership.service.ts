// src/app/services/leadership.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Vendor, Job, JobDetail, EmployeeDetail, JobApplicationDto } from '../models';

@Injectable({ providedIn: 'root' })
export class LeadershipService {
  private apiUrl = `${environment.apiUrl}/Leadership`;

  constructor(private http: HttpClient) {}

  getVendorsByCountry(country: string): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors`, { params: { country } });
  }
  
  createVendor(data: { companyName: string; contactEmail: string, country: string }): Observable<Vendor> {
    return this.http.post<Vendor>(`${this.apiUrl}/vendors`, data);
  }

  deleteVendor(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vendors/${publicId}`);
  }

  getMyCreatedJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`);
  }

  getJobDetails(publicId: string): Observable<JobDetail> {
    return this.http.get<JobDetail>(`${this.apiUrl}/jobs/${publicId}`);
  }
  
  createJob(data: any): Observable<Job> {
    return this.http.post<Job>(`${this.apiUrl}/jobs`, data);
  }

  // --- NEW METHOD ---
  /**
   * Calls the API to soft-delete a job.
   */
  deleteJob(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/jobs/${publicId}`);
  }

  getEmployeeDetails(publicId: string): Observable<EmployeeDetail> {
    return this.http.get<EmployeeDetail>(`${this.apiUrl}/employees/${publicId}`);
  }

  getApplicationsForJob(jobPublicId: string, status?: string): Observable<JobApplicationDto[]> {
    let params: { [key: string]: string } = {};
    if (status) {
      params['status'] = status;
    }
    return this.http.get<JobApplicationDto[]>(`${this.apiUrl}/jobs/${jobPublicId}/applications`, { params });
  }

  // --- NEW METHOD ---
  /**
   * Gets a global list of all candidates hired by the current leader.
   */
  getHiredApplications(): Observable<JobApplicationDto[]> {
    return this.http.get<JobApplicationDto[]>(`${this.apiUrl}/applications/hired`);
  }

  updateApplicationStatus(applicationPublicId: string, newStatus: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/applications/${applicationPublicId}/status`, { newStatus });
  }

  updateJobStatus(jobPublicId: string, newStatus: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/jobs/${jobPublicId}/status`, { newStatus });
  }

  addApplicationNote(applicationPublicId: string, feedback: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/${applicationPublicId}/notes`, { feedback });
  }
}