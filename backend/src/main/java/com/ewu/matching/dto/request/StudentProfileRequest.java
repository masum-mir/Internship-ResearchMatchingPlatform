package com.ewu.matching.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;

public record StudentProfileRequest(
        String name,
        String studentId,
        String department,
        String batch,
        @DecimalMin(value = "0.0", message = "CGPA cannot be negative")
        @DecimalMax(value = "4.0", message = "CGPA cannot exceed 4.0")
        BigDecimal cgpa,
        String contactNumber,
        String address,
        String profilePicture
) {}
