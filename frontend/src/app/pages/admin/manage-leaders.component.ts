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
    <div class="space-y-10">
      
      <div class="p-8 bg-white rounded-2xl shadow-lg border border-gray-200/60">
        <h2 class="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-4">
          Create New Leadership Account
        </h2>
        <form [formGroup]="leaderForm" (ngSubmit)="createLeader()" class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <input formControlName="firstName" placeholder="First Name" class="p-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" [class.border-red-500]="leaderForm.get('firstName')?.invalid && leaderForm.get('firstName')?.touched">
          
          <input formControlName="lastName" placeholder="Last Name" class="p-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" [class.border-red-500]="leaderForm.get('lastName')?.invalid && leaderForm.get('lastName')?.touched">
          
          <input formControlName="email" type="email" placeholder="Email Address" class="p-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" [class.border-red-500]="leaderForm.get('email')?.invalid && leaderForm.get('email')?.touched">
          
          <input formControlName="password" type="password" placeholder="Temporary Password" class="p-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" [class.border-red-500]="leaderForm.get('password')?.invalid && leaderForm.get('password')?.touched">
          
          <div class="lg:col-span-4 col-span-1 sm:col-span-2" *ngIf="leaderForm.get('password')?.errors?.['passwordStrength'] && leaderForm.get('password')?.touched">
              <p class="text-sm text-red-700 p-3 bg-red-100 rounded-lg border border-red-300">
                  Password must be at least 8 characters long, contain an uppercase letter, a number, and a symbol.
              </p>
          </div>

          <div class="lg:col-span-4 col-span-1 sm:col-span-2 mt-2">
              <button 
                type="submit" 
                [disabled]="leaderForm.invalid" 
                class="w-full px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition transform hover:scale-[1.02] duration-300"
              >
                Create Account
              </button>
          </div>
        </form>
      </div>

      <div class="p-8 bg-white rounded-2xl shadow-lg border border-gray-200/60">
        <h2 class="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-4">
          Existing Leadership Accounts ({{ leaders.length }})
        </h2>
        <ul class="mt-4 space-y-3">
          <li *ngIf="leaders.length === 0" class="text-gray-500 italic p-6 bg-gray-50 rounded-xl text-center">No leadership accounts have been created yet.</li>
          <li *ngFor="let leader of leaders" class="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 hover:bg-blue-50/50 border border-gray-100 rounded-xl transition duration-300">
            <div>
              <span class="font-bold text-lg text-gray-900">{{ leader.firstName }} {{ leader.lastName }}</span>
              <span class="text-md text-gray-500 block mt-0.5">{{ leader.email }}</span>
            </div>
            <button (click)="deleteLeader(leader)" class="mt-2 md:mt-0 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-200 transform hover:shadow-lg hover:scale-105">
              Delete
            </button>
          </li>
        </ul>
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