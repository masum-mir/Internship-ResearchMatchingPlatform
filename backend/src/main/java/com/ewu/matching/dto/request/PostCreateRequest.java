package com.ewu.matching.dto.request;
import com.ewu.matching.enums.PostVisibility;
import jakarta.validation.constraints.Size;
public record PostCreateRequest(@Size(max=10000) String content, @Size(max=500) String mediaUrl,
                                @Size(max=50) String mediaType, PostVisibility visibility) {}
