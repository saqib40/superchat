import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LeadershipService } from '../../services/leadership.service';
import { EmployeeDetail } from '../../models';

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  template: `
    <div *ngIf="employee" class="p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <div class="border-b pb-4 mb-4">
        <h2 class="text-3xl font-bold text-gray-800">{{ employee.firstName }} {{ employee.lastName }}</h2>
        <p class="text-lg text-gray-600">{{ employee.jobTitle }}</p>
        <p class="text-sm text-gray-500">{{ employee.email }} | {{ employee.phoneNumber }}</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div class="bg-gray-50 p-3 rounded-md">
          <p class="font-semibold text-gray-500">Submitted By</p>
          <p class="text-gray-900">{{ employee.vendorCompanyName }}</p>
        </div>
        <div class="bg-gray-50 p-3 rounded-md">
          <p class="font-semibold text-gray-500">Submission Date</p>
          <p class="text-gray-900">{{ employee.createdAt | date:'medium' }}</p>
        </div>
        <div class="bg-gray-50 p-3 rounded-md">
          <p class="font-semibold text-gray-500">Experience</p>
          <p class="text-gray-900">{{ employee.yearsOfExperience }} years</p>
        </div>
        <div class="bg-gray-50 p-3 rounded-md">
          <p class="font-semibold text-gray-500">Skills</p>
          <p class="text-gray-900">{{ employee.skills }}</p>
        </div>
      </div>

      <div class="mt-6 pt-6 border-t">
        <h3 class="text-xl font-semibold mb-2">Resume</h3>
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
