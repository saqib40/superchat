import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LeadershipService } from '../../../services/leadership.service';
import { Vendor, VendorStatus } from '../../../models';

@Component({
  selector: 'app-vendor-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vendor-details.component.html'
})
export class VendorDetailsComponent implements OnInit {
  vendor: Vendor | null = null;
  isLoading = false;
  VendorStatus = VendorStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leadershipService: LeadershipService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    if (id) {
      this.loadVendor(id);
    }
  }

  loadVendor(id: number) {
    this.isLoading = true;
    this.leadershipService.getVendor(id).subscribe({
      next: (vendor) => {
        this.vendor = vendor;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vendor:', error);
        this.isLoading = false;
        this.router.navigate(['/leadership/search']);
      }
    });
  }

  getStatusClass(status: VendorStatus): string {
    switch (status) {
      case VendorStatus.Approved:
        return 'status-approved';
      case VendorStatus.Rejected:
        return 'status-rejected';
      case VendorStatus.Pending:
        return 'status-pending';
      default:
        return 'status-default';
    }
  }
}
