package com.ewu.matching.dto.request;
import jakarta.validation.constraints.Size;
public record SharePostRequest(@Size(max=3000) String caption) {}
