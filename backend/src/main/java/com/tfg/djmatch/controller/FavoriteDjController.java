package com.tfg.djmatch.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tfg.djmatch.model.DjProfile;
import com.tfg.djmatch.model.FavoriteDj;
import com.tfg.djmatch.repository.DjProfileRepository;
import com.tfg.djmatch.repository.FavoriteDjRepository;
import com.tfg.djmatch.repository.OrganizerProfileRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class FavoriteDjController {

    private static final Logger log = LoggerFactory.getLogger(FavoriteDjController.class);

    private final FavoriteDjRepository favoriteDjRepository;
    private final DjProfileRepository djProfileRepository;
    private final OrganizerProfileRepository organizerProfileRepository;

    public FavoriteDjController(
            FavoriteDjRepository favoriteDjRepository,
            DjProfileRepository djProfileRepository,
            OrganizerProfileRepository organizerProfileRepository) {
        this.favoriteDjRepository = favoriteDjRepository;
        this.djProfileRepository = djProfileRepository;
        this.organizerProfileRepository = organizerProfileRepository;
    }

    @GetMapping("/api/favorites/organizer/{organizerId}")
    public List<DjProfile> listarFavoritos(@PathVariable Integer organizerId) {
        List<FavoriteDj> favorites = favoriteDjRepository.findByOrganizerIdOrderByCreatedAtDesc(organizerId);
        List<DjProfile> djs = new ArrayList<>();

        for (FavoriteDj favorite : favorites) {
            djProfileRepository.findById(favorite.getDjProfileId()).ifPresent(profile -> {
                profile.setStyles(djProfileRepository.findStyleNamesByDjProfileId(profile.getId()));
                djs.add(profile);
            });
        }

        log.info("Favoritos cargados para organizador {}. Total: {}", organizerId, djs.size());
        return djs;
    }

    @PostMapping("/api/favorites")
    public ResponseEntity<?> guardarFavorito(@RequestBody FavoriteDj favorite) {
        if (favorite.getOrganizerId() == null || favorite.getDjProfileId() == null) {
            return ResponseEntity.badRequest().body("Faltan datos para guardar el DJ");
        }

        if (!organizerProfileRepository.existsById(favorite.getOrganizerId())
                || !djProfileRepository.existsById(favorite.getDjProfileId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se ha encontrado el perfil");
        }

        if (favoriteDjRepository.existsByOrganizerIdAndDjProfileId(
                favorite.getOrganizerId(),
                favorite.getDjProfileId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Este DJ ya esta guardado");
        }

        FavoriteDj savedFavorite = favoriteDjRepository.save(favorite);
        log.info("DJ guardado como favorito. Organizador: {}, DJ: {}",
                savedFavorite.getOrganizerId(), savedFavorite.getDjProfileId());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFavorite);
    }

    @DeleteMapping("/api/favorites/organizer/{organizerId}/dj/{djProfileId}")
    public ResponseEntity<?> eliminarFavorito(
            @PathVariable Integer organizerId,
            @PathVariable Integer djProfileId) {
        FavoriteDj favorite = favoriteDjRepository
                .findByOrganizerIdAndDjProfileId(organizerId, djProfileId)
                .orElse(null);

        if (favorite == null) {
            return ResponseEntity.notFound().build();
        }

        favoriteDjRepository.delete(favorite);
        log.info("DJ eliminado de favoritos. Organizador: {}, DJ: {}", organizerId, djProfileId);
        return ResponseEntity.noContent().build();
    }
}
