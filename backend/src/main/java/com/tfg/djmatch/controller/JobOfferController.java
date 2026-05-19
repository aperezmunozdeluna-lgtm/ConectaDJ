package com.tfg.djmatch.controller;

import java.math.BigDecimal;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tfg.djmatch.model.JobOffer;
import com.tfg.djmatch.repository.OrganizerProfileRepository;
import com.tfg.djmatch.repository.JobOfferRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class JobOfferController {

    private static final Logger log = LoggerFactory.getLogger(JobOfferController.class);

    private final JobOfferRepository jobOfferRepository;
    private final OrganizerProfileRepository organizerProfileRepository;

    public JobOfferController(
            JobOfferRepository jobOfferRepository,
            OrganizerProfileRepository organizerProfileRepository) {
        this.jobOfferRepository = jobOfferRepository;
        this.organizerProfileRepository = organizerProfileRepository;
    }

    @GetMapping("/api/offers")
    public List<JobOffer> listarOfertas(
            @RequestParam(required = false, defaultValue = "open") String status,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal minBudget,
            @RequestParam(required = false) Integer maxExperience,
            @RequestParam(required = false) Integer musicStyleId) {
        List<JobOffer> offers = jobOfferRepository.buscarOfertas(
                limpiarEstado(status),
                limpiarTexto(city),
                minBudget,
                maxExperience,
                musicStyleId);

        log.info("Listado de ofertas. Estado: {}, ciudad: {}, presupuesto minimo: {}, experiencia maxima: {}, estilo: {}, total: {}",
                status, city, minBudget, maxExperience, musicStyleId, offers.size());
        return offers;
    }

    @GetMapping("/api/offers/organizer/{organizerId}")
    public List<JobOffer> listarOfertasDelOrganizador(@PathVariable Integer organizerId) {
        List<JobOffer> offers = jobOfferRepository.findByOrganizerIdOrderByEventDateAsc(organizerId);
        log.info("Listado de ofertas del organizador {}. Total: {}", organizerId, offers.size());
        return offers;
    }

    @GetMapping("/api/offers/{id}")
    public ResponseEntity<JobOffer> obtenerOfertaPorId(@PathVariable Integer id) {
        log.info("Consulta de oferta con id {}", id);
        return jobOfferRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/api/offers")
    public ResponseEntity<?> crearOferta(@RequestBody JobOffer offer) {
        String validationError = validarOferta(offer, true);
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        if (offer.getStatus() == null || offer.getStatus().isBlank()) {
            offer.setStatus("open");
        }

        limpiarOferta(offer);
        JobOffer savedOffer = jobOfferRepository.save(offer);
        log.info("Oferta creada. Id: {}, organizador: {}", savedOffer.getId(), savedOffer.getOrganizerId());

        return ResponseEntity.status(HttpStatus.CREATED).body(savedOffer);
    }

    @PutMapping("/api/offers/{id}")
    public ResponseEntity<?> actualizarOferta(@PathVariable Integer id, @RequestBody JobOffer datos) {
        String validationError = validarOferta(datos, false);
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        return jobOfferRepository.findById(id)
                .map(offer -> {
                    limpiarOferta(datos);
                    offer.setTitle(datos.getTitle());
                    offer.setDescription(datos.getDescription());
                    offer.setEventDate(datos.getEventDate());
                    offer.setCity(datos.getCity());
                    offer.setMusicStyleId(datos.getMusicStyleId());
                    offer.setMinExperienceYears(datos.getMinExperienceYears());
                    offer.setBudget(datos.getBudget());
                    offer.setDurationHours(datos.getDurationHours());
                    offer.setImageUrl(datos.getImageUrl());

                    JobOffer savedOffer = jobOfferRepository.save(offer);
                    log.info("Oferta actualizada. Id: {}", savedOffer.getId());
                    return ResponseEntity.ok(savedOffer);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/api/offers/{id}/status")
    public ResponseEntity<?> cambiarEstadoOferta(@PathVariable Integer id, @RequestParam String status) {
        if (!status.equals("open") && !status.equals("closed") && !status.equals("cancelled")) {
            return ResponseEntity.badRequest().body("Estado de oferta no valido");
        }

        return jobOfferRepository.findById(id)
                .map(offer -> {
                    offer.setStatus(status);
                    JobOffer savedOffer = jobOfferRepository.save(offer);
                    log.info("Estado de oferta actualizado. Id: {}, estado: {}", savedOffer.getId(), status);
                    return ResponseEntity.ok(savedOffer);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private String limpiarTexto(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return null;
        }
        return texto.trim();
    }

    private String limpiarEstado(String status) {
        String cleanedStatus = limpiarTexto(status);

        if (cleanedStatus == null || "all".equals(cleanedStatus)) {
            return null;
        }

        return cleanedStatus;
    }

    private String validarOferta(JobOffer offer, boolean validateOrganizer) {
        if (offer == null) {
            return "Faltan los datos de la oferta";
        }

        if (validateOrganizer) {
            if (offer.getOrganizerId() == null) {
                return "La oferta necesita un organizador";
            }

            if (!organizerProfileRepository.existsById(offer.getOrganizerId())) {
                return "El organizador de la oferta no existe";
            }
        }

        if (limpiarTexto(offer.getTitle()) == null || limpiarTexto(offer.getTitle()).length() < 5) {
            return "El titulo debe tener al menos 5 caracteres";
        }

        if (limpiarTexto(offer.getCity()) == null) {
            return "La ciudad es obligatoria";
        }

        if (limpiarTexto(offer.getDescription()) == null || limpiarTexto(offer.getDescription()).length() < 20) {
            return "La descripcion debe tener al menos 20 caracteres";
        }

        if (offer.getMinExperienceYears() != null && offer.getMinExperienceYears() < 0) {
            return "La experiencia minima no puede ser negativa";
        }

        if (offer.getBudget() != null && offer.getBudget().compareTo(BigDecimal.ZERO) < 0) {
            return "El presupuesto no puede ser negativo";
        }

        if (offer.getDurationHours() != null && offer.getDurationHours().compareTo(BigDecimal.ZERO) < 0) {
            return "La duracion no puede ser negativa";
        }

        if (offer.getStatus() != null
                && !offer.getStatus().isBlank()
                && !offer.getStatus().equals("open")
                && !offer.getStatus().equals("closed")
                && !offer.getStatus().equals("cancelled")) {
            return "Estado de oferta no valido";
        }

        return null;
    }

    private void limpiarOferta(JobOffer offer) {
        offer.setTitle(limpiarTexto(offer.getTitle()));
        offer.setCity(limpiarTexto(offer.getCity()));
        offer.setDescription(limpiarTexto(offer.getDescription()));
        offer.setImageUrl(limpiarTexto(offer.getImageUrl()));

        if (offer.getMinExperienceYears() == null) {
            offer.setMinExperienceYears(0);
        }
    }
}
