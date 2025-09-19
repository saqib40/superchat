/*import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-vendor-list',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './vendor-list.component.html',
  styleUrl: './vendor-list.component.css'
})
export class VendorListComponent {

}*/

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Vendor {
  name: string;
  email: string;
  status: 'approved' | 'pending' | 'requesting' | 'inactive';
}

@Component({
  selector: 'app-vendor-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css'],
})
export class VendorListComponent {
  // Temporary mock data — replace with API call when backend is ready
  vendors: Vendor[] = [
    { name: 'ABC Supplies', email: 'abc@supplies.com', status: 'approved' },
    { name: 'XYZ Traders', email: 'xyz@traders.com', status: 'pending' },
  ];

  // Helper to show friendly label
  statusLabel(status: Vendor['status']) {
    switch (status) {
      case 'approved': return 'Approved';
      case 'pending': return 'Pending';
      case 'requesting': return 'Requesting';
      default: return 'Inactive';
    }
  }
}

