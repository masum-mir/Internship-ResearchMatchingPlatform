package com.ewu.matching.dto.response;

public record FacultyProfileResponse(
        Long id,
        String name,
        String department,
        String designation,
        String contactNumber,
        String email
) {}
