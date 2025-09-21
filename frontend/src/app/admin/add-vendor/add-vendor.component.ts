

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

 sendInvitation() {
    if (this.vendorEmail.trim()) {
      this.vendorService.sendInvitation(this.companyName, this.vendorEmail).subscribe({
        next: () => {
          this.vendorStatus = 'pending';
          this.vendorEmail = '';
        },
        error: (err) => {
          console.error('Failed to send invitation', err);
          alert('Something went wrong while sending invitation.');
        }
      });
    } else {
      alert('Please enter a valid email address.');
    }
  }

  // Simulate vendor submitting details (mock UI)
  simulateVendorDetailsSubmitted() {
    this.vendorStatus = 'requesting';
  }  
}


