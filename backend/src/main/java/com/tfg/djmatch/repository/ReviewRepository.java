package com.tfg.djmatch.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tfg.djmatch.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    List<Review> findByDjProfileIdOrderByCreatedAtDesc(Integer djProfileId);

    boolean existsByDjProfileIdAndOrganizerId(Integer djProfileId, Integer organizerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.djProfileId = :djProfileId")
    Double calcularMediaDj(@Param("djProfileId") Integer djProfileId);
}
