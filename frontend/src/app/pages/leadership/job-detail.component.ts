import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LeadershipService } from '../../services/leadership.service';
import { JobDetail, JobApplicationDto, Vendor } from '../../models';
import { MessagingService } from '../../services/messaging.service';
import { MessagingStateService } from '../../services/messaging-state.service';

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TitleCasePipe, FormsModule],
  template: `
    <div class="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div *ngIf="job" class="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-5xl mx-auto">
        <div class="p-8 space-y-10">
          
          <!-- Job Header -->
          <div class="border-b-4 border-indigo-100 pb-6">
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-5">
                <svg class="w-12 h-12 text-indigo-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 13.25L13.25 21l-3.25-3.25L13.25 10l-3.25-3.25L21 13.25zM12 2v2M4 12H2m20 0h-2M12 20v2M5.636 5.636l1.414 1.414M16.95 16.95l1.414 1.414M5.636 18.364l1.414-1.414M16.95 7.05l1.414-1.414" />
                </svg>
                <div>
                  <h2 class="text-5xl font-extrabold text-gray-900 tracking-tight">{{ job.title }}</h2>
                  <p class="text-lg text-indigo-700 font-medium mt-2">{{ job.country }}</p>
                </div>
              </div>
              <div>
                <label for="jobStatus" class="text-sm font-medium text-gray-500">Job Status</label>
                <select id="jobStatus" [value]="job.status" (change)="onJobStatusChange($event)" class="mt-1 p-2 border rounded-md">
                  <option value="Open">Open</option>
                  <option value="OnHold">On Hold</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Assigned Vendors -->
          <div class="pt-6 border-t border-gray-100">
            <h3 class="text-2xl font-bold mb-4 text-gray-800">Assigned Vendors ({{ job.assignedVendors.length }})</h3>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <li *ngFor="let vendor of job.assignedVendors" class="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                <span class="font-medium text-gray-900">{{ vendor.companyName }}</span>
                <button (click)="openChatWithVendor(vendor)" class="px-3 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700">Chat</button>
              </li>
            </ul>
          </div>

          <!-- Candidate Pipeline -->
          <div class="pt-6 border-t border-gray-100">
            <h3 class="text-2xl font-bold mb-6 text-gray-800">Candidate Pipeline ({{ applications.length }})</h3>
            
            <div *ngIf="!applications.length && !isLoading" class="text-gray-500 mt-2 p-5 bg-yellow-50 rounded-xl">
              No candidates have been submitted for this job yet.
            </div>

            <div *ngIf="applications.length > 0" class="overflow-x-auto">
              <table class="min-w-full bg-white border">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let app of applications" class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="font-semibold">{{ app.employeeFirstName }} {{ app.employeeLastName }}</div>
                      <div class="text-sm text-gray-500">{{ app.employeeEmail }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <select
                        [(ngModel)]="app.status"
                        (ngModelChange)="onApplicationStatusChange($event, app)"
                        class="p-2 border rounded-md"
                        [ngClass]="getStatusColor(app.status)"
                      >
                        <option *ngFor="let status of applicationStatuses" [value]="status">
                          {{ status | titlecase }}
                        </option>
                      </select>
                    </td>
                    <td class="px-6 py-4 text-sm font-medium">
                      <a [routerLink]="['/leadership/employees', app.employeePublicId]"
                         [queryParams]="{ job: job.publicId }"
                         class="text-indigo-600 hover:text-indigo-900">
                        View Profile & Notes
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      <!-- Loading / Not Found -->
      <div *ngIf="isLoading" class="text-center p-12">Loading...</div>
      <div *ngIf="!job && !isLoading" class="text-center p-12">Job Not Found.</div>
    </div>
  `
})
export class JobDetailComponent implements OnInit {
  job: JobDetail | null = null;
  applications: JobApplicationDto[] = [];
  isLoading = true;

  applicationStatuses = [
    "Submitted",
    "UnderReview",
    "ScheduledForInterview",
    "OfferExtended",
    "Hired",
    "Rejected"
  ];

  constructor(
    private route: ActivatedRoute,
    private leadershipService: LeadershipService,
    private messagingService: MessagingService,
    private messagingStateService: MessagingStateService
  ) {}

  ngOnInit() {
    const publicId = this.route.snapshot.paramMap.get('id');
    if (publicId) {
      this.isLoading = true;
      this.leadershipService.getJobDetails(publicId).subscribe({
        next: (data) => {
          this.job = data;
          this.loadApplications(publicId);
        },
        error: (err) => {
          console.error("Failed to load job details:", err);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  loadApplications(jobId: string): void {
    this.leadershipService.getApplicationsForJob(jobId).subscribe({
      next: (data) => {
        this.applications = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to load applications:", err);
        this.isLoading = false;
      }
    });
  }

  // ✅ Optimistic UI update for application status
  onApplicationStatusChange(newStatus: string, app: JobApplicationDto): void {
    const previousStatus = app.status;
    app.status = newStatus; // Optimistic update

    this.leadershipService.updateApplicationStatus(app.applicationPublicId, newStatus).subscribe({
      next: () => console.log(`Status updated to ${newStatus}`),
      error: (err) => {
        console.error("Failed to update status:", err);
        app.status = previousStatus; // Rollback on failure
      }
    });
  }

  onJobStatusChange(event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value;
    if (this.job) {
      const previousStatus = this.job.status;
      this.job.status = newStatus; // Optimistic update

      this.leadershipService.updateJobStatus(this.job.publicId, newStatus).subscribe({
        next: () => console.log(`Job status updated to ${newStatus}`),
        error: (err) => {
          console.error("Failed to update job status:", err);
          this.job!.status = previousStatus; // Rollback
        }
      });
    }
  }

  openChatWithVendor(vendor: Vendor): void {
    if (!this.job) return;
    this.messagingService.startConversation(this.job.publicId, vendor.publicId).subscribe({
      next: (response) => {
        this.messagingStateService.openChat({
          conversationPublicId: response.conversationPublicId,
          jobTitle: this.job!.title,
          participantPublicId: vendor.publicId,
          participantName: vendor.companyName
        });
      },
      error: (err) => console.error("Failed to open chat:", err)
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Hired': return 'bg-green-100 border-green-400';
      case 'Rejected': return 'bg-red-100 border-red-400';
      case 'ScheduledForInterview': return 'bg-yellow-100 border-yellow-400';
      default: return 'bg-gray-100 border-gray-300';
    }
  }
}
