import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LeadershipService } from '../../../services/leadership.service';
import { DashboardData } from '../../../models';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-overview.component.html'
})
export class DashboardOverviewComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  isLoading = false;

  constructor(private leadershipService: LeadershipService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.leadershipService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }

  getApprovalRate(): number {
    if (!this.dashboardData || this.dashboardData.totalVendors === 0) return 0;
    return Math.round((this.dashboardData.approvedVendors / this.dashboardData.totalVendors) * 100);
  }
}
