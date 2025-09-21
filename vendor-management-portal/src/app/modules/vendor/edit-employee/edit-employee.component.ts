import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VendorService } from '../../../services/vendor.service';
import { Employee, UpdateEmployeeDto } from '../../../models';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-employee.component.html'
})
export class EditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employee: Employee | null = null;
  isLoading = false;
  isLoadingEmployee = false;
  errorMessage = '';
  employeeId: number;

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeId = Number(this.route.snapshot.params['id']);
    
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      jobTitle: ['']
    });
  }

  ngOnInit() {
    if (this.employeeId) {
      this.loadEmployee();
    } else {
      this.router.navigate(['/vendor/employees']);
    }
  }

  loadEmployee() {
    this.isLoadingEmployee = true;
    this.vendorService.getEmployee(this.employeeId).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.employeeForm.patchValue({
          firstName: employee.firstName,
          lastName: employee.lastName,
          jobTitle: employee.jobTitle || ''
        });
        this.isLoadingEmployee = false;
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        this.isLoadingEmployee = false;
        this.router.navigate(['/vendor/employees']);
      }
    });
  }

  onSubmit() {
    if (this.employeeForm.valid && this.employee) {
      this.isLoading = true;
      this.errorMessage = '';

      const request: UpdateEmployeeDto = {
        firstName: this.employeeForm.value.firstName,
        lastName: this.employeeForm.value.lastName,
        jobTitle: this.employeeForm.value.jobTitle || undefined
      };

      this.vendorService.updateEmployee(this.employee.id, request).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/vendor/employees']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to update employee. Please try again.';
          console.error('Error updating employee:', error);
        }
      });
    }
  }

  get firstName() { return this.employeeForm.get('firstName'); }
  get lastName() { return this.employeeForm.get('lastName'); }
  get jobTitle() { return this.employeeForm.get('jobTitle'); }
}
