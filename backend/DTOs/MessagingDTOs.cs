namespace backend.DTOs
{
    // --- MESSAGING DTOs ---

    // Used by the Leader in the request body to start a chat
    public record CreateConversationRequest(Guid JobPublicId, Guid VendorPublicId);

    // Used to return message data to the client
    public record MessageDto(
        int Id,
        string Content,
        DateTime SentAt,
        Guid SenderPublicId,
        string SenderName
    );

    // Represents a conversation in a list view, providing summary details.
    public record ConversationDto(
        Guid ConversationPublicId,
        string JobTitle,
        Guid ParticipantPublicId,
        string ParticipantName,
        string? LastMessage,
        DateTime? LastMessageTimestamp
    );
}