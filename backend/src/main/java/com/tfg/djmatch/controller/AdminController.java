package com.tfg.djmatch.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.tfg.djmatch.dto.UserSummary;
import com.tfg.djmatch.model.DjProfile;
import com.tfg.djmatch.model.JobOffer;
import com.tfg.djmatch.model.OrganizerProfile;
import com.tfg.djmatch.model.User;
import com.tfg.djmatch.repository.ConversationRepository;
import com.tfg.djmatch.repository.DjProfileRepository;
import com.tfg.djmatch.repository.JobApplicationRepository;
import com.tfg.djmatch.repository.JobOfferRepository;
import com.tfg.djmatch.repository.OrganizerProfileRepository;
import com.tfg.djmatch.repository.UserRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    private final UserRepository userRepository;
    private final DjProfileRepository djProfileRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final JobOfferRepository jobOfferRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final ConversationRepository conversationRepository;

    public AdminController(
            UserRepository userRepository,
            DjProfileRepository djProfileRepository,
            OrganizerProfileRepository organizerProfileRepository,
            JobOfferRepository jobOfferRepository,
            JobApplicationRepository jobApplicationRepository,
            ConversationRepository conversationRepository) {
        this.userRepository = userRepository;
        this.djProfileRepository = djProfileRepository;
        this.organizerProfileRepository = organizerProfileRepository;
        this.jobOfferRepository = jobOfferRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.conversationRepository = conversationRepository;
    }

    @GetMapping("/api/admin/summary")
    public ResponseEntity<?> resumen(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        if (!isAdminRequest(userEmail)) {
            return forbiddenAdmin();
        }

        Map<String, Long> summary = new HashMap<>();
        summary.put("users", userRepository.count());
        summary.put("djs", djProfileRepository.count());
        summary.put("organizers", organizerProfileRepository.count());
        summary.put("offers", jobOfferRepository.count());
        summary.put("applications", jobApplicationRepository.count());
        summary.put("conversations", conversationRepository.count());

        log.info("Resumen de administracion cargado");
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/api/admin/users")
    public ResponseEntity<?> listarUsuariosAdmin(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        if (!isAdminRequest(userEmail)) {
            return forbiddenAdmin();
        }

        List<UserSummary> users = userRepository.findAllByOrderByEmailAsc()
                .stream()
                .map(this::toUserSummary)
                .toList();

        log.info("Usuarios cargados para administracion. Total: {}", users.size());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/api/admin/offers")
    public ResponseEntity<?> listarOfertasAdmin(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        if (!isAdminRequest(userEmail)) {
            return forbiddenAdmin();
        }

        List<JobOffer> offers = jobOfferRepository.findAllByOrderByEventDateAsc();
        log.info("Ofertas cargadas para administracion. Total: {}", offers.size());
        return ResponseEntity.ok(offers);
    }

    @PatchMapping("/api/admin/users/{id}/active")
    public ResponseEntity<?> cambiarEstadoUsuario(
            @PathVariable Integer id,
            @RequestParam Boolean active,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        User adminUser = getAdminUser(userEmail);
        if (adminUser == null) {
            return forbiddenAdmin();
        }

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (adminUser.getId().equals(user.getId()) && Boolean.FALSE.equals(active)) {
            return ResponseEntity.badRequest().body("No puedes desactivar tu propia cuenta de admin");
        }

        user.setActive(active);
        User savedUser = userRepository.save(user);
        log.info("Estado de usuario actualizado. Id: {}, activo: {}", id, active);
        return ResponseEntity.ok(toUserSummary(savedUser));
    }

    @PatchMapping("/api/admin/offers/{id}/status")
    public ResponseEntity<?> cambiarEstadoOferta(
            @PathVariable Integer id,
            @RequestParam String status,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        if (!isAdminRequest(userEmail)) {
            return forbiddenAdmin();
        }

        if (!status.equals("open") && !status.equals("closed") && !status.equals("cancelled")) {
            return ResponseEntity.badRequest().build();
        }

        JobOffer offer = jobOfferRepository.findById(id).orElse(null);
        if (offer == null) {
            return ResponseEntity.notFound().build();
        }

        offer.setStatus(status);
        JobOffer savedOffer = jobOfferRepository.save(offer);
        log.info("Estado de oferta actualizado. Id: {}, estado: {}", id, status);
        return ResponseEntity.ok(savedOffer);
    }

    private UserSummary toUserSummary(User user) {
        String displayName = user.getEmail();
        Integer profileId = null;
        String photoUrl = null;

        if ("dj".equals(user.getRole())) {
            DjProfile profile = djProfileRepository.findByUserId(user.getId()).orElse(null);
            if (profile != null) {
                displayName = profile.getArtistName();
                profileId = profile.getId();
                photoUrl = profile.getProfilePhoto();
            }
        }

        if (isOrganizerRole(user.getRole())) {
            OrganizerProfile profile = organizerProfileRepository.findByUserId(user.getId()).orElse(null);
            if (profile != null) {
                displayName = profile.getVenueName();
                profileId = profile.getId();
                photoUrl = profile.getLogoPhoto();
            }
        }

        return new UserSummary(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                displayName,
                profileId,
                photoUrl,
                user.getActive());
    }

    private boolean isOrganizerRole(String role) {
        return "organizer".equals(role) || "private_party".equals(role);
    }

    private boolean isAdminRequest(String userEmail) {
        return getAdminUser(userEmail) != null;
    }

    private User getAdminUser(String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            return null;
        }

        User user = userRepository.findByEmail(userEmail.trim().toLowerCase()).orElse(null);
        if (user == null) {
            return null;
        }

        if (!"admin".equals(user.getRole())) {
            return null;
        }

        if (Boolean.FALSE.equals(user.getActive())) {
            return null;
        }

        return user;
    }

    private ResponseEntity<String> forbiddenAdmin() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permisos de administrador");
    }
}
