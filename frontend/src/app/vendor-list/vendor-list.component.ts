

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Vendor {
  name: string;
  email: string;
  status: 'approved' | 'pending' | 'requesting' | 'inactive';
}

@Component({
  selector: 'app-vendor-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css'],
})
export class VendorListComponent {
  searchTerm:string='';
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

  approveVendor(v: Vendor) {
  v.status = 'approved';
}

rejectVendor(v: Vendor) {
  const confirmDelete = window.confirm(
    `Are you sure you want to reject vendor "${v.name}"? This action cannot be undone.`
  );

  if (confirmDelete) {
    this.vendors = this.vendors.filter(x => x !== v);
  }
}

  get filteredVendors(): Vendor[] {
    if (!this.searchTerm.trim()) {
      return this.vendors;
    }
    const term = this.searchTerm.toLowerCase();
    return this.vendors.filter(v =>
      v.name.toLowerCase().includes(term) || v.email.toLowerCase().includes(term)
    );
  }
}

