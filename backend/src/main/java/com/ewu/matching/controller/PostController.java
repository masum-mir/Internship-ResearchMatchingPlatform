package com.ewu.matching.controller;

import com.ewu.matching.dto.request.*;
import com.ewu.matching.dto.response.CommentResponse;
import com.ewu.matching.dto.response.PostResponse;
import com.ewu.matching.enums.ReactionType;
import com.ewu.matching.service.FileStorageService;
import com.ewu.matching.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Tag(name = "Social Posts", description = "LinkedIn-style feed, reactions, comments, shares and saved posts")
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class PostController {

    private final PostService service;
    private final FileStorageService fileStorageService;

    @Operation(summary = "Create social post using JSON")
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PostResponse> create(@Valid @RequestBody PostCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @Operation(summary = "Create social post with media in one request")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponse> createWithMedia(
            @Valid @RequestPart("data") PostCreateRequest request,
            @RequestPart(value = "media", required = false) MultipartFile media) throws IOException {

        String mediaUrl = request.mediaUrl();
        String mediaType = request.mediaType();
        if (hasFile(media)) {
            mediaUrl = fileStorageService.savePostMedia(media);
            mediaType = media.getContentType();
        }

        PostCreateRequest merged = new PostCreateRequest(
                request.content(), mediaUrl, mediaType, request.visibility()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(merged));
    }

    @Operation(summary = "Update my social post using JSON")
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PostResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody PostUpdateRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @Operation(summary = "Update my social post and media in one request")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponse> updateWithMedia(
            @PathVariable Long id,
            @Valid @RequestPart("data") PostUpdateRequest request,
            @RequestPart(value = "media", required = false) MultipartFile media) throws IOException {

        String mediaUrl = request.mediaUrl();
        String mediaType = request.mediaType();
        if (hasFile(media)) {
            mediaUrl = fileStorageService.savePostMedia(media);
            mediaType = media.getContentType();
        }

        PostUpdateRequest merged = new PostUpdateRequest(
                request.content(), mediaUrl, mediaType, request.visibility()
        );
        return ResponseEntity.ok(service.update(id, merged));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/feed")
    public ResponseEntity<List<PostResponse>> feed() {
        return ResponseEntity.ok(service.feed());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<PostResponse>> mine() {
        return ResponseEntity.ok(service.mine());
    }

    @GetMapping("/search")
    public ResponseEntity<List<PostResponse>> search(@RequestParam String q) {
        return ResponseEntity.ok(service.search(q));
    }

    @GetMapping("/saved")
    public ResponseEntity<List<PostResponse>> saved() {
        return ResponseEntity.ok(service.saved());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}/reaction")
    public ResponseEntity<PostResponse> react(@PathVariable Long id,
                                              @Valid @RequestBody ReactionRequest request) {
        return ResponseEntity.ok(service.react(id, request));
    }

    @PutMapping("/{id}/like")
    public ResponseEntity<PostResponse> like(@PathVariable Long id) {
        return ResponseEntity.ok(service.react(id, new ReactionRequest(ReactionType.LIKE)));
    }

    @DeleteMapping("/{id}/reaction")
    public ResponseEntity<PostResponse> unreact(@PathVariable Long id) {
        return ResponseEntity.ok(service.removeReaction(id));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> comment(@PathVariable Long id,
                                                   @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.comment(id, request));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponse>> comments(@PathVariable Long id) {
        return ResponseEntity.ok(service.comments(id));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        service.deleteComment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<Void> share(@PathVariable Long id,
                                      @Valid @RequestBody SharePostRequest request) {
        service.share(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}/save")
    public ResponseEntity<Void> save(@PathVariable Long id) {
        service.save(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/save")
    public ResponseEntity<Void> unsave(@PathVariable Long id) {
        service.unsave(id);
        return ResponseEntity.noContent().build();
    }

    private boolean hasFile(MultipartFile file) {
        return file != null && !file.isEmpty();
    }
}
