package com.ewu.matching.service;

import com.ewu.matching.dto.response.*;
import java.util.List;

public interface MessagingService {
    ConversationResponse startDirect(Long otherUserId);

    List<ConversationResponse> conversations();

    MessageResponse send(Long conversationId, String content, String attachmentUrl);

    List<MessageResponse> messages(Long conversationId);

    void markRead(Long conversationId);
}
