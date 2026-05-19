package com.tfg.djmatch.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.tfg.djmatch.model.JobOffer;
import com.tfg.djmatch.repository.JobOfferRepository;
import com.tfg.djmatch.repository.OrganizerProfileRepository;

@ExtendWith(MockitoExtension.class)
class JobOfferControllerTest {

    @Mock
    private JobOfferRepository jobOfferRepository;

    @Mock
    private OrganizerProfileRepository organizerProfileRepository;

    @InjectMocks
    private JobOfferController jobOfferController;

    @Test
    void crearOfertaRejectsMissingOrganizer() {
        JobOffer offer = new JobOffer();
        offer.setTitle("Fiesta privada");
        offer.setCity("Madrid");
        offer.setDescription("Evento privado con musica electronica");

        ResponseEntity<?> response = jobOfferController.crearOferta(offer);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(jobOfferRepository, never()).save(any(JobOffer.class));
    }

    @Test
    void crearOfertaTrimsTextAndSetsDefaultStatus() {
        JobOffer offer = new JobOffer();
        offer.setOrganizerId(1);
        offer.setTitle("  Fiesta privada  ");
        offer.setCity("  Madrid  ");
        offer.setDescription("  Evento privado con musica electronica para una empresa  ");
        offer.setBudget(BigDecimal.valueOf(300));

        when(organizerProfileRepository.existsById(1)).thenReturn(true);
        when(jobOfferRepository.save(any(JobOffer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<?> response = jobOfferController.crearOferta(offer);
        JobOffer savedOffer = (JobOffer) response.getBody();

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Fiesta privada", savedOffer.getTitle());
        assertEquals("Madrid", savedOffer.getCity());
        assertEquals("Evento privado con musica electronica para una empresa", savedOffer.getDescription());
        assertEquals("open", savedOffer.getStatus());
        assertEquals(0, savedOffer.getMinExperienceYears());
    }
}
