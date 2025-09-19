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
}

