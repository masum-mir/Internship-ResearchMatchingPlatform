package com.ewu.matching.controller;

import com.ewu.matching.dto.request.ResearchRequest;
import com.ewu.matching.dto.response.MatchedResearchResponse;
import com.ewu.matching.dto.response.ResearchResponse;
import com.ewu.matching.security.access.IsFaculty;
import com.ewu.matching.security.access.IsStudent;
import com.ewu.matching.service.ResearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Research Opportunities", description = "Faculty research CRUD + browse/search/match")
@RestController
@RequestMapping("/api/research")
@RequiredArgsConstructor
public class ResearchController {

    private final ResearchService researchService;

    // ---------- Faculty: CRUD (ownership enforced in service) ----------

    @Operation(summary = "Create a research post (FACULTY)")
    @IsFaculty
    @PostMapping
    public ResponseEntity<ResearchResponse> create(@Valid @RequestBody ResearchRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(researchService.create(request));
    }

    @Operation(summary = "Update one of my research posts (FACULTY)")
    @IsFaculty
    @PutMapping("/{id}")
    public ResponseEntity<ResearchResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody ResearchRequest request) {
        return ResponseEntity.ok(researchService.update(id, request));
    }

    @Operation(summary = "Delete one of my research posts (FACULTY)")
    @IsFaculty
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        researchService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "List research posts created by the current faculty (FACULTY)")
    @IsFaculty
    @GetMapping("/mine")
    public ResponseEntity<List<ResearchResponse>> mine() {
        return ResponseEntity.ok(researchService.listMine());
    }

    // ---------- Student: match-ranked feed ----------

    @Operation(summary = "Active research posts ranked by match score for the current student (STUDENT)")
    @IsStudent
    @GetMapping("/matched")
    public ResponseEntity<List<MatchedResearchResponse>> matched() {
        return ResponseEntity.ok(researchService.getMatchedForCurrentStudent());
    }

    // ---------- Any authenticated user: browse / search / detail ----------

    @Operation(summary = "Search/filter active research posts by topic, area, faculty")
    @GetMapping
    public ResponseEntity<List<ResearchResponse>> search(
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) String faculty) {
        return ResponseEntity.ok(researchService.search(topic, area, faculty));
    }

    @Operation(summary = "Get a single research post by id")
    @GetMapping("/{id}")
    public ResponseEntity<ResearchResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(researchService.getById(id));
    }
}
