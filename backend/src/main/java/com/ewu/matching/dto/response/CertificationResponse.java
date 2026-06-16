package com.ewu.matching.dto.response;

import java.time.LocalDate;

public record CertificationResponse(
        Long id,
        String name,
        String issuer,
        LocalDate issueDate,
        String link
) {}
