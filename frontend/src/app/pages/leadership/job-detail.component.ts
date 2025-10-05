import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; // 1. RouterModule must be imported
import { LeadershipService } from '../../services/leadership.service';
import { JobDetail, EmployeeWithVendor } from '../../models';

// This interface helps in organizing the data for the template
interface VendorEmployeeGroup {
  vendorName: string;
  employees: EmployeeWithVendor[];
}

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule], // 2. RouterModule must be in the imports array
  template: `
    <div *ngIf="job" class="p-6 bg-white rounded-lg shadow space-y-4">
      <div>
        <h2 class="text-3xl font-bold">{{ job.title }}</h2>
        <p class="text-md text-gray-600">{{ job.country }} - Created by: {{ job.createdBy.firstName }} {{ job.createdBy.lastName }}</p>
        <p class="text-sm text-red-600">Expires on: {{ job.expiryDate | date:'fullDate' }}</p>
      </div>

      <div class="pt-4 border-t">
        <h3 class="font-semibold text-lg">Description</h3>
        <p class="mt-1 text-gray-700">{{ job.description }}</p>
      </div>
      <div class="pt-4 border-t">
        <h3 class="font-semibold text-lg">Assigned Vendors ({{ job.assignedVendors.length }})</h3>
        <ul class="mt-2 space-y-1 list-disc list-inside">
          <li *ngFor="let vendor of job.assignedVendors">{{ vendor.companyName }} - {{ vendor.status }}</li>
        </ul>
      </div>

      <div class="pt-4 border-t">
        <h3 class="font-semibold text-lg">Submitted Employees ({{ job.submittedEmployees.length }})</h3>
        <div *ngIf="!employeesByVendor.length" class="text-gray-500 mt-2">No employees submitted yet.</div>
        
        <div *ngFor="let group of employeesByVendor" class="mt-4">
          <h4 class="font-bold text-md text-gray-800 border-b pb-1">{{ group.vendorName }}</h4>
          <ul class="mt-2 space-y-2">
            <li *ngFor="let emp of group.employees" class="p-2 bg-gray-50 rounded-md hover:bg-gray-100">
              <a [routerLink]="['/leadership/employees', emp.publicId]" class="font-semibold hover:underline">
                {{ emp.firstName }} {{ emp.lastName }}
              </a>
              <span class="text-sm text-gray-600"> ({{ emp.jobTitle || 'N/A' }})</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <div *ngIf="isLoading" class="text-center p-8">
      <p>Loading job details...</p>
    </div>
  `
})
export class JobDetailComponent implements OnInit {
  job: JobDetail | null = null;
  isLoading = true;
  employeesByVendor: VendorEmployeeGroup[] = [];

  constructor(
    private route: ActivatedRoute,
    private leadershipService: LeadershipService
  ) {}

  ngOnInit() {
    const publicId = this.route.snapshot.paramMap.get('id');
    if (publicId) {
      this.leadershipService.getJobDetails(publicId).subscribe({
        next: (data) => {
          this.job = data;
          this.groupEmployeesByVendor(data.submittedEmployees);
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
    } else {
      this.isLoading = false;
    }
  }

  private groupEmployeesByVendor(employees: EmployeeWithVendor[]) {
    if (!employees) {
      this.employeesByVendor = [];
      return;
    }
    const groups = new Map<string, EmployeeWithVendor[]>();
    employees.forEach(employee => {
      const vendorName = employee.vendorCompanyName;
      if (!groups.has(vendorName)) {
        groups.set(vendorName, []);
      }
      groups.get(vendorName)!.push(employee);
    });
    this.employeesByVendor = Array.from(groups.entries()).map(([vendorName, employees]) => ({
      vendorName,
      employees
    }));
  }
}