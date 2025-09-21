import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Vendor, VendorStatus } from '../../../models';

@Component({
  selector: 'app-vendor-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vendor-detail.component.html'
})
export class VendorDetailComponent implements OnInit {
  vendor: Vendor | null = null;
  isLoading = false;
  VendorStatus = VendorStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    if (id) {
      this.loadVendor(id);
    }
  }

  loadVendor(id: number) {
    this.isLoading = true;
    this.adminService.getVendor(id).subscribe({
      next: (vendor) => {
        this.vendor = vendor;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vendor:', error);
        this.isLoading = false;
        this.router.navigate(['/admin/vendors']);
      }
    });
  }

  approveVendor() {
    if (this.vendor) {
      this.adminService.approveVendor(this.vendor.id).subscribe({
        next: () => {
          this.loadVendor(this.vendor!.id);
        },
        error: (error) => {
          console.error('Error approving vendor:', error);
        }
      });
    }
  }

  rejectVendor() {
    if (this.vendor) {
      const reason = prompt('Please provide a reason for rejection:');
      if (reason) {
        this.adminService.rejectVendor(this.vendor.id, { reason }).subscribe({
          next: () => {
            this.loadVendor(this.vendor!.id);
          },
          error: (error) => {
            console.error('Error rejecting vendor:', error);
          }
        });
      }
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
}
