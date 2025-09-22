import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DashboardData, SearchResult, Vendor, VendorStatus, Employee } from '../models';
import { environment } from '../../environments/environment';

// Define the shape of the backend's search response
interface BackendSearchResult {
  type: string;
  results: SearchResult[];
}

@Injectable({
  providedIn: 'root'
})
export class LeadershipService {
  private readonly baseUrl = `${environment.apiUrl}/api/Leadership`;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<Vendor[]>(`${this.baseUrl}/dashboard`).pipe(
      map(vendors => {
        const totalVendors = vendors.length;
        const approvedVendors = vendors.filter(v => v.status === VendorStatus.Approved).length;
        const pendingVendors = vendors.filter(v => v.status === VendorStatus.Pending).length;
        
        const dashboardData: DashboardData = {
          totalVendors,
          approvedVendors,
          pendingVendors,
          totalEmployees: 0,
          recentActivity: []
        };
        return dashboardData;
      })
    );
  }

  search(type: string, query: string): Observable<SearchResult[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    if (query) params = params.set('query', query);
    
    return this.http.get<BackendSearchResult>(`${this.baseUrl}/search`, { params }).pipe(
      map(response => response.results || [])
    );
  }

  getVendor(id: number): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.baseUrl}/vendors/${id}`);
  }

  // This function remains, as it's used by the vendor details page
  getEmployee(vendorId: number, employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/vendors/${vendorId}/employees/${employeeId}`);
  }
}