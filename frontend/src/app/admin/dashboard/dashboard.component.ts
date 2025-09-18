/*import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  vendorEmail: string = '';
  isAddVendorRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkCurrentRoute(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkCurrentRoute(event.url);
    });
  }

  private checkCurrentRoute(url: string) {
    this.isAddVendorRoute = url.includes('/admin/add-vendor');
  }

  sendInvitation() {
    if (this.vendorEmail) {
      console.log('Sending invitation to:', this.vendorEmail);
      alert(`Invitation sent to ${this.vendorEmail}!`);
      this.vendorEmail = '';
    } else {
      alert('Please enter a valid email address.');
    }
  }
}*/

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { VendorService } from '../../services/vendor.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  vendorEmail: string = '';
  isAddVendorRoute: boolean = false;
  vendorStatus: 'idle' | 'pending' | 'requesting' | 'approved' = 'idle';

  vendorsOpen:boolean=false;

    toggleVendors() {
    this.vendorsOpen = !this.vendorsOpen;
  }


  constructor(private router: Router, private vendorService: VendorService) {}

  ngOnInit() {
    this.checkCurrentRoute(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkCurrentRoute(event.url);
    });
  }

  private checkCurrentRoute(url: string) {
    this.isAddVendorRoute = url.includes('/admin/add-vendor');
  }

  sendInvitation() {
    if (this.vendorEmail.trim()) {
      // Simulated API call
      this.vendorService.sendInvitation(this.vendorEmail).subscribe(() => {
        this.vendorStatus = 'pending';
      });
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
