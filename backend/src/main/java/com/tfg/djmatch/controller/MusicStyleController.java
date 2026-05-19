package com.tfg.djmatch.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tfg.djmatch.model.MusicStyle;
import com.tfg.djmatch.repository.MusicStyleRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class MusicStyleController {

    private static final Logger log = LoggerFactory.getLogger(MusicStyleController.class);

    private final MusicStyleRepository musicStyleRepository;

    public MusicStyleController(MusicStyleRepository musicStyleRepository) {
        this.musicStyleRepository = musicStyleRepository;
    }

    @GetMapping("/api/music-styles")
    public List<MusicStyle> listarEstilos() {
        List<MusicStyle> estilos = musicStyleRepository.findAll();
        log.info("Listado de estilos musicales. Total: {}", estilos.size());
        return estilos;
    }
}
