// src/app/pages/vendor/my-jobs.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { VendorService } from '../../services/vendor.service';
import { Job } from '../../models';

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule], // Add RouterModule here
  template: `
    <div class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-xl font-semibold">My Assigned Jobs</h2>
       <div *ngIf="!jobs.length" class="mt-4 p-4 text-center bg-gray-50 rounded-md">
        You have not been assigned to any active jobs.
      </div>
      <div class="mt-4 space-y-3">
        <a *ngFor="let job of jobs" [routerLink]="['/vendor/jobs', job.publicId]"
           class="block p-4 border rounded-md hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-bold text-lg text-blue-700">{{ job.title }}</h3>
              <p class="text-sm text-gray-600">{{ job.country }} | Expires on: {{ job.expiryDate | date:'mediumDate' }}</p>
            </div>
            <div class="text-right">
                <p class="text-xl font-bold" [ngClass]="job.daysRemaining < 7 ? 'text-red-500' : 'text-green-600'">
                  {{ job.daysRemaining | number:'1.0-0' }}
                </p>
                <p class="text-xs text-gray-500">days remaining</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  `
})
export class MyJobsComponent implements OnInit {
  jobs: Job[] = [];
  constructor(private vendorService: VendorService) {}
  ngOnInit() {
    this.vendorService.getMyAssignedJobs().subscribe(data => this.jobs = data);
  }
}