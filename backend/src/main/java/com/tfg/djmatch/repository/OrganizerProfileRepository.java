package com.tfg.djmatch.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tfg.djmatch.model.OrganizerProfile;

public interface OrganizerProfileRepository extends JpaRepository<OrganizerProfile, Integer> {

    Optional<OrganizerProfile> findByUserId(Integer userId);
}
