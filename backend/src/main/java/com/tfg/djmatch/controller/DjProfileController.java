package com.tfg.djmatch.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tfg.djmatch.model.DjProfile;
import com.tfg.djmatch.repository.DjProfileRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class DjProfileController {

    private static final Logger log = LoggerFactory.getLogger(DjProfileController.class);

    private final DjProfileRepository djProfileRepository;

    public DjProfileController(DjProfileRepository djProfileRepository) {
        this.djProfileRepository = djProfileRepository;
    }

    @GetMapping("/api/djs")
    public List<DjProfile> listarDjs(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) String styleSlug) {
        List<DjProfile> djs = djProfileRepository.buscarDjs(
                limpiarTexto(city),
                minExperience,
                available,
                limpiarTexto(styleSlug));
        djs.forEach(this::cargarEstilos);

        log.info("Busqueda de DJs. Ciudad: {}, experiencia minima: {}, disponible: {}, estilo: {}, total: {}",
                city, minExperience, available, styleSlug, djs.size());
        return djs;
    }

    @GetMapping("/api/djs/{id}")
    public ResponseEntity<DjProfile> obtenerDjPorId(@PathVariable Integer id) {
        log.info("Consulta de perfil DJ con id {}", id);
        return djProfileRepository.findById(id)
                .map(profile -> {
                    cargarEstilos(profile);
                    return profile;
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/api/djs/{id}")
    public ResponseEntity<DjProfile> actualizarDj(@PathVariable Integer id, @RequestBody DjProfile datos) {
        return djProfileRepository.findById(id)
                .map(profile -> {
                    profile.setArtistName(datos.getArtistName());
                    profile.setBio(datos.getBio());
                    profile.setCity(datos.getCity());
                    profile.setProvince(datos.getProvince());
                    profile.setExperienceYears(datos.getExperienceYears());
                    profile.setFeePerSession(datos.getFeePerSession());
                    profile.setInstagramUrl(datos.getInstagramUrl());
                    profile.setSoundcloudUrl(datos.getSoundcloudUrl());
                    profile.setMixcloudUrl(datos.getMixcloudUrl());
                    profile.setProfilePhoto(datos.getProfilePhoto());
                    profile.setAvailable(datos.getAvailable());

                    DjProfile savedProfile = djProfileRepository.save(profile);
                    log.info("Perfil DJ actualizado. Id: {}", savedProfile.getId());
                    return ResponseEntity.ok(savedProfile);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private String limpiarTexto(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return null;
        }
        return texto.trim();
    }

    private void cargarEstilos(DjProfile profile) {
        profile.setStyles(djProfileRepository.findStyleNamesByDjProfileId(profile.getId()));
    }
}
