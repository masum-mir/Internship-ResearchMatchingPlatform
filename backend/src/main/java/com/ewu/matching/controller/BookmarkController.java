package com.ewu.matching.controller;

import com.ewu.matching.dto.request.BookmarkRequest;
import com.ewu.matching.dto.response.BookmarkResponse;
import com.ewu.matching.security.access.IsStudent;
import com.ewu.matching.service.BookmarkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Bookmarks", description = "Student saved internships and research posts")
@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
@IsStudent
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @Operation(summary = "Save an internship or research post for later (STUDENT)")
    @PostMapping
    public ResponseEntity<BookmarkResponse> add(@Valid @RequestBody BookmarkRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookmarkService.add(request));
    }

    @Operation(summary = "Remove a bookmark (STUDENT)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        bookmarkService.remove(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "List my bookmarks (STUDENT)")
    @GetMapping
    public ResponseEntity<List<BookmarkResponse>> listMine() {
        return ResponseEntity.ok(bookmarkService.listMine());
    }
}
