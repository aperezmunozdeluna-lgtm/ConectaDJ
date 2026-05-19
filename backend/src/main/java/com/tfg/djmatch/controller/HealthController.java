package com.tfg.djmatch.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    private static final Logger log = LoggerFactory.getLogger(HealthController.class);

    @GetMapping("/api/health")
    public String comprobarBackend() {
        log.info("Comprobacion de estado del backend");
        return "Backend funcionando";
    }
}
