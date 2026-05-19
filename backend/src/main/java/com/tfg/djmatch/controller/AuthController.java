package com.tfg.djmatch.controller;

import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tfg.djmatch.dto.AuthResponse;
import com.tfg.djmatch.dto.LoginRequest;
import com.tfg.djmatch.dto.RegisterRequest;
import com.tfg.djmatch.model.DjProfile;
import com.tfg.djmatch.model.OrganizerProfile;
import com.tfg.djmatch.model.User;
import com.tfg.djmatch.repository.DjProfileRepository;
import com.tfg.djmatch.repository.OrganizerProfileRepository;
import com.tfg.djmatch.repository.UserRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private static final int MIN_PASSWORD_LENGTH = 4;

    private final UserRepository userRepository;
    private final DjProfileRepository djProfileRepository;
    private final OrganizerProfileRepository organizerProfileRepository;

    public AuthController(
            UserRepository userRepository,
            DjProfileRepository djProfileRepository,
            OrganizerProfileRepository organizerProfileRepository) {
        this.userRepository = userRepository;
        this.djProfileRepository = djProfileRepository;
        this.organizerProfileRepository = organizerProfileRepository;
    }

    @PostMapping("/api/auth/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String validationError = validarRegistro(request);
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        String email = normalizarEmail(request.getEmail());
        String role = normalizarRole(request.getRole());
        String name = limpiarTexto(request.getName());

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El email ya esta registrado");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(request.getPassword());
        user.setRole(role);
        user.setActive(true);

        User savedUser = userRepository.save(user);
        log.info("Usuario registrado. Id: {}, rol: {}", savedUser.getId(), savedUser.getRole());

        if (isOrganizerRole(savedUser.getRole())) {
            OrganizerProfile profile = createOrganizerProfile(savedUser, name);
            return ResponseEntity.status(HttpStatus.CREATED).body(toAuthResponse(savedUser, null, profile));
        }

        DjProfile profile = createDjProfile(savedUser, name);
        return ResponseEntity.status(HttpStatus.CREATED).body(toAuthResponse(savedUser, profile, null));
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String validationError = validarLogin(request);
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        String email = normalizarEmail(request.getEmail());

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null || !user.getPasswordHash().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email o contrasena incorrectos");
        }

        if (Boolean.FALSE.equals(user.getActive())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Esta cuenta esta desactivada");
        }

        DjProfile djProfile = djProfileRepository.findByUserId(user.getId()).orElse(null);
        OrganizerProfile organizerProfile = organizerProfileRepository.findByUserId(user.getId()).orElse(null);
        log.info("Inicio de sesion correcto. Usuario: {}", user.getEmail());

        return ResponseEntity.ok(toAuthResponse(user, djProfile, organizerProfile));
    }

    private DjProfile createDjProfile(User user, String name) {
        DjProfile profile = new DjProfile();
        profile.setUserId(user.getId());
        profile.setArtistName(name);
        profile.setCity("Sin definir");
        profile.setProvince("Sin definir");
        profile.setExperienceYears(0);
        profile.setAvgRating(0.0);
        profile.setAvailable(true);
        return djProfileRepository.save(profile);
    }

    private OrganizerProfile createOrganizerProfile(User user, String name) {
        OrganizerProfile profile = new OrganizerProfile();
        profile.setUserId(user.getId());
        profile.setVenueName(name);
        profile.setDescription(
                "private_party".equals(user.getRole())
                        ? "Perfil de fiesta privada creado desde el registro."
                        : "Perfil creado desde el registro.");
        profile.setCity("Sin definir");
        profile.setProvince("Sin definir");
        profile.setVenueType("private_party".equals(user.getRole()) ? "private_party" : "other");
        return organizerProfileRepository.save(profile);
    }

    private boolean isOrganizerRole(String role) {
        return "organizer".equals(role) || "private_party".equals(role);
    }

    private String validarRegistro(RegisterRequest request) {
        if (request == null) {
            return "Faltan los datos de registro";
        }

        if (!isValidEmail(request.getEmail())) {
            return "El email no es valido";
        }

        if (limpiarTexto(request.getName()) == null || limpiarTexto(request.getName()).length() < 2) {
            return "El nombre debe tener al menos 2 caracteres";
        }

        if (request.getPassword() == null
                || request.getPassword().isBlank()
                || request.getPassword().length() < MIN_PASSWORD_LENGTH) {
            return "La contrasena debe tener al menos 4 caracteres";
        }

        if (!isAllowedRegistrationRole(request.getRole())) {
            return "El tipo de cuenta no es valido";
        }

        return null;
    }

    private String validarLogin(LoginRequest request) {
        if (request == null) {
            return "Faltan los datos de acceso";
        }

        if (!isValidEmail(request.getEmail())) {
            return "El email no es valido";
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            return "La contrasena es obligatoria";
        }

        return null;
    }

    private boolean isAllowedRegistrationRole(String role) {
        String normalizedRole = normalizarRole(role);
        return "dj".equals(normalizedRole)
                || "organizer".equals(normalizedRole)
                || "private_party".equals(normalizedRole);
    }

    private boolean isValidEmail(String email) {
        String normalizedEmail = normalizarEmail(email);
        return normalizedEmail != null
                && normalizedEmail.contains("@")
                && normalizedEmail.indexOf('@') > 0
                && normalizedEmail.indexOf('@') < normalizedEmail.length() - 1
                && normalizedEmail.contains(".");
    }

    private String normalizarEmail(String email) {
        String cleanedEmail = limpiarTexto(email);
        return cleanedEmail != null ? cleanedEmail.toLowerCase(Locale.ROOT) : null;
    }

    private String normalizarRole(String role) {
        String cleanedRole = limpiarTexto(role);
        return cleanedRole != null ? cleanedRole.toLowerCase(Locale.ROOT) : null;
    }

    private String limpiarTexto(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return null;
        }
        return texto.trim();
    }

    private AuthResponse toAuthResponse(User user, DjProfile djProfile, OrganizerProfile organizerProfile) {
        String displayName = user.getEmail();

        if (djProfile != null) {
            displayName = djProfile.getArtistName();
        }

        if (organizerProfile != null) {
            displayName = organizerProfile.getVenueName();
        }

        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                djProfile != null ? djProfile.getId() : null,
                organizerProfile != null ? organizerProfile.getId() : null,
                displayName);
    }
}
