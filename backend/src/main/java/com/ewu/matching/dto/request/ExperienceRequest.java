package com.ewu.matching.dto.request;
import com.ewu.matching.enums.EmploymentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
public record ExperienceRequest(@NotBlank String title, @NotBlank String organizationName,
                                EmploymentType employmentType, String location, LocalDate startDate,
                                LocalDate endDate, boolean currentlyWorking, @Size(max=5000) String description) {}
