// src/app/modules/admin/vendor-list/vendor-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Import FormsModule here
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Vendor, VendorStatus, CreateVendorRequest } from '../../../models';

@Component({
  selector: 'app-vendor-list',
  standalone: true,
  // Add FormsModule to the imports array
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './vendor-list.component.html'
})
export class VendorListComponent implements OnInit {
  vendors: Vendor[] = [];
  filteredVendors: Vendor[] = [];
  isLoading = false;
  showCreateForm = false;
  showRejectModal = false;
  selectedVendor: Vendor | null = null;
  rejectReason = '';
  
  createVendorForm: FormGroup;
  searchTerm = '';
  statusFilter = '';

  VendorStatus = VendorStatus;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.createVendorForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      contactEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.loadVendors();
  }

  loadVendors() {
    this.isLoading = true;
    this.adminService.getVendors().subscribe({
      next: (vendors) => {
        this.vendors = vendors;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vendors:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredVendors = this.vendors.filter(vendor => {
      const matchesSearch = !this.searchTerm || 
        vendor.companyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vendor.contactEmail.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || vendor.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  onStatusFilterChange(event: any) {
    this.statusFilter = event.target.value;
    this.applyFilters();
  }

  createVendor() {
    if (this.createVendorForm.valid) {
      const request: CreateVendorRequest = this.createVendorForm.value;
      
      this.adminService.createVendor(request).subscribe({
        next: () => {
          this.showCreateForm = false;
          this.createVendorForm.reset();
          this.loadVendors();
        },
        error: (error) => {
          console.error('Error creating vendor:', error);
        }
      });
    }
  }

  approveVendor(vendor: Vendor) {
    this.adminService.approveVendor(vendor.id).subscribe({
      next: () => {
        this.loadVendors();
      },
      error: (error) => {
        console.error('Error approving vendor:', error);
      }
    });
  }

  openRejectModal(vendor: Vendor) {
    this.selectedVendor = vendor;
    this.showRejectModal = true;
    this.rejectReason = '';
  }

  rejectVendor() {
    if (this.selectedVendor && this.rejectReason.trim()) {
      this.adminService.rejectVendor(this.selectedVendor.id, { reason: this.rejectReason }).subscribe({
        next: () => {
          this.showRejectModal = false;
          this.selectedVendor = null;
          this.rejectReason = '';
          this.loadVendors();
        },
        error: (error) => {
          console.error('Error rejecting vendor:', error);
        }
      });
    }
  }

  deleteVendor(vendor: Vendor) {
    if (confirm(`Are you sure you want to delete ${vendor.companyName}?`)) {
      this.adminService.deleteVendor(vendor.id).subscribe({
        next: () => {
          this.loadVendors();
        },
        error: (error) => {
          console.error('Error deleting vendor:', error);
        }
      });
    }
  }

  getStatusClass(status: VendorStatus): string {
    switch (status) {
      case VendorStatus.Approved:
        return 'bg-green-100 text-green-800';
      case VendorStatus.Rejected:
        return 'bg-red-100 text-red-800';
      case VendorStatus.Pending:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  closeModal() {
    this.showRejectModal = false;
    this.selectedVendor = null;
    this.rejectReason = '';
  }

  get companyName() { return this.createVendorForm.get('companyName'); }
  get contactEmail() { return this.createVendorForm.get('contactEmail'); }
}