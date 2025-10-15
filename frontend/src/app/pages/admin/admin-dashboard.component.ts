import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AdminDashboardStatsDto } from '../../models';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="stats" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="p-6 bg-white rounded-2xl shadow-md border border-gray-200/80 transition hover:shadow-lg hover:-translate-y-1"><h3 class="text-base font-semibold text-gray-500">Active Jobs</h3><p class="mt-2 text-4xl font-extrabold text-gray-900">{{ stats.activeJobCount }}</p></div>
            <div class="p-6 bg-white rounded-2xl shadow-md border border-gray-200/80 transition hover:shadow-lg hover:-translate-y-1"><h3 class="text-base font-semibold text-gray-500">Active Vendors</h3><p class="mt-2 text-4xl font-extrabold text-gray-900">{{ stats.activeVendorCount }}</p></div>
            <div class="p-6 bg-white rounded-2xl shadow-md border border-gray-200/80 transition hover:shadow-lg hover:-translate-y-1"><h3 class="text-base font-semibold text-gray-500">Total Applications</h3><p class="mt-2 text-4xl font-extrabold text-gray-900">{{ stats.totalApplications }}</p></div>
            <div class="p-6 bg-white rounded-2xl shadow-md border border-gray-200/80 transition hover:shadow-lg hover:-translate-y-1"><h3 class="text-base font-semibold text-gray-500">Total Hired</h3><p class="mt-2 text-4xl font-extrabold text-green-600">{{ stats.hiredApplications }}</p></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="p-6 bg-white rounded-2xl shadow-md border border-gray-200/80">
                <h3 class="text-lg font-semibold">Recently Added Leaders</h3>
                <ul class="mt-4 space-y-2"><li *ngFor="let user of stats.recentlyAddedLeaders" class="p-3 bg-gray-50 rounded-lg">{{user.firstName}} {{user.lastName}}</li></ul>
            </div>
            <div class="p-6 bg-white rounded-2xl shadow-md border border-gray-200/80">
                <h3 class="text-lg font-semibold">Recently Added Vendors</h3>
                <ul class="mt-4 space-y-2"><li *ngFor="let vendor of stats.recentlyAddedVendors" class="p-3 bg-gray-50 rounded-lg">{{vendor.companyName}}</li></ul>
            </div>
        </div>
    </div>
    <div *ngIf="!stats" class="text-center p-8">Loading dashboard...</div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminDashboardStatsDto | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getDashboardStats().subscribe(data => {
      this.stats = data;
    });
  }
}