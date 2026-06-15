package com.tfg.djmatch.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tfg.djmatch.model.JobApplication;
import com.tfg.djmatch.model.JobOffer;
import com.tfg.djmatch.repository.DjProfileRepository;
import com.tfg.djmatch.repository.JobApplicationRepository;
import com.tfg.djmatch.repository.JobOfferRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class JobApplicationController {

    private static final Logger log = LoggerFactory.getLogger(JobApplicationController.class);

    private final JobApplicationRepository jobApplicationRepository;
    private final JobOfferRepository jobOfferRepository;
    private final DjProfileRepository djProfileRepository;

    public JobApplicationController(
            JobApplicationRepository jobApplicationRepository,
            JobOfferRepository jobOfferRepository,
            DjProfileRepository djProfileRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobOfferRepository = jobOfferRepository;
        this.djProfileRepository = djProfileRepository;
    }

    @PostMapping("/api/applications")
    public ResponseEntity<?> crearCandidatura(@RequestBody JobApplication application) {
        if (application.getJobOfferId() == null || application.getDjProfileId() == null) {
            return ResponseEntity.badRequest().body("Faltan datos de la candidatura");
        }

        JobOffer offer = jobOfferRepository.findById(application.getJobOfferId()).orElse(null);
        if (offer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La oferta no existe");
        }

        if (!"open".equals(offer.getStatus())) {
            return ResponseEntity.badRequest().body("Esta oferta no acepta candidaturas ahora mismo");
        }

        if (!djProfileRepository.existsById(application.getDjProfileId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El perfil de DJ no existe");
        }

        if (application.getMessage() != null) {
            application.setMessage(application.getMessage().trim());
        }

        JobApplication existingApplication = jobApplicationRepository.findByJobOfferIdAndDjProfileId(
                application.getJobOfferId(),
                application.getDjProfileId()).orElse(null);

        if (existingApplication != null && "withdrawn".equals(existingApplication.getStatus())) {
            existingApplication.setStatus("pending");
            existingApplication.setMessage(application.getMessage());
            JobApplication savedApplication = jobApplicationRepository.save(existingApplication);
            log.info("Candidatura reactivada. Oferta: {}, DJ: {}",
                    application.getJobOfferId(), application.getDjProfileId());
            return ResponseEntity.ok(savedApplication);
        }

        if (existingApplication != null) {
            log.info("Candidatura duplicada. Oferta: {}, DJ: {}",
                    application.getJobOfferId(), application.getDjProfileId());
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya estás inscrito en esta oferta");
        }

        application.setStatus("pending");
        JobApplication savedApplication = jobApplicationRepository.save(application);
        log.info("Candidatura creada. Id: {}, oferta: {}, DJ: {}",
                savedApplication.getId(), savedApplication.getJobOfferId(), savedApplication.getDjProfileId());

        return ResponseEntity.status(HttpStatus.CREATED).body(savedApplication);
    }

    @GetMapping("/api/applications/dj/{djProfileId}")
    public List<JobApplication> listarCandidaturasDelDj(@PathVariable Integer djProfileId) {
        List<JobApplication> applications = jobApplicationRepository.findByDjProfileIdOrderByCreatedAtDesc(djProfileId);
        log.info("Listado de candidaturas del DJ {}. Total: {}", djProfileId, applications.size());
        return applications;
    }

    @GetMapping("/api/applications/organizer/{organizerId}")
    public List<JobApplication> listarCandidaturasDelOrganizador(@PathVariable Integer organizerId) {
        List<JobApplication> applications = jobApplicationRepository.findByOrganizerId(organizerId);
        log.info("Listado de candidaturas del organizador {}. Total: {}", organizerId, applications.size());
        return applications;
    }

    @PatchMapping("/api/applications/{id}/status")
    public ResponseEntity<JobApplication> actualizarEstadoCandidatura(
            @PathVariable Integer id,
            @RequestParam String status) {
        if (!status.equals("accepted")
                && !status.equals("rejected")
                && !status.equals("pending")
                && !status.equals("withdrawn")) {
            return ResponseEntity.badRequest().build();
        }

        return jobApplicationRepository.findById(id)
                .map(application -> {
                    if (!puedeCambiarEstado(application, status)) {
                        return ResponseEntity.badRequest().<JobApplication>build();
                    }

                    application.setStatus(status);
                    JobApplication savedApplication = jobApplicationRepository.save(application);
                    log.info("Estado de candidatura actualizado. Id: {}, estado: {}", id, status);
                    return ResponseEntity.ok(savedApplication);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private boolean puedeCambiarEstado(JobApplication application, String nextStatus) {
        String currentStatus = application.getStatus();

        if ("withdrawn".equals(currentStatus)) {
            return false;
        }

        if ("withdrawn".equals(nextStatus)) {
            return "pending".equals(currentStatus);
        }

        if ("accepted".equals(nextStatus) || "rejected".equals(nextStatus)) {
            return "pending".equals(currentStatus);
        }

        if ("pending".equals(nextStatus)) {
            return "accepted".equals(currentStatus) || "rejected".equals(currentStatus);
        }

        return false;
    }
}
