package com.tfg.djmatch.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tfg.djmatch.model.FavoriteDj;

public interface FavoriteDjRepository extends JpaRepository<FavoriteDj, Integer> {

    List<FavoriteDj> findByOrganizerIdOrderByCreatedAtDesc(Integer organizerId);

    boolean existsByOrganizerIdAndDjProfileId(Integer organizerId, Integer djProfileId);

    Optional<FavoriteDj> findByOrganizerIdAndDjProfileId(Integer organizerId, Integer djProfileId);
}
