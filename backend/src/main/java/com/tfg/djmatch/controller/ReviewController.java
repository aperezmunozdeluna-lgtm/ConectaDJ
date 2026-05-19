package com.tfg.djmatch.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tfg.djmatch.model.DjProfile;
import com.tfg.djmatch.model.OrganizerProfile;
import com.tfg.djmatch.model.Review;
import com.tfg.djmatch.repository.DjProfileRepository;
import com.tfg.djmatch.repository.OrganizerProfileRepository;
import com.tfg.djmatch.repository.ReviewRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private static final Logger log = LoggerFactory.getLogger(ReviewController.class);

    private final ReviewRepository reviewRepository;
    private final DjProfileRepository djProfileRepository;
    private final OrganizerProfileRepository organizerProfileRepository;

    public ReviewController(
            ReviewRepository reviewRepository,
            DjProfileRepository djProfileRepository,
            OrganizerProfileRepository organizerProfileRepository) {
        this.reviewRepository = reviewRepository;
        this.djProfileRepository = djProfileRepository;
        this.organizerProfileRepository = organizerProfileRepository;
    }

    @GetMapping("/api/djs/{djProfileId}/reviews")
    public List<Review> listarReviewsDj(@PathVariable Integer djProfileId) {
        List<Review> reviews = reviewRepository.findByDjProfileIdOrderByCreatedAtDesc(djProfileId);
        reviews.forEach(this::cargarNombreOrganizador);

        log.info("Opiniones cargadas para DJ {}. Total: {}", djProfileId, reviews.size());
        return reviews;
    }

    @PostMapping("/api/reviews")
    public ResponseEntity<?> crearReview(@RequestBody Review review) {
        if (review.getDjProfileId() == null || review.getOrganizerId() == null) {
            return ResponseEntity.badRequest().body("Faltan datos para guardar la opinion");
        }

        if (review.getRating() == null || review.getRating() < 1 || review.getRating() > 5) {
            return ResponseEntity.badRequest().body("La valoracion debe estar entre 1 y 5");
        }

        DjProfile djProfile = djProfileRepository.findById(review.getDjProfileId()).orElse(null);
        OrganizerProfile organizerProfile = organizerProfileRepository.findById(review.getOrganizerId()).orElse(null);

        if (djProfile == null || organizerProfile == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se ha encontrado el DJ o el organizador");
        }

        if (reviewRepository.existsByDjProfileIdAndOrganizerId(review.getDjProfileId(), review.getOrganizerId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya has valorado a este DJ");
        }

        Review savedReview = reviewRepository.save(review);
        actualizarMediaDj(djProfile);
        cargarNombreOrganizador(savedReview);

        log.info("Opinion creada. DJ: {}, organizador: {}, valoracion: {}",
                review.getDjProfileId(), review.getOrganizerId(), review.getRating());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    private void actualizarMediaDj(DjProfile djProfile) {
        Double media = reviewRepository.calcularMediaDj(djProfile.getId());
        djProfile.setAvgRating(media != null ? Math.round(media * 10.0) / 10.0 : 0.0);
        djProfileRepository.save(djProfile);
    }

    private void cargarNombreOrganizador(Review review) {
        organizerProfileRepository.findById(review.getOrganizerId())
                .ifPresent(profile -> review.setOrganizerName(profile.getVenueName()));
    }
}
