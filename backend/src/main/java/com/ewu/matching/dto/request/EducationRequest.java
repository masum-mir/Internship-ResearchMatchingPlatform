package com.ewu.matching.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
public record EducationRequest(@NotBlank String institution, String degree, String fieldOfStudy,
                               LocalDate startDate, LocalDate endDate, @Size(max=5000) String description) {}
