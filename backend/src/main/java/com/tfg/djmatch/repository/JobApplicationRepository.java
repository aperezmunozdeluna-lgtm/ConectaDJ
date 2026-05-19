package com.tfg.djmatch.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tfg.djmatch.model.JobApplication;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Integer> {

    boolean existsByJobOfferIdAndDjProfileId(Integer jobOfferId, Integer djProfileId);

    Optional<JobApplication> findByJobOfferIdAndDjProfileId(Integer jobOfferId, Integer djProfileId);

    List<JobApplication> findByDjProfileIdOrderByCreatedAtDesc(Integer djProfileId);

    @Query("""
            SELECT a FROM JobApplication a
            WHERE a.jobOfferId IN (
                SELECT o.id FROM JobOffer o WHERE o.organizerId = :organizerId
            )
            ORDER BY a.createdAt DESC
            """)
    List<JobApplication> findByOrganizerId(@Param("organizerId") Integer organizerId);
}
