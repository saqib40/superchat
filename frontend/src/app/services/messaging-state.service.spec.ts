import { TestBed } from '@angular/core/testing';
import { MessagingStateService } from './messaging-state.service';
import { ConversationDto } from '../models';

describe('MessagingStateService', () => {
  let service: MessagingStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagingStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#activeConversation$ should initially emit null', () => {
    // Assert that the default value of the BehaviorSubject is null
    expect(service.activeConversation$.getValue()).toBeNull();
  });

  describe('#openChat', () => {
    it('should update activeConversation$ with the provided conversation', () => {
      // Arrange: Create a mock conversation object.
      // We cast to 'unknown' first to satisfy TypeScript for simple mocks.
      const mockConversation = {
        conversationPublicId: 'convo-123',
        participantName: 'John Doe',
      } as unknown as ConversationDto;

      // Act: Call the method to open the chat.
      service.openChat(mockConversation);

      // Assert: Check that the BehaviorSubject now holds the new conversation.
      expect(service.activeConversation$.getValue()).toEqual(mockConversation);
    });
  });

  describe('#closeChat', () => {
    it('should update activeConversation$ to null', () => {
      // Arrange: First, put a conversation into the state.
      const mockConversation = { conversationPublicId: 'convo-123' } as unknown as ConversationDto;
      service.openChat(mockConversation);

      // Act: Call the method to close the chat.
      service.closeChat();

      // Assert: Check that the BehaviorSubject is now null.
      expect(service.activeConversation$.getValue()).toBeNull();
    });
  });
});