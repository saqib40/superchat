import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VendorService } from '../../../services/vendor.service';
import { CreateEmployeeRequest } from '../../../models';

@Component({
  selector: 'app-add-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-employee-form.component.html'
})
export class AddEmployeeFormComponent {
  employeeForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  selectedFile: File | null = null;
  fileError = '';

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      jobTitle: ['']
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.fileError = '';
    
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        this.fileError = 'Please select a PDF or Word document for the resume.';
        this.selectedFile = null;
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.fileError = 'File size must be less than 5MB.';
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.fileError = '';
    // Reset file input
    const fileInput = document.getElementById('resumeFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const request: CreateEmployeeRequest = {
        firstName: this.employeeForm.value.firstName,
        lastName: this.employeeForm.value.lastName,
        jobTitle: this.employeeForm.value.jobTitle || undefined,
        resumeFile: this.selectedFile || undefined
      };

      this.vendorService.createEmployee(request).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/vendor/employees']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to add employee. Please try again.';
          console.error('Error creating employee:', error);
        }
      });
    }
  }

  get firstName() { return this.employeeForm.get('firstName'); }
  get lastName() { return this.employeeForm.get('lastName'); }
  get jobTitle() { return this.employeeForm.get('jobTitle'); }
}
