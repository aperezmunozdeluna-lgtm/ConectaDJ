package com.tfg.djmatch.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tfg.djmatch.model.MusicStyle;

public interface MusicStyleRepository extends JpaRepository<MusicStyle, Integer> {
}
