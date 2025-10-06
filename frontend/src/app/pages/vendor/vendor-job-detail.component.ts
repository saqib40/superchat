// src/app/pages/vendor/vendor-job-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VendorService } from '../../services/vendor.service';
import { Employee } from '../../models';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold">Add Employee for this Job</h2>
        <form [formGroup]="employeeForm" (ngSubmit)="addEmployee()" class="mt-4 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input formControlName="firstName" placeholder="First Name" class="w-full px-3 py-2 border rounded">
            <input formControlName="lastName" placeholder="Last Name" class="w-full px-3 py-2 border rounded">
          </div>
          <input formControlName="jobTitle" placeholder="Job Title (e.g., Software Engineer)" class="w-full px-3 py-2 border rounded">
          <div>
            <label for="resume" class="text-sm font-medium">Resume (Optional)</label>
            <input id="resume" type="file" (change)="onFileChange($event)" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
          </div>
          <button type="submit" [disabled]="employeeForm.invalid" class="w-full px-4 py-2 text-white bg-blue-600 rounded disabled:bg-gray-400">Submit Employee</button>
        </form>
      </div>

      <div class="p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold">My Submitted Employees</h2>
        <div *ngIf="!employees.length" class="mt-4 text-center text-gray-500">No employees submitted for this job yet.</div>
        <ul class="mt-4 space-y-2">
          <li *ngFor="let emp of employees" class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p class="font-semibold">{{ emp.firstName }} {{ emp.lastName }}</p>
              <p class="text-sm text-gray-600">{{ emp.jobTitle || 'No title provided' }}</p>
            </div>
            <button (click)="deleteEmployee(emp.publicId)" class="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">Delete</button>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class VendorJobDetailComponent implements OnInit {
  jobPublicId: string = '';
  employees: Employee[] = [];
  employeeForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private vendorService: VendorService,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      jobTitle: [''],
    });
  }

  ngOnInit() {
    this.jobPublicId = this.route.snapshot.paramMap.get('id') || '';
    if (this.jobPublicId) {
      this.loadEmployees();
    }
  }

  loadEmployees() {
    this.vendorService.getEmployeesForJob(this.jobPublicId).subscribe(data => {
      this.employees = data;
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  addEmployee() {
    if (this.employeeForm.invalid) return;

    const formData = new FormData();
    formData.append('jobPublicId', this.jobPublicId);
    formData.append('firstName', this.employeeForm.get('firstName')?.value);
    formData.append('lastName', this.employeeForm.get('lastName')?.value);
    formData.append('jobTitle', this.employeeForm.get('jobTitle')?.value);

    if (this.selectedFile) {
      formData.append('resumeFile', this.selectedFile, this.selectedFile.name);
    }

    this.vendorService.createEmployee(formData).subscribe(() => {
      this.loadEmployees(); // Refresh the list
      this.employeeForm.reset();
      this.selectedFile = null;
      // You might need to reset the file input visually, which can be tricky.
      // For simplicity, this is often sufficient.
    });
  }

  deleteEmployee(employeePublicId: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.vendorService.deleteEmployee(employeePublicId).subscribe(() => {
        this.loadEmployees(); // Refresh the list after deletion
      });
    }
  }
}