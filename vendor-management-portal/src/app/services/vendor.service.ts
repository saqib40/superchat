import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, CreateEmployeeRequest, UpdateEmployeeDto } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private readonly baseUrl = `${environment.apiUrl}/api/Vendor`;

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/employees`);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/employees/${id}`);
  }

  createEmployee(request: CreateEmployeeRequest): Observable<any> {
    const formData = new FormData();
    formData.append('FirstName', request.firstName);
    formData.append('LastName', request.lastName);
    
    if (request.jobTitle) {
      formData.append('JobTitle', request.jobTitle);
    }
    
    if (request.resumeFile) {
      formData.append('ResumeFile', request.resumeFile);
    }

    return this.http.post(`${this.baseUrl}/employees`, formData);
  }

  updateEmployee(id: number, request: UpdateEmployeeDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/employees/${id}`, request);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/employees/${id}`);
  }
}
