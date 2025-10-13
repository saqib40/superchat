import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LeadershipService } from '../../services/leadership.service';
import { EmployeeDetail, JobApplicationDto } from '../../models';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, FormsModule],
  template: `
    <div *ngIf="employee" class="p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <div class="border-b pb-4 mb-4">
        <h2 class="text-3xl font-bold text-gray-800">{{ employee.firstName }} {{ employee.lastName }}</h2>
        <p class="text-lg text-gray-600">{{ employee.jobTitle }}</p>
        <p class="text-sm text-gray-500">{{ employee.email }} | {{ employee.phoneNumber }}</p>
      </div>
      
      <!-- Application Status Section -->
      <div *ngIf="application" class="p-4 bg-indigo-50 rounded-lg border border-indigo-200 mb-6">
          <h3 class="text-lg font-semibold text-indigo-800">Application for: {{ application.jobTitle }}</h3>
          <div class="mt-2 flex items-center justify-between">
              <p class="text-gray-700">Current Status: <span class="font-bold">{{ application.status }}</span></p>
          </div>
      </div>

      <!-- Employee Info Grid (Unchanged) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <!-- ... -->
      </div>

      <!-- Resume Section (Unchanged) -->
      <div class="mt-6 pt-6 border-t">
        <h3 class="text-xl font-semibold mb-2">Resume</h3>
         <a *ngIf="employee.resumeDownloadUrl" [href]="employee.resumeDownloadUrl" target="_blank" class="text-indigo-600 hover:underline">Download Resume</a>
         <p *ngIf="!employee.resumeDownloadUrl" class="text-gray-500">No resume available.</p>
      </div>
      
      <!-- Feedback/Notes Section -->
      <div class="mt-6 pt-6 border-t">
          <h3 class="text-xl font-semibold mb-2">Interview Feedback & Notes</h3>
          <textarea [(ngModel)]="feedback" placeholder="Add interview notes here..." 
                    class="w-full p-2 border rounded-md h-32"></textarea>
          <button (click)="saveFeedback()" [disabled]="!feedback"
                  class="mt-2 px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
            Save Notes
          </button>
      </div>
    </div>
  `
})
export class EmployeeDetailComponent implements OnInit {
  employee: EmployeeDetail | null = null;
  application: JobApplicationDto | null = null;
  feedback: string = '';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private leadershipService: LeadershipService
  ) {}

  ngOnInit() {
    const employeeId = this.route.snapshot.paramMap.get('id');
    const jobId = this.route.snapshot.queryParamMap.get('job');

    if (employeeId) {
      this.leadershipService.getEmployeeDetails(employeeId).subscribe({
        next: (data) => {
          this.employee = data;
          if (jobId) {
            this.loadApplicationDetails(jobId, employeeId);
          } else {
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error("Failed to fetch employee details:", err);
          this.isLoading = false;
        }
      });
    }
  }

  loadApplicationDetails(jobId: string, employeeId: string): void {
    this.leadershipService.getApplicationsForJob(jobId).subscribe(apps => {
      const specificApp = apps.find(app => app.employeePublicId === employeeId);
      if (specificApp) {
        this.application = specificApp;
        this.feedback = specificApp.feedback || '';
      }
      this.isLoading = false;
    });
  }
  
  saveFeedback(): void {
    if (this.application && this.feedback) {
      this.leadershipService.addApplicationNote(this.application.applicationPublicId, this.feedback)
        .subscribe(() => {
          // You could show a success toast message here
          console.log("Feedback saved!");
        });
    }
  }
}