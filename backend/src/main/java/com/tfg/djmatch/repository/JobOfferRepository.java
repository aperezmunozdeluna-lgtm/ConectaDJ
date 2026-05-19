package com.tfg.djmatch.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tfg.djmatch.model.JobOffer;

public interface JobOfferRepository extends JpaRepository<JobOffer, Integer> {

    List<JobOffer> findByStatusOrderByEventDateAsc(String status);

    List<JobOffer> findAllByOrderByEventDateAsc();

    List<JobOffer> findByOrganizerIdOrderByEventDateAsc(Integer organizerId);

    @Query("""
            SELECT o FROM JobOffer o
            WHERE (:status IS NULL OR o.status = :status)
            AND (:city IS NULL OR LOWER(o.city) LIKE LOWER(CONCAT('%', :city, '%')))
            AND (:minBudget IS NULL OR o.budget >= :minBudget)
            AND (:maxExperience IS NULL OR o.minExperienceYears <= :maxExperience)
            AND (:musicStyleId IS NULL OR o.musicStyleId = :musicStyleId)
            ORDER BY o.eventDate ASC
            """)
    List<JobOffer> buscarOfertas(
            @Param("status") String status,
            @Param("city") String city,
            @Param("minBudget") BigDecimal minBudget,
            @Param("maxExperience") Integer maxExperience,
            @Param("musicStyleId") Integer musicStyleId);
}
