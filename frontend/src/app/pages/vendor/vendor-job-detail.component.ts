import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VendorService } from '../../services/vendor.service';
import { VendorJobDetailDto, JobApplicationDto } from '../../models';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  template: `
    <div class="space-y-8">
      <div *ngIf="jobDetails" class="p-6 bg-white rounded-lg shadow">
        <h1 class="text-3xl font-bold">{{ jobDetails.title }}</h1>
        <p class="text-gray-600">{{ jobDetails.country }} | Expires on: {{ jobDetails.expiryDate | date:'mediumDate' }}</p>
        <p class="mt-4">{{ jobDetails.description }}</p>
      </div>

      <div class="p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold">Add Employee for this Job</h2>
        <form [formGroup]="employeeForm" (ngSubmit)="addEmployee()" class="mt-4 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input formControlName="firstName" placeholder="First Name" class="w-full px-3 py-2 border rounded">
            <input formControlName="lastName" placeholder="Last Name" class="w-full px-3 py-2 border rounded">
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input formControlName="email" type="email" placeholder="Email Address" class="w-full px-3 py-2 border rounded">
            <input formControlName="phoneNumber" placeholder="Phone Number" class="w-full px-3 py-2 border rounded">
          </div>
          <input formControlName="jobTitle" placeholder="Job Title (e.g., Software Engineer)" class="w-full px-3 py-2 border rounded">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input formControlName="yearsOfExperience" type="number" placeholder="Years of Experience" class="w-full px-3 py-2 border rounded">
            <input formControlName="skills" placeholder="Skills (comma-separated)" class="w-full px-3 py-2 border rounded">
          </div>
          <div>
            <label for="resume" class="text-sm font-medium">Resume (Required, PDF/DOCX, max 5MB)</label>
            <input id="resume" type="file" (change)="onFileChange($event)" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
             <div *ngIf="employeeForm.get('resumeFile')?.errors?.['required'] && employeeForm.get('resumeFile')?.touched" class="text-red-500 text-sm mt-1">
                A resume file is required.
            </div>
          </div>
          <button type="submit" [disabled]="employeeForm.invalid" class="w-full px-4 py-2 text-white bg-blue-600 rounded disabled:bg-gray-400">Submit Employee</button>
        </form>
      </div>

      <div class="p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold">My Submitted Candidates</h2>
        <div *ngIf="!jobDetails || !jobDetails.submittedApplications.length" class="mt-4 text-gray-500">You have not submitted any candidates for this job.</div>
        <ul *ngIf="jobDetails" class="mt-4 space-y-2">
          <li *ngFor="let app of jobDetails.submittedApplications" class="p-4 bg-gray-50 rounded-md flex justify-between items-center">
            <div>
              <p class="font-semibold">{{ app.employeeFirstName }} {{ app.employeeLastName }}</p>
              <p class="text-sm text-gray-600">{{ app.employeeEmail }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <span class="px-2 py-1 text-xs font-semibold text-white rounded-full" [ngClass]="getStatusColor(app.status)">{{ app.status }}</span>
              <button (click)="deleteEmployee(app.employeePublicId)" class="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">Withdraw</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class VendorJobDetailComponent implements OnInit {
  jobPublicId: string = '';
  jobDetails: VendorJobDetailDto | null = null;
  employeeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private vendorService: VendorService,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      jobTitle: [''],
      yearsOfExperience: [null],
      skills: [''],
      resumeFile: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.jobPublicId = this.route.snapshot.paramMap.get('id') || '';
    if (this.jobPublicId) {
      this.loadJobDetails();
    }
  }

  loadJobDetails() {
    this.vendorService.getAssignedJobDetails(this.jobPublicId).subscribe(data => {
      this.jobDetails = data;
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.employeeForm.patchValue({ resumeFile: input.files[0] });
      this.employeeForm.get('resumeFile')?.updateValueAndValidity();
    }
  }

  addEmployee() {
    this.employeeForm.markAllAsTouched();
    if (this.employeeForm.invalid) return;

    const formData = new FormData();
    Object.keys(this.employeeForm.controls).forEach(key => {
        formData.append(key, this.employeeForm.get(key)?.value);
    });
    formData.append('jobPublicId', this.jobPublicId);

    this.vendorService.createEmployee(formData).subscribe(() => {
      this.loadJobDetails(); // Refresh the full details view
      this.employeeForm.reset();
    });
  }

  deleteEmployee(employeePublicId: string) {
    if (confirm('Are you sure you want to withdraw this candidate? This cannot be undone.')) {
      this.vendorService.deleteEmployee(employeePublicId).subscribe(() => {
        this.loadJobDetails();
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Hired': return 'bg-green-600';
      case 'Rejected': return 'bg-red-600';
      case 'ScheduledForInterview': return 'bg-yellow-500';
      default: return 'bg-blue-600';
    }
  }
}