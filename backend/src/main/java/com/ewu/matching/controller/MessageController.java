package com.ewu.matching.controller;

import com.ewu.matching.dto.request.SendMessageRequest;
import com.ewu.matching.dto.request.StartConversationRequest;
import com.ewu.matching.dto.response.ConversationResponse;
import com.ewu.matching.dto.response.MessageResponse;
import com.ewu.matching.service.FileStorageService;
import com.ewu.matching.service.MessagingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Tag(name = "Messaging", description = "Direct conversations and messages")
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class MessageController {

    private final MessagingService service;
    private final FileStorageService fileStorageService;

    @PostMapping("/conversations")
    public ResponseEntity<ConversationResponse> start(@Valid @RequestBody StartConversationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.startDirect(request.userId()));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> conversations() {
        return ResponseEntity.ok(service.conversations());
    }

    @PostMapping(value = "/conversations/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MessageResponse> send(@PathVariable Long id,
                                                @Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.send(id, request.content(), request.attachmentUrl()));
    }

    @PostMapping(value = "/conversations/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MessageResponse> sendWithAttachment(
            @PathVariable Long id,
            @Valid @RequestPart("data") SendMessageRequest request,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment) throws IOException {

        String attachmentUrl = request.attachmentUrl();
        if (attachment != null && !attachment.isEmpty()) {
            attachmentUrl = fileStorageService.saveMessageAttachment(attachment);
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.send(id, request.content(), attachmentUrl));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<List<MessageResponse>> messages(@PathVariable Long id) {
        return ResponseEntity.ok(service.messages(id));
    }

    @PutMapping("/conversations/{id}/read")
    public ResponseEntity<Void> read(@PathVariable Long id) {
        service.markRead(id);
        return ResponseEntity.noContent().build();
    }
}
