// src/app/pages/leadership/leadership-dashboard.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold text-gray-800">Leadership Dashboard</h2>
      <p class="mt-2 text-gray-600">
        Welcome to the Leadership portal. Use the sidebar to manage vendors and create new job assignments.
      </p>
    </div>
  `
})
export class LeadershipDashboardComponent {}