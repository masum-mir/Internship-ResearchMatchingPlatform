package com.ewu.matching.controller;

import com.ewu.matching.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ImageUploadController {

    private final FileStorageService fileStorageService;

    @PostMapping("/profile")
    public ResponseEntity<?> uploadProfileImage(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        String filename = fileStorageService.saveProfileImage(file);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Profile uploaded successfully");
        response.put("filename", filename);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/cover")
    public ResponseEntity<?> uploadCoverImage(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        String filename = fileStorageService.saveCoverImage(file);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Cover uploaded successfully");
        response.put("filename", filename);

        return ResponseEntity.ok(response);
    }

}