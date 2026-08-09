package com.ewu.matching.dto.request;
import jakarta.validation.constraints.Size;
public record SendMessageRequest(@Size(max=10000) String content, @Size(max=500) String attachmentUrl) {}
