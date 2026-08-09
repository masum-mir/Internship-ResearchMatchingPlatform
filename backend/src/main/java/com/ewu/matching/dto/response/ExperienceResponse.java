package com.ewu.matching.dto.response;
import com.ewu.matching.enums.EmploymentType;
import java.time.LocalDate;
public record ExperienceResponse(Long id, String title, String organizationName, EmploymentType employmentType,
                                 String location, LocalDate startDate, LocalDate endDate,
                                 boolean currentlyWorking, String description) {}
