import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models';
import { passwordValidator } from '../../validators/password.validator';


@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8 bg-slate-50 min-h-screen">
      <div class="max-w-6xl mx-auto space-y-10">
        
        <!-- Create New Leader Card -->
        <div class="p-8 bg-white rounded-3xl shadow-2xl border border-blue-200/60 transition hover:shadow-3xl">
          <h2 class="text-3xl font-extrabold text-gray-800 mb-8 flex items-center border-b pb-4">
            <svg class="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
            Create New Leadership Account
          </h2>
          <form [formGroup]="leaderForm" (ngSubmit)="createLeader()" class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <!-- Input Fields -->
            <input formControlName="firstName" placeholder="First Name" class="p-3.5 border-2 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-200 focus:shadow-md" [class.border-red-500]="leaderForm.get('firstName')?.invalid && leaderForm.get('firstName')?.touched">
            
            <input formControlName="lastName" placeholder="Last Name" class="p-3.5 border-2 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-200 focus:shadow-md" [class.border-red-500]="leaderForm.get('lastName')?.invalid && leaderForm.get('lastName')?.touched">
            
            <input formControlName="email" type="email" placeholder="Email Address" class="p-3.5 border-2 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-200 focus:shadow-md" [class.border-red-500]="leaderForm.get('email')?.invalid && leaderForm.get('email')?.touched">
            
            <input formControlName="password" type="password" placeholder="Temporary Password" class="p-3.5 border-2 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-200 focus:shadow-md" [class.border-red-500]="leaderForm.get('password')?.invalid && leaderForm.get('password')?.touched">
            
            <!-- Password Validation Error Message -->
            <div class="lg:col-span-4 col-span-1 sm:col-span-2" *ngIf="leaderForm.get('password')?.errors?.['passwordStrength'] && leaderForm.get('password')?.touched">
                <p class="text-sm text-red-700 p-3 bg-red-100 rounded-xl border border-red-300">
                    <span class="font-medium mr-1">Security Alert:</span> Password must be at least 8 characters long, contain an uppercase letter, a number, and a symbol.
                </p>
            </div>

            <!-- Submit Button -->
            <div class="lg:col-span-4 col-span-1 sm:col-span-2 mt-4">
                <button 
                  type="submit" 
                  [disabled]="leaderForm.invalid" 
                  class="w-full px-6 py-4 text-xl font-semibold text-white bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl shadow-xl hover:from-blue-800 hover:to-indigo-900 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed transition transform hover:scale-[1.005] duration-300"
                >
                  Confirm Account Creation
                </button>
            </div>
          </form>
        </div>

        <!-- Existing Leaders List -->
        <div class="p-8 bg-white rounded-3xl shadow-2xl border border-gray-200/60">
          <h2 class="text-3xl font-extrabold text-gray-800 mb-8 flex items-center border-b pb-4">
            <svg class="w-8 h-8 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2c0-.656-.126-1.283-.356-1.857M15 11h2m-2 0h-2M12 4v2m0 16v-2m-6-4H4m16 0h-2M12 12c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"></path>
            </svg>
            Existing Leadership Accounts ({{ leaders.length }})
          </h2>
          <ul class="mt-4 space-y-4">
            <li *ngIf="leaders.length === 0" class="text-gray-500 italic p-6 bg-gray-100 rounded-2xl text-center">No leadership accounts have been created yet.</li>
            <li *ngFor="let leader of leaders" class="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-gray-50 hover:bg-red-50/50 border border-gray-100 rounded-2xl transition duration-300 shadow-sm">
              <div class="flex flex-col mb-2 md:mb-0">
                <span class="font-bold text-xl text-gray-900">{{ leader.firstName }} {{ leader.lastName }}</span>
                <span class="text-md text-gray-500 mt-0.5">{{ leader.email }}</span>
              </div>
              <button (click)="deleteLeader(leader)" class="px-6 py-2.5 text-base font-semibold text-white bg-red-600 rounded-xl shadow-md hover:bg-red-700 transition duration-200 transform hover:shadow-lg hover:scale-105">
                <span class="hidden sm:inline">Revoke Access</span>
                <svg class="w-5 h-5 sm:ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class ManageLeadersComponent implements OnInit {
  leaders: User[] = [];
  leaderForm: FormGroup;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.leaderForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Fixed the placement of passwordValidator inside the Validators array
      password: ['', [Validators.required, passwordValidator]],
    });
  }

  ngOnInit() { this.loadLeaders(); }

  loadLeaders() {
    this.adminService.getLeaders().subscribe(data => this.leaders = data);
  }

  createLeader() {
    if (this.leaderForm.invalid) return;
    this.adminService.createLeader(this.leaderForm.value).subscribe(() => {
      this.loadLeaders();
      this.leaderForm.reset();
    });
  }

  deleteLeader(leader: User) {
    // NOTE: The window.confirm() function is not supported in this environment.
    // In a real application, replace this with a custom confirmation modal UI.
    console.log(`Attempting to delete leader: ${leader.email}`);
    this.adminService.deleteLeader(leader.publicId).subscribe({
      next: () => {
        this.loadLeaders();
        console.log(`Leader ${leader.email} deleted successfully.`);
      },
      error: (err) => {
        console.error(`Failed to delete leader ${leader.email}`, err);
        // In a real app, show a toast or error message in the UI
      }
    });
  }
}
