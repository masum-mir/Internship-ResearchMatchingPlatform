package com.ewu.matching.controller;
import com.ewu.matching.dto.request.*;import com.ewu.matching.dto.response.*;import com.ewu.matching.security.CurrentUserProvider;import com.ewu.matching.service.ProfessionalProfileService;import io.swagger.v3.oas.annotations.tags.Tag;import jakarta.validation.Valid;import lombok.RequiredArgsConstructor;import org.springframework.http.*;import org.springframework.security.access.prepost.PreAuthorize;import org.springframework.web.bind.annotation.*;import java.util.List;
@Tag(name="Professional Profiles",description="Public profile, education and experience") @RestController @RequestMapping("/api/profiles") @RequiredArgsConstructor @PreAuthorize("isAuthenticated()")
public class ProfessionalProfileController {private final ProfessionalProfileService service;private final CurrentUserProvider currentUser;
 @GetMapping("/users/{userId}") public ResponseEntity<PublicProfileResponse> profile(@PathVariable Long userId){return ResponseEntity.ok(service.publicProfile(userId));}
 @GetMapping("/users/{userId}/education") public ResponseEntity<List<EducationResponse>> education(@PathVariable Long userId){return ResponseEntity.ok(service.education(userId));}
 @GetMapping("/users/{userId}/experience") public ResponseEntity<List<ExperienceResponse>> experience(@PathVariable Long userId){return ResponseEntity.ok(service.experience(userId));}
 @GetMapping("/me") public ResponseEntity<PublicProfileResponse> me(){return ResponseEntity.ok(service.publicProfile(currentUser.currentUser().getId()));}
 @PostMapping("/me/education") public ResponseEntity<EducationResponse> addEducation(@Valid @RequestBody EducationRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.addEducation(r));}
 @PutMapping("/me/education/{id}") public ResponseEntity<EducationResponse> updateEducation(@PathVariable Long id,@Valid @RequestBody EducationRequest r){return ResponseEntity.ok(service.updateEducation(id,r));}
 @DeleteMapping("/me/education/{id}") public ResponseEntity<Void> deleteEducation(@PathVariable Long id){service.deleteEducation(id);return ResponseEntity.noContent().build();}
 @PostMapping("/me/experience") public ResponseEntity<ExperienceResponse> addExperience(@Valid @RequestBody ExperienceRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.addExperience(r));}
 @PutMapping("/me/experience/{id}") public ResponseEntity<ExperienceResponse> updateExperience(@PathVariable Long id,@Valid @RequestBody ExperienceRequest r){return ResponseEntity.ok(service.updateExperience(id,r));}
 @DeleteMapping("/me/experience/{id}") public ResponseEntity<Void> deleteExperience(@PathVariable Long id){service.deleteExperience(id);return ResponseEntity.noContent().build();}
}
