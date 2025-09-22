import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VendorService } from '../services/vendor.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vendor-profile',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './vendor-profile.component.html',
  styleUrl: './vendor-profile.component.css'
})
export class VendorProfileComponent implements OnInit {

  vendorId!: number;

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
        // later -> assign to variable and show in UI
      },
      error: (err) => {
        console.error('Error fetching vendor details:', err);
      }
    });
  }
}
