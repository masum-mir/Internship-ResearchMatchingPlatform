package com.ewu.matching.dto.request;

public record FacultyProfileRequest(
        String name,
        String department,
        String designation,
        String contactNumber
) {}
