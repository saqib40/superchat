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
    <div class="p-8 bg-white rounded-2xl shadow-lg">
      <h2 class="text-2xl font-bold text-gray-800">My Assigned Jobs</h2>
       <div *ngIf="!jobs.length" class="mt-4 p-12 text-center bg-white rounded-2xl shadow-md border border-gray-200/80">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 class="mt-4 text-xl font-bold text-gray-900">No Jobs Assigned</h3>
          <p class="mt-1 text-base text-gray-500">You have not been assigned to any active jobs yet.</p>
        </div>
      <div class="mt-6 space-y-4">
        <a *ngFor="let job of jobs" [routerLink]="['/vendor/jobs', job.publicId]"
           class="block p-5 border border-gray-200/80 rounded-xl hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer hover:-translate-y-1">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-bold text-lg text-blue-700">{{ job.title }}</h3>
              <p class="text-sm text-gray-600">{{ job.country }} | Expires on: {{ job.expiryDate | date:'mediumDate' }}</p>
            </div>
            <div class="text-right">
                <p class="text-2xl font-bold" [ngClass]="job.daysRemaining < 7 ? 'text-red-500' : 'text-green-600'">
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