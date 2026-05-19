package com.tfg.djmatch.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tfg.djmatch.model.OrganizerProfile;
import com.tfg.djmatch.repository.OrganizerProfileRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class OrganizerProfileController {

    private static final Logger log = LoggerFactory.getLogger(OrganizerProfileController.class);

    private final OrganizerProfileRepository organizerProfileRepository;

    public OrganizerProfileController(OrganizerProfileRepository organizerProfileRepository) {
        this.organizerProfileRepository = organizerProfileRepository;
    }

    @GetMapping("/api/organizers/{id}")
    public ResponseEntity<OrganizerProfile> obtenerOrganizadorPorId(@PathVariable Integer id) {
        log.info("Consulta de organizador con id {}", id);
        return organizerProfileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/api/organizers/{id}")
    public ResponseEntity<OrganizerProfile> actualizarOrganizador(
            @PathVariable Integer id,
            @RequestBody OrganizerProfile datos) {
        return organizerProfileRepository.findById(id)
                .map(profile -> {
                    profile.setVenueName(datos.getVenueName());
                    profile.setDescription(datos.getDescription());
                    profile.setCity(datos.getCity());
                    profile.setProvince(datos.getProvince());
                    profile.setVenueType(datos.getVenueType());
                    profile.setWebsiteUrl(datos.getWebsiteUrl());
                    profile.setLogoPhoto(datos.getLogoPhoto());

                    OrganizerProfile savedProfile = organizerProfileRepository.save(profile);
                    log.info("Perfil de organizador actualizado. Id: {}", savedProfile.getId());
                    return ResponseEntity.ok(savedProfile);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
