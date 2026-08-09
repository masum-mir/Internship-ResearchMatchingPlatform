package com.ewu.matching.dto.response;
import java.time.LocalDate;
public record EducationResponse(Long id, String institution, String degree, String fieldOfStudy,
                                LocalDate startDate, LocalDate endDate, String description) {}
