import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeadershipService } from '../../services/leadership.service';
import { JobApplicationDto } from '../../models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  template: `
    <div class="p-8 bg-white rounded-2xl shadow-lg">
      <h2 class="text-2xl font-bold text-gray-800">All Hired Candidates</h2>
      <div *ngIf="isLoading" class="mt-4 text-center">Loading...</div>
      <div *ngIf="!isLoading && !hired.length" class="mt-4 p-12 text-center bg-gray-50 rounded-2xl">
        <h3 class="text-xl font-bold text-gray-900">No Candidates Hired</h3>
        <p class="mt-1 text-base text-gray-500">No candidates have been hired yet.</p>
      </div>
      <div *ngIf="hired.length > 0" class="mt-6 overflow-x-auto bg-white rounded-xl shadow-md">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hired For Job</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Updated</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr *ngFor="let app of hired" class="hover:bg-blue-50/50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-semibold text-gray-900">{{ app.employeeFirstName }} {{ app.employeeLastName }}</div>
                <div class="text-sm text-gray-500">{{ app.employeeEmail }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{{ app.jobTitle }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ app.lastUpdatedAt | date:'medium' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class HiredCandidatesComponent implements OnInit {
  hired: JobApplicationDto[] = [];
  isLoading = true;

  constructor(private leadershipService: LeadershipService) {}

  ngOnInit() {
    this.leadershipService.getHiredApplications().subscribe(data => {
      this.hired = data;
      this.isLoading = false;
    });
  }
}