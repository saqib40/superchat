// src/app/services/messaging.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { MessageDto, ConversationDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private apiUrl = `${environment.apiUrl}/messaging`;
  private hubConnection!: signalR.HubConnection;

  public messages$ = new BehaviorSubject<MessageDto[]>([]);
  public conversations$ = new BehaviorSubject<ConversationDto[]>([]);

  constructor(private http: HttpClient) { }

  // --- THIS IS THE NEW WRAPPER METHOD ---
  // It's a "seam" that makes the service testable.
  private createHubConnection(token: string): signalR.HubConnection {
    return new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl.replace('/api', '')}/chatHub`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();
  }

  public startConnection(): void {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    // Use the new wrapper method here instead of building directly.
    this.hubConnection = this.createHubConnection(token);

    this.hubConnection
      .start()
      .then(() => this.registerServerEvents())
      .catch(err => console.error('Error while starting SignalR connection: ' + err));
  }
  
  // ... (The rest of your service code is unchanged)
  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  private registerServerEvents(): void {
    this.hubConnection.on('ReceiveMessage', (newMessage: MessageDto) => {
      const currentMessages = this.messages$.getValue();
      this.messages$.next([...currentMessages, newMessage]);
    });
  }

  public sendMessage(conversationPublicId: string, content: string): Promise<void> {
    return this.hubConnection.invoke('SendMessage', conversationPublicId, content);
  }

  getMyConversations(): Observable<ConversationDto[]> {
    return this.http.get<ConversationDto[]>(`${this.apiUrl}/conversations`).pipe(
      tap(conversations => this.conversations$.next(conversations))
    );
  }

  getMessages(conversationPublicId: string): Observable<MessageDto[]> {
    this.messages$.next([]);
    return this.http.get<MessageDto[]>(`${this.apiUrl}/conversations/${conversationPublicId}/messages`).pipe(
      tap(messages => this.messages$.next(messages))
    );
  }
  
  startConversation(jobPublicId: string, vendorPublicId: string): Observable<{ conversationPublicId: string }> {
    return this.http.post<{ conversationPublicId: string }>(`${this.apiUrl}/conversations`, { jobPublicId, vendorPublicId });
  }
}