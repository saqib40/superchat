/*import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VendorService } from '../../services/vendor.service';

@Component({
  selector: 'app-add-vendor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.css']
})
export class AddVendorComponent {
  vendorEmail: string = '';
  vendorStatus: 'idle' | 'pending' | 'requesting' | 'approved' = 'idle';

  constructor(private vendorService: VendorService) {}

  sendInvitation() {
    if (this.vendorEmail.trim()) {
      // If backend not ready, VendorService can be stubbed to return an observable.
      this.vendorService.sendInvitation(this.vendorEmail).subscribe(() => {
        this.vendorStatus = 'pending';
        this.vendorEmail = '';
      }, () => {
        // handle error (optional)
      });
    } else {
      alert('Please enter a valid email address.');
    }
  }

  simulateVendorDetailsSubmitted() {
    this.vendorStatus = 'requesting';
  }

  approveVendor() {
    this.vendorService.approveVendor(this.vendorEmail).subscribe(() => {
      this.vendorStatus = 'approved';
    });
  }
}*/

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VendorService } from '../../services/vendor.service';

@Component({
  selector: 'app-add-vendor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.css']
})
export class AddVendorComponent {
  companyName: string = '';
  vendorEmail: string = '';
  vendorStatus: 'idle' | 'pending' | 'requesting' | 'approved' = 'idle';

  constructor(private vendorService: VendorService) {}

  // Send invitation with both companyName + email
  /*sendInvitation() {
    if (this.companyName.trim() && this.vendorEmail.trim()) {
      this.vendorService.sendInvitation(this.companyName, this.vendorEmail).subscribe(
        () => {
          this.vendorStatus = 'pending';
          this.companyName = '';
          this.vendorEmail = '';
        },
        () => {
          alert('Error while sending vendor invitation');
        }
      );
    } else {
      alert('Please enter both company name and email.');
    }
  }*/
 sendInvitation() {
    if (this.vendorEmail.trim()) {
      // If backend not ready, VendorService can be stubbed to return an observable.
      this.vendorService.sendInvitation(this.companyName,this.vendorEmail).subscribe(() => {
        this.vendorStatus = 'pending';
        this.vendorEmail = '';
      }, () => {
        // handle error (optional)
      });
    } else {
      alert('Please enter a valid email address.');
    }
  }

  // Simulate vendor submitting details (mock UI)
  simulateVendorDetailsSubmitted() {
    this.vendorStatus = 'requesting';
  }

  // Approve vendor
  approveVendor() {
    this.vendorService.approveVendor(this.vendorEmail).subscribe(() => {
      this.vendorStatus = 'approved';
    });
  }
}


