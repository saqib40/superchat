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
      </div>
  `
})
export class VendorJobDetailComponent implements OnInit {
  jobPublicId: string = '';
  employees: Employee[] = [];
  employeeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private vendorService: VendorService,
    private fb: FormBuilder
  ) {
    // Define the reactive form with all fields and validators
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      jobTitle: [''],
      yearsOfExperience: [null],
      skills: [''],
      resumeFile: [null, Validators.required] // Add resumeFile control for validation
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
      // Set the file object on the form control
      this.employeeForm.patchValue({ resumeFile: input.files[0] });
      this.employeeForm.get('resumeFile')?.updateValueAndValidity();
    }
  }

  addEmployee() {
    // Mark all fields as touched to trigger validation messages
    this.employeeForm.markAllAsTouched();
    if (this.employeeForm.invalid) return;

    const formData = new FormData();
    // Append all form values to FormData
    Object.keys(this.employeeForm.controls).forEach(key => {
        formData.append(key, this.employeeForm.get(key)?.value);
    });
    formData.append('jobPublicId', this.jobPublicId);

    this.vendorService.createEmployee(formData).subscribe(() => {
      this.loadEmployees();
      this.employeeForm.reset();
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