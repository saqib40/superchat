// src/app/pages/vendor/vendor-dashboard.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold text-gray-800">Vendor Dashboard</h2>
      <p class="mt-2 text-gray-600">
        Welcome. You can view your assigned jobs and submit employees through the navigation panel.
      </p>
    </div>
  `
})
export class VendorDashboardComponent {}