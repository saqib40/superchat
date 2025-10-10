// src/app/pages/admin/admin-dashboard.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen p-8 bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <div class="p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
          <div class="flex items-center space-x-4 mb-4 border-b pb-4">
            <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.942 3.3.705 2.772 2.651a1.724 1.724 0 00.046 2.615c1.474 1.81.233 4.143-1.85 4.143a1.724 1.724 0 00-1.54 1.053c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.942-3.3-.705-2.772-2.651a1.724 1.724 0 00-.046-2.615c-1.954-1.81-.713-4.143 1.35-4.143a1.724 1.724 0 001.54-1.053z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">System Admin Console</h2>
          </div>
          
          <div class="mt-4">
            <p class="text-lg text-gray-700 leading-relaxed">
              Welcome aboard, <strong class="text-indigo-600">Admin</strong>! This control panel provides access to the core configuration and management tools for the entire system.
            </p>
            <p class="mt-3 text-base text-gray-600 border-l-4 border-indigo-400 pl-4 py-1 bg-indigo-50/50 italic">
              Key responsibilities include **managing system settings** and the **creation/removal of Leadership accounts**. Use your authority responsibly.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {}
