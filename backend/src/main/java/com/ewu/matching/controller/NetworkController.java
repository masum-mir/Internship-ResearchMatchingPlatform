package com.ewu.matching.controller;
import com.ewu.matching.dto.request.*;import com.ewu.matching.dto.response.*;import com.ewu.matching.service.NetworkService;import io.swagger.v3.oas.annotations.tags.Tag;import jakarta.validation.Valid;import lombok.RequiredArgsConstructor;import org.springframework.http.*;import org.springframework.security.access.prepost.PreAuthorize;import org.springframework.web.bind.annotation.*;import java.util.List;
@Tag(name="Network",description="Connections, followers, following and blocking") @RestController @RequestMapping("/api/network") @RequiredArgsConstructor @PreAuthorize("isAuthenticated()")
public class NetworkController {private final NetworkService service;
 @PostMapping("/connections") public ResponseEntity<ConnectionResponse> connect(@Valid @RequestBody ConnectionRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.requestConnection(r.userId()));}
 @PutMapping("/connections/{id}/accept") public ResponseEntity<ConnectionResponse> accept(@PathVariable Long id){return ResponseEntity.ok(service.accept(id));}
 @PutMapping("/connections/{id}/reject") public ResponseEntity<ConnectionResponse> reject(@PathVariable Long id){return ResponseEntity.ok(service.reject(id));}
 @DeleteMapping("/connections/{id}") public ResponseEntity<Void> remove(@PathVariable Long id){service.removeConnection(id);return ResponseEntity.noContent().build();}
 @GetMapping("/connections") public ResponseEntity<List<ConnectionResponse>> connections(){return ResponseEntity.ok(service.connections());}
 @GetMapping("/connections/pending") public ResponseEntity<List<ConnectionResponse>> pending(){return ResponseEntity.ok(service.pendingReceived());}
 @GetMapping("/connections/pending-sent") public ResponseEntity<List<ConnectionResponse>> pendingSent(){return ResponseEntity.ok(service.pendingSent());}
 @PutMapping("/block/{userId}") public ResponseEntity<Void> block(@PathVariable Long userId){service.block(userId);return ResponseEntity.noContent().build();}
 @DeleteMapping("/block/{userId}") public ResponseEntity<Void> unblock(@PathVariable Long userId){service.unblock(userId);return ResponseEntity.noContent().build();}
 @PostMapping("/follow") public ResponseEntity<FollowResponse> follow(@Valid @RequestBody FollowRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.follow(r.userId()));}
 @DeleteMapping("/follow/{userId}") public ResponseEntity<Void> unfollow(@PathVariable Long userId){service.unfollow(userId);return ResponseEntity.noContent().build();}
 @GetMapping("/followers") public ResponseEntity<List<FollowResponse>> followers(){return ResponseEntity.ok(service.followers());}
 @GetMapping("/following") public ResponseEntity<List<FollowResponse>> following(){return ResponseEntity.ok(service.following());}
}
