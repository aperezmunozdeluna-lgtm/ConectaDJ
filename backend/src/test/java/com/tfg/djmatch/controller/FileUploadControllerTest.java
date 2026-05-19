package com.tfg.djmatch.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

class FileUploadControllerTest {

    private final FileUploadController fileUploadController = new FileUploadController();

    @Test
    void subirImagenRejectsUnsupportedExtension() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "imagen.gif",
                "image/gif",
                "contenido".getBytes(StandardCharsets.UTF_8));

        ResponseEntity<?> response = fileUploadController.subirImagen(file);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void subirImagenRejectsFakeImageContentType() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "imagen.png",
                "text/plain",
                "contenido".getBytes(StandardCharsets.UTF_8));

        ResponseEntity<?> response = fileUploadController.subirImagen(file);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
