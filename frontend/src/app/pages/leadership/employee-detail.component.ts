import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LeadershipService } from '../../services/leadership.service';
import { EmployeeDetail } from '../../models';

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  template: `
    <div class="bg-gray-50 min-h-screen py-10">
      <div *ngIf="employee" class="p-8 bg-white rounded-xl shadow-2xl border border-gray-100 max-w-3xl mx-auto transition-all duration-300">
        
        <!-- Header Section -->
        <div class="flex items-center space-x-4 border-b pb-6 mb-6">
          <svg class="w-10 h-10 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <div>
            <h2 class="text-4xl font-extrabold text-gray-900 tracking-tight">{{ employee.firstName }} {{ employee.lastName }}</h2>
            <p class="text-xl text-indigo-500 font-medium mt-1">{{ employee.jobTitle }}</p>
          </div>
        </div>
        
        <!-- Key Metadata Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
          <!-- Submitted By -->
          <div class="bg-indigo-50 p-5 rounded-xl border border-indigo-200/50 shadow-inner">
            <p class="font-semibold text-indigo-700 uppercase tracking-wider mb-1 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1"></path></svg>
                Submitted By
            </p>
            <p class="text-gray-900 font-medium text-lg">{{ employee.vendorCompanyName }}</p>
          </div>
          
          <!-- Submission Date -->
          <div class="bg-gray-100 p-5 rounded-xl border border-gray-200 shadow-inner">
            <p class="font-semibold text-gray-600 uppercase tracking-wider mb-1 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Submission Date
            </p>
            <p class="text-gray-900 font-medium text-lg">{{ employee.createdAt | date:'medium' }}</p>
          </div>
        </div>

        <!-- Resume Section -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <h3 class="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Candidate Resume
          </h3>
          <div *ngIf="employee.resumeDownloadUrl; else noResume" class="p-4 bg-green-50 rounded-xl border border-green-200">
            <p class="text-green-800 mb-4 text-sm">
                A secure, time-limited link has been generated for resume download.
            </p>
            <a [href]="employee.resumeDownloadUrl" target="_blank"
                class="inline-flex items-center px-8 py-3 text-white font-bold bg-green-600 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-[1.02]">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Download Resume
            </a>
            <p class="text-xs text-green-700 mt-3 italic">
                <span class="font-medium">Security Note:</span> This download link will automatically expire in 15 minutes for security purposes.
            </p>
          </div>
          <ng-template #noResume>
            <div class="p-4 bg-red-50 rounded-xl border border-red-200">
                <p class="text-red-600 font-medium">No resume was submitted for this employee.</p>
            </div>
          </ng-template>
        </div>

        <!-- Back Link -->
        <div class="mt-10 pt-6 border-t border-gray-100 text-center">
          <a routerLink="/leadership/jobs" class="inline-flex items-center text-lg text-blue-600 font-semibold hover:text-blue-800 transition duration-150">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Job Pipeline
          </a>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="!employee && !isLoading" class="text-center p-12 max-w-xl mx-auto bg-white rounded-xl shadow-lg border-l-4 border-red-500">
        <p class="text-xl font-medium text-red-600 flex items-center justify-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Error Loading Details
        </p>
        <p class="mt-2 text-gray-600">The employee details could not be found or loaded.</p>
      </div>
    </div>
  `
})
export class EmployeeDetailComponent implements OnInit {
  employee: EmployeeDetail | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private leadershipService: LeadershipService
  ) {}

  ngOnInit() {
    const publicId = this.route.snapshot.paramMap.get('id');
    if (publicId) {
      this.leadershipService.getEmployeeDetails(publicId).subscribe({
        next: (data) => {
          this.employee = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Failed to fetch employee details:", err);
          this.isLoading = false;
        }
      });
    }
  }
}
