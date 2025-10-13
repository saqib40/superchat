import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessagingService } from '../services/messaging.service';
import { AuthService } from '../services/auth.service';
import { ConversationDto, MessageDto } from '../models';

@Component({
  selector: 'app-chat-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <!-- Chat container (no overlay, inline in layout) -->
    <div
      class="fixed bottom-4 right-4 md:right-6 md:bottom-6 w-[90vw] md:w-96 h-[70vh] md:h-[550px]
             bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 z-40 overflow-hidden"
    >
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-2xl">
        <h3 class="font-semibold text-gray-800 text-lg truncate">
          {{ conversation.participantName }}
        </h3>
        <button
          (click)="close()"
          class="text-gray-500 hover:text-gray-800 text-xl leading-none"
        >
          ✕
        </button>
      </div>

      <!-- Messages -->
      <div
        #messageContainer
        class="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100"
      >
        <div *ngIf="isLoading" class="text-center text-gray-500 mt-4">
          Loading messages...
        </div>

        <div
          *ngFor="let msg of messages"
          class="flex"
          [ngClass]="{
            'justify-end': msg.senderPublicId === myPublicId,
            'justify-start': msg.senderPublicId !== myPublicId
          }"
        >
          <div
            class="max-w-[70%] px-3 py-2 rounded-xl break-words"
            [ngClass]="{
              'bg-blue-600 text-white': msg.senderPublicId === myPublicId,
              'bg-gray-200 text-gray-800': msg.senderPublicId !== myPublicId
            }"
          >
            <p class="text-sm leading-snug">{{ msg.content }}</p>
            <p class="text-[10px] opacity-70 mt-1 text-right">
              {{ msg.sentAt | date: 'shortTime' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-3 border-t bg-white">
        <form (ngSubmit)="sendMessage()" class="flex items-center space-x-2">
          <textarea
            [(ngModel)]="newMessageContent"
            name="message"
            (keydown.enter)="sendMessage(); $event.preventDefault()"
            placeholder="Type your message..."
            class="flex-1 p-2 border rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="1"
          ></textarea>
          <button
            type="submit"
            [disabled]="!newMessageContent.trim()"
            class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  `,
})
export class ChatModalComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() conversation!: ConversationDto;
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  messages: MessageDto[] = [];
  newMessageContent = '';
  myPublicId: string | null = null;
  isLoading = true;

  private messagesSubscription!: Subscription;

  constructor(
    private messagingService: MessagingService,
    private authService: AuthService
  ) {
    const decodedToken: any = this.authService.getDecodedToken();
    this.myPublicId = decodedToken?.PublicId || null;
  }

  ngOnInit(): void {
    this.messagesSubscription = this.messagingService.messages$.subscribe(
      (messages) => (this.messages = messages)
    );

    this.messagingService
      .getMessages(this.conversation.conversationPublicId)
      .subscribe(() => (this.isLoading = false));
  }

  ngOnDestroy(): void {
    if (this.messagesSubscription) this.messagesSubscription.unsubscribe();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  // ✅ Optimistic sending
  sendMessage(): void {
    const content = this.newMessageContent.trim();
    if (!content) return;

    const optimisticMessage: MessageDto = {
      id: Date.now(),
      content,
      sentAt: new Date().toISOString(),
      senderPublicId: this.myPublicId!,
      senderName: 'Me',
    };

    this.messages.push(optimisticMessage);
    this.newMessageContent = '';
    this.scrollToBottom();

    this.messagingService
      .sendMessage(this.conversation.conversationPublicId, content)
      .catch((err) => {
        console.error('Error sending message:', err);
        this.messages = this.messages.filter(
          (m) => m.id !== optimisticMessage.id
        );
      });
  }

  close(): void {
    this.closeModal.emit();
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch {}
  }
}
