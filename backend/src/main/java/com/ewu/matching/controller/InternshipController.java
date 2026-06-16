package com.ewu.matching.controller;

import com.ewu.matching.dto.request.InternshipRequest;
import com.ewu.matching.dto.response.InternshipResponse;
import com.ewu.matching.dto.response.MatchedInternshipResponse;
import com.ewu.matching.security.access.IsCompany;
import com.ewu.matching.security.access.IsStudent;
import com.ewu.matching.service.InternshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Internships", description = "Company internship CRUD + browse/search/match")
@RestController
@RequestMapping("/api/internships")
@RequiredArgsConstructor
public class InternshipController {

    private final InternshipService internshipService;

    // ---------- Company: CRUD (ownership enforced in service) ----------

    @Operation(summary = "Create an internship (COMPANY)")
    @IsCompany
    @PostMapping
    public ResponseEntity<InternshipResponse> create(@Valid @RequestBody InternshipRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(internshipService.create(request));
    }

    @Operation(summary = "Update one of my internships (COMPANY)")
    @IsCompany
    @PutMapping("/{id}")
    public ResponseEntity<InternshipResponse> update(@PathVariable Long id,
                                                     @Valid @RequestBody InternshipRequest request) {
        return ResponseEntity.ok(internshipService.update(id, request));
    }

    @Operation(summary = "Delete one of my internships (COMPANY)")
    @IsCompany
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        internshipService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "List internships posted by the current company (COMPANY)")
    @IsCompany
    @GetMapping("/mine")
    public ResponseEntity<List<InternshipResponse>> mine() {
        return ResponseEntity.ok(internshipService.listMine());
    }

    // ---------- Student: match-ranked feed ----------

    @Operation(summary = "Active internships ranked by match score for the current student (STUDENT)")
    @IsStudent
    @GetMapping("/matched")
    public ResponseEntity<List<MatchedInternshipResponse>> matched() {
        return ResponseEntity.ok(internshipService.getMatchedForCurrentStudent());
    }

    // ---------- Any authenticated user: browse / search / detail ----------

    @Operation(summary = "Search/filter active internships by title, company, skill, location")
    @GetMapping
    public ResponseEntity<List<InternshipResponse>> search(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(internshipService.search(title, company, skill, location));
    }

    @Operation(summary = "Get a single internship by id")
    @GetMapping("/{id}")
    public ResponseEntity<InternshipResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(internshipService.getById(id));
    }
}
