import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeadershipService } from '../../services/leadership.service';
import { JobApplicationDto } from '../../models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  template: `
    <div class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold text-gray-800">All Hired Candidates</h2>
      <div *ngIf="isLoading" class="mt-4 text-center">Loading...</div>
      <div *ngIf="!isLoading && !hired.length" class="mt-4 p-4 text-center bg-gray-50">No candidates have been hired yet.</div>
      <table *ngIf="hired.length > 0" class="min-w-full bg-white border mt-4">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hired For Job</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr *ngFor="let app of hired" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="font-semibold">{{ app.employeeFirstName }} {{ app.employeeLastName }}</div>
              <div class="text-sm text-gray-500">{{ app.employeeEmail }}</div>
            </td>
            <td class="px-6 py-4 font-medium">{{ app.jobTitle }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ app.lastUpdatedAt | date:'medium' }}</td>
          </tr>
        </tbody>
      </table>
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