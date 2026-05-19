package com.tfg.djmatch.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class FileUploadController {

    private static final Logger log = LoggerFactory.getLogger(FileUploadController.class);
    private static final Path UPLOAD_DIR = Path.of("uploads", "images");
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp");
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            ".jpg",
            ".jpeg",
            ".png",
            ".webp");

    @GetMapping(value = { "/uploads/images", "/uploads/images/" }, produces = MediaType.TEXT_PLAIN_VALUE)
    public String informacionUploads() {
        return "Las imagenes se abren con la URL completa, por ejemplo: "
                + "http://localhost:8080/uploads/images/nombre-del-archivo.jpg";
    }

    @PostMapping("/api/uploads/images")
    public ResponseEntity<?> subirImagen(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No se ha enviado ningun archivo");
        }

        String contentType = file.getContentType();
        String extension = obtenerExtension(file.getOriginalFilename());

        if (!esImagenPermitida(contentType, extension)) {
            return ResponseEntity.badRequest()
                    .body("El archivo debe ser una imagen JPG, PNG o WEBP");
        }

        try {
            Files.createDirectories(UPLOAD_DIR);

            String fileName = UUID.randomUUID() + extension;
            Path targetPath = UPLOAD_DIR.resolve(fileName);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String url = "http://localhost:8080/uploads/images/" + fileName;
            log.info("Imagen subida correctamente: {}", fileName);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("url", url));
        } catch (IOException exception) {
            log.error("Error subiendo imagen", exception);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("No se ha podido guardar la imagen");
        }
    }

    private String obtenerExtension(String originalName) {
        if (originalName == null || !originalName.contains(".")) {
            return ".jpg";
        }

        return originalName.substring(originalName.lastIndexOf(".")).toLowerCase(Locale.ROOT);
    }

    private boolean esImagenPermitida(String contentType, String extension) {
        if (contentType == null || extension == null) {
            return false;
        }

        return ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))
                && ALLOWED_EXTENSIONS.contains(extension);
    }
}
