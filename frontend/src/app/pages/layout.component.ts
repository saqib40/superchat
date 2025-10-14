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
      <aside class="w-64 bg-white shadow-lg flex flex-col">
        <div class="p-4 border-b">
          <h1 class="text-xl font-bold text-blue-600">Superchat Portal</h1>
          <p class="text-sm text-gray-500">Role: {{ userRole }}</p>
        </div>
        
        <nav class="mt-4 flex-1">
          <ng-container *ngIf="userRole === 'Admin'">
            <a routerLink="/admin/dashboard" routerLinkActive="bg-blue-100 text-blue-700 font-semibold" class="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg mx-2 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
              <span class="ml-3">Dashboard</span>
            </a>
            <a routerLink="/admin/leaders" routerLinkActive="bg-blue-100 text-blue-700 font-semibold" class="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg mx-2 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 15a5.975 5.975 0 01-3-1.197z"></path></svg>
              <span class="ml-3">Manage Leaders</span>
            </a>
          </ng-container>
          <ng-container *ngIf="userRole === 'Leadership'">
            <a routerLink="/leadership/dashboard" routerLinkActive="bg-blue-100 text-blue-700 font-semibold" class="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg mx-2 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                <span class="ml-3">Dashboard</span>
            </a>
            <a routerLink="/leadership/vendors" routerLinkActive="bg-blue-100 text-blue-700 font-semibold" class="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg mx-2 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <span class="ml-3">Manage Vendors</span>
            </a>
            <a routerLink="/leadership/jobs" routerLinkActive="bg-blue-100 text-blue-700 font-semibold" class="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg mx-2 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span class="ml-3">Manage Jobs</span>
            </a>
            <a routerLink="/leadership/hired" routerLinkActive="bg-blue-100 text-blue-700 font-semibold" class="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg mx-2 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span class="ml-3">Hired Candidates</span>
            </a>
            <a routerLink="/leadership/conversations" routerLinkActive="bg-blue-100 text-blue-700 font-semibold" class="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg mx-2 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <span class="ml-3">Conversations</span>
            </a>
          </ng-container>
          <ng-container *ngIf="userRole === 'Vendor'">
            <a routerLink="/vendor/dashboard" routerLinkActive="bg-blue-100 text-blue-700 font-semibold" class="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg mx-2 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
              <span class="ml-3">Dashboard</span>
            </a>
            <a routerLink="/vendor/jobs" routerLinkActive="bg-blue-100 text-blue-700 font-semibold" class="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg mx-2 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span class="ml-3">My Assigned Jobs</span>
            </a>
            <a routerLink="/vendor/conversations" routerLinkActive="bg-blue-100 text-blue-700 font-semibold" class="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg mx-2 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <span class="ml-3">Conversations</span>
            </a>
          </ng-container>
        </nav>

        <div class="p-4 border-t">
          <button (click)="logout()" class="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-semibold">Logout</button>
        </div>
      </aside>
      
      <main class="flex-1 p-8 overflow-y-auto">
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