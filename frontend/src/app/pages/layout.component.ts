import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessagingService } from '../services/messaging.service';
import { MessagingStateService } from '../services/messaging-state.service';
import { ChatModalComponent } from './chat-modal.component';
import { ConversationDto } from '../models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ChatModalComponent],
  template: `
    <div class="flex h-screen bg-gray-100 font-sans">
      <aside class="w-64 bg-white shadow-md">
        <div class="p-4 border-b">
          <h1 class="text-xl font-bold text-blue-600">Superchat Portal</h1>
          <p class="text-sm text-gray-500">Role: {{ userRole }}</p>
        </div>
        
        <nav class="mt-4">
          <ng-container *ngIf="userRole === 'Admin'">
            <a routerLink="/admin/dashboard" routerLinkActive="bg-blue-100 text-blue-700" class="block py-2 px-4 text-gray-700 hover:bg-gray-200">Dashboard</a>
            <a routerLink="/admin/leaders" routerLinkActive="bg-blue-100 text-blue-700" class="block py-2 px-4 text-gray-700 hover:bg-gray-200">Manage Leaders</a>
          </ng-container>
          <ng-container *ngIf="userRole === 'Leadership'">
            <a routerLink="/leadership/dashboard" routerLinkActive="bg-blue-100 text-blue-700" class="block py-2 px-4 text-gray-700 hover:bg-gray-200">Dashboard</a>
            <a routerLink="/leadership/vendors" routerLinkActive="bg-blue-100 text-blue-700" class="block py-2 px-4 text-gray-700 hover:bg-gray-200">Manage Vendors</a>
            <a routerLink="/leadership/jobs" routerLinkActive="bg-blue-100 text-blue-700" class="block py-2 px-4 text-gray-700 hover:bg-gray-200">Manage Jobs</a>
            <a routerLink="/leadership/hired" routerLinkActive="bg-blue-100 text-blue-700" class="block py-2 px-4 text-gray-700 hover:bg-gray-200">Hired Candidates</a>
            <a routerLink="/leadership/conversations" routerLinkActive="bg-blue-100 text-blue-700" class="block py-2 px-4 text-gray-700 hover:bg-gray-200">Conversations</a>
          </ng-container>
          <ng-container *ngIf="userRole === 'Vendor'">
            <a routerLink="/vendor/dashboard" routerLinkActive="bg-blue-100 text-blue-700" class="block py-2 px-4 text-gray-700 hover:bg-gray-200">Dashboard</a>
            <a routerLink="/vendor/jobs" routerLinkActive="bg-blue-100 text-blue-700" class="block py-2 px-4 text-gray-700 hover:bg-gray-200">My Assigned Jobs</a>
            <a routerLink="/vendor/conversations" routerLinkActive="bg-blue-100 text-blue-700" class="block py-2 px-4 text-gray-700 hover:bg-gray-200">Conversations</a>
          </ng-container>
        </nav>

        <div class="absolute bottom-0 w-64 p-4 border-t">
          <button (click)="logout()" class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">Logout</button>
        </div>
      </aside>
      
      <main class="flex-1 p-6 overflow-y-auto">
        <router-outlet></router-outlet>
      </main>
    </div>

    <app-chat-modal *ngIf="activeConversation$ | async as convo"
                    [conversation]="convo"
                    (closeModal)="closeChat()">
    </app-chat-modal>
  `
})
export class LayoutComponent implements OnInit, OnDestroy {
  userRole: string | null;
  activeConversation$: Observable<ConversationDto | null>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messagingService: MessagingService,
    private messagingStateService: MessagingStateService
  ) {
    const roles = this.authService.getUserRole();
    this.userRole = Array.isArray(roles) ? roles[0] : roles;
    this.activeConversation$ = this.messagingStateService.activeConversation$;
  }

  ngOnInit(): void {
    this.messagingService.startConnection();
  }

  ngOnDestroy(): void {
    this.messagingService.stopConnection();
  }

  closeChat(): void {
    this.messagingStateService.closeChat();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}