import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VendorService } from '../services/vendor.service';
import { ActivatedRoute } from '@angular/router';
import { Vendor } from '../services/vendor.service'; 

@Component({
  selector: 'app-vendor-profile',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './vendor-profile.component.html',
  styleUrl: './vendor-profile.component.css'
})
export class VendorProfileComponent implements OnInit {

  vendorId!: number;
  vendor: Vendor | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private vendorService: VendorService
  ) {}

  ngOnInit(): void {
    this.vendorId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadVendorDetails();
  }

  loadVendorDetails(): void {
    this.vendorService.getVendorById(this.vendorId).subscribe({
      next: (data) => {
        console.log('Vendor Details Response:', data);
        this.vendor = data;
        this.isLoading = false;
        // later -> assign to variable and show in UI
      },
      error: (err) => {
        console.error('Error fetching vendor details:', err);
        this.errorMessage = 'Failed to load vendor details';
        this.isLoading = false;
      }
    });
  }
}
