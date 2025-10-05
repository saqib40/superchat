// src/app/pages/admin/manage-leaders.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold">Create New Leader</h2>
        <form [formGroup]="leaderForm" (ngSubmit)="createLeader()" class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <input formControlName="firstName" placeholder="First Name" class="px-3 py-2 border rounded">
          <input formControlName="lastName" placeholder="Last Name" class="px-3 py-2 border rounded">
          <input formControlName="email" type="email" placeholder="Email" class="px-3 py-2 border rounded">
          <input formControlName="password" type="password" placeholder="Password" class="px-3 py-2 border rounded">
          <button type="submit" [disabled]="leaderForm.invalid" class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400 col-span-1 md:col-span-3">Create Leader</button>
        </form>
      </div>

      <div class="p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold">Existing Leaders</h2>
        <ul class="mt-4 space-y-2">
          <li *ngFor="let leader of leaders" class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>{{ leader.firstName }} {{ leader.lastName }} ({{ leader.email }})</span>
            <button (click)="deleteLeader(leader)" class="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">Delete</button>
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
      password: ['', Validators.required],
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
    if (confirm(`Are you sure you want to delete ${leader.firstName}?`)) {
      this.adminService.deleteLeader(leader.publicId).subscribe(() => this.loadLeaders());
    }
  }
}