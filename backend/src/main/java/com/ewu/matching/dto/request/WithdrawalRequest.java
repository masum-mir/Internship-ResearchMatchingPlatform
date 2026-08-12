package com.ewu.matching.dto.request;

import jakarta.validation.constraints.Size;

public record WithdrawalRequest(
        @Size(max = 2000, message = "Explanation must be 2000 characters or fewer") String reason
) {}
