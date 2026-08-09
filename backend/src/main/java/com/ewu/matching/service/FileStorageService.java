package com.ewu.matching.service;

import com.ewu.matching.exception.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final String ROOT = "uploads";

    private static final long MAX_IMAGE = 8L * 1024 * 1024;
    private static final long MAX_POST_MEDIA = 25L * 1024 * 1024;
    private static final long MAX_DOCUMENT = 15L * 1024 * 1024;

    private static final Set<String> IMAGE_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif");

    private static final Set<String> POST_MEDIA_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif",
            "video/mp4", "video/webm", "video/quicktime");

    private static final Set<String> DOCUMENT_TYPES = Set.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    private static final Set<String> MESSAGE_ATTACHMENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif",
            "application/pdf", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain");

    public String saveProfileImage(MultipartFile file) throws IOException {
        validate(file, MAX_IMAGE, IMAGE_TYPES, "Unsupported profile image type");
        return save(file, "profile");
    }

    public String saveCoverImage(MultipartFile file) throws IOException {
        validate(file, MAX_IMAGE, IMAGE_TYPES, "Unsupported cover image type");
        return save(file, "cover");
    }

    public String savePostMedia(MultipartFile file) throws IOException {
        validate(file, MAX_POST_MEDIA, POST_MEDIA_TYPES, "Unsupported post media type");
        return save(file, "posts");
    }

    public String saveResume(MultipartFile file) throws IOException {
        validate(file, MAX_DOCUMENT, DOCUMENT_TYPES, "Only PDF/DOC/DOCX resumes are allowed");
        return save(file, "resumes");
    }

    public String saveMessageAttachment(MultipartFile file) throws IOException {
        validate(file, MAX_DOCUMENT, MESSAGE_ATTACHMENT_TYPES, "Unsupported message attachment type");
        return save(file, "messages");
    }

    private String save(MultipartFile file, String folder) throws IOException {
        String original = file.getOriginalFilename() == null
                ? "file"
                : Paths.get(file.getOriginalFilename()).getFileName().toString();

        String safeName = original.replaceAll("[^a-zA-Z0-9._-]", "_");
        String fileName = UUID.randomUUID() + "_" + safeName;

        Path directory = Paths.get(ROOT, folder).toAbsolutePath().normalize();
        Files.createDirectories(directory);

        Path target = directory.resolve(fileName).normalize();
        if (!target.startsWith(directory)) {
            throw new BadRequestException("Invalid file path");
        }

        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        // Entity stores a relative path. Browser URL = /uploads/{returned-path}
        return folder + "/" + fileName;
    }

    private void validate(MultipartFile file, long maxBytes, Set<String> allowedTypes, String typeError) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
        if (file.getSize() > maxBytes) {
            throw new BadRequestException("File is too large");
        }
        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new BadRequestException(typeError);
        }
    }
}
