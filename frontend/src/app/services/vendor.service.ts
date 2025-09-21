// src/app/services/vendor.service.ts
/*import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VendorService {
  sendInvitation(email: string): Observable<any> {
    console.log(`Simulating API: sending invitation to ${email}`);
    return of({ status: 'pending' });
  }

  approveVendor(email: string): Observable<any> {
    console.log(`Simulating API: approving vendor ${email}`);
    return of({ status: 'approved' });
  }
}*/

// src/app/services/vendor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VendorService {
  private apiUrl = 'http://localhost:5138/api'; // adjust base URL as needed

  constructor(private http: HttpClient) {}

  // Send invitation with companyName + email
  sendInvitation(companyName: string, email: string): Observable<any> {
    // When backend is ready, call the real endpoint:
    return this.http.post(`${this.apiUrl}/Admin/vendors`, { companyName, contactEmail: email });

    // For now, simulate API:
    //console.log(`Simulating API: sending invitation to ${companyName} (${email})`);
    //return of({ status: 'pending' });
  }

  // Approve vendor
  approveVendor(email: string): Observable<any> {
    // Real API example:
    // return this.http.post(`${this.apiUrl}/admin/vendors/approve`, { email });

    // Simulated response
    console.log(`Simulating API: approving vendor ${email}`);
    return of({ status: 'approved' });
  }
}

