package com.ewu.matching.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record CertificationRequest(
        @NotBlank String name,
        String issuer,
        LocalDate issueDate,
        String link
) {}
