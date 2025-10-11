import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-50 min-h-screen p-8 sm:p-12">
      <div class="max-w-4xl mx-auto">
        <div class="p-8 md:p-10 bg-white rounded-3xl shadow-2xl border border-indigo-100">
          
          <!-- Header and Welcome Message -->
          <div class="flex items-center space-x-5 border-b pb-5 mb-6">
            <!-- Icon -->
            <svg class="w-12 h-12 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2c0-.656-.126-1.283-.356-1.857M12 18h.01M5 20h5v-2a3 3 0 015.356-1.857M5 20v-2c0-.656.126-1.283.356-1.857M9 10h.01M4 10h.01M16 10h.01M12 10h.01M10 9l-3.356 3.356a1 1 0 000 1.414l7.684 7.684a1 1 0 001.414 0L20 16.056"></path>
            </svg>
            <div>
              <h2 class="text-4xl font-extrabold text-gray-900 tracking-tight">Leadership Control Panel</h2>
              <p class="mt-1 text-lg text-indigo-700 font-medium">Welcome to the Leadership portal.</p>
            </div>
          </div>

          <!-- Main Instructions Panel -->
          <div class="mt-6">
            <p class="text-xl text-gray-700 leading-relaxed">
              This dashboard serves as your central hub for talent acquisition and vendor management activities.
            </p>
            
            <div class="mt-6 p-5 bg-indigo-50 rounded-xl border-l-4 border-indigo-500 shadow-md">
                <p class="text-base font-semibold text-indigo-900">
                  <span class="font-extrabold">Action Required:</span> Use the sidebar navigation to perform key actions:
                </p>
                <ul class="mt-3 space-y-2 text-gray-700 list-disc list-inside ml-4">
                  <li><strong class="text-indigo-600">Manage Vendors:</strong> Oversee and update your existing vendor partnerships.</li>
                  <li><strong class="text-indigo-600">Create Jobs:</strong> Define and publish new job assignments to the vendor network.</li>
                </ul>
            </div>
            
            <p class="mt-6 text-sm text-gray-500 italic">
                Navigate the system efficiently to accelerate recruitment processes.
            </p>

          </div>
        </div>
      </div>
    </div>
  `
})
export class LeadershipDashboardComponent {}
