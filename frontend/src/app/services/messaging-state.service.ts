// only job => manages which chat is currently open
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConversationDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MessagingStateService {
  public activeConversation$ = new BehaviorSubject<ConversationDto | null>(null);

  openChat(conversation: ConversationDto): void {
    this.activeConversation$.next(conversation);
  }

  closeChat(): void {
    this.activeConversation$.next(null);
  }
}