package com.ewu.matching.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String PROFILE_DIR = "uploads/profile/";
    private final String COVER_DIR = "uploads/cover/";

    public String saveProfileImage(MultipartFile file) throws IOException {

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path path = Paths.get(PROFILE_DIR);

        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        Files.copy(file.getInputStream(),
                path.resolve(fileName),
                StandardCopyOption.REPLACE_EXISTING);

        return "profile/" + fileName;
    }

    public String saveCoverImage(MultipartFile file) throws IOException {

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path path = Paths.get(COVER_DIR);

        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        Files.copy(file.getInputStream(),
                path.resolve(fileName),
                StandardCopyOption.REPLACE_EXISTING);

        return "cover/" + fileName;
    }
}