import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { LeadershipService } from '../../services/leadership.service';
import { Vendor } from '../../models';
import { COUNTRIES } from '../../constants/countries';
import { Observable, of } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="space-y-8">
      <div class="p-8 bg-white rounded-2xl shadow-lg">
        <h2 class="text-2xl font-bold text-gray-800">Invite New Vendor</h2>
        <form #vendorForm="ngForm" (ngSubmit)="createVendor(vendorForm)" class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <input name="companyName" ngModel required placeholder="Company Name" class="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition">
          <input name="contactEmail" ngModel required type="email" placeholder="Contact Email" class="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition">

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Country</mat-label>
            <input
              type="text"
              matInput
              [formControl]="countryControl"
              [matAutocomplete]="auto"
              required
              class="w-full rounded-lg"
            >
            <mat-autocomplete #auto="matAutocomplete">
              <mat-option *ngFor="let country of filteredCountries | async" [value]="country">
                {{ country }}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>

          <button type="submit" [disabled]="vendorForm.invalid || !countryControl.value" class="w-full md:col-span-3 px-4 py-3 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100">Send Invitation</button>
        </form>
      </div>

      <div class="p-8 bg-white rounded-2xl shadow-lg">
        <h2 class="text-2xl font-bold text-gray-800">Manage Vendors</h2>
        <input [(ngModel)]="countryFilter" (ngModelChange)="loadVendors()" placeholder="Filter by Country..." class="w-full md:w-1/3 my-4 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition">
        <ul class="mt-4 space-y-3">
          <li *ngFor="let vendor of vendors" class="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200/80">
            <div>
              <p class="font-semibold text-gray-900">{{ vendor.companyName }} ({{vendor.country}})</p>
              <p class="text-sm text-gray-600">{{ vendor.contactEmail }} - <span class="font-medium">{{ vendor.status }}</span></p>
            </div>
            <button (click)="deleteVendor(vendor)" class="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition-all">Delete</button>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class ManageVendorsComponent implements OnInit {
  vendors: Vendor[] = [];
  countryFilter: string = 'United States'; // FIX: Use full country name for the default filter
  countries = COUNTRIES;
  country: string = '';
  filteredCountries!: Observable<string[]>;

  constructor(private leadershipService: LeadershipService) {}

  ngOnInit() {
    this.loadVendors();
    this.filteredCountries = of(this.countries);
  }

  private filterCountries(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.filteredCountries = of(
      this.countries.filter(c => c.toLowerCase().includes(filterValue))
    );
  }

  loadVendors() {
    if (!this.countryFilter) return;
    this.leadershipService.getVendorsByCountry(this.countryFilter).subscribe(data => this.vendors = data);
  }

  // FIX: Pass the whole form to combine values correctly and allow for resetting.
  createVendor(form: NgForm) {
    if (form.invalid || !this.countryControl.value) return;

    const payload = {
      ...form.value,
      country: this.countryControl.value
    };

    this.leadershipService.createVendor(payload).subscribe(() => {
      this.loadVendors();
      form.resetForm();
      this.countryControl.setValue('');
    });
  }

  deleteVendor(vendor: Vendor) {
    if (confirm(`Are you sure you want to delete ${vendor.companyName}?`)) {
      this.leadershipService.deleteVendor(vendor.publicId).subscribe(() => this.loadVendors());
    }
  }
}