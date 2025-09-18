// src/app/services/vendor.service.ts
import { Injectable } from '@angular/core';
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
}
