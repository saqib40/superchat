// src/app/pages/admin/admin-dashboard.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
      <p class="mt-2 text-gray-600">
        Welcome, Admin. From here you can manage core system settings, including the creation and removal of Leadership accounts.
      </p>
    </div>
  `
})
export class AdminDashboardComponent {}