package com.tfg.djmatch.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tfg.djmatch.dto.UserSummary;
import com.tfg.djmatch.model.DjProfile;
import com.tfg.djmatch.model.OrganizerProfile;
import com.tfg.djmatch.model.User;
import com.tfg.djmatch.repository.DjProfileRepository;
import com.tfg.djmatch.repository.OrganizerProfileRepository;
import com.tfg.djmatch.repository.UserRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserRepository userRepository;
    private final DjProfileRepository djProfileRepository;
    private final OrganizerProfileRepository organizerProfileRepository;

    public UserController(
            UserRepository userRepository,
            DjProfileRepository djProfileRepository,
            OrganizerProfileRepository organizerProfileRepository) {
        this.userRepository = userRepository;
        this.djProfileRepository = djProfileRepository;
        this.organizerProfileRepository = organizerProfileRepository;
    }

    @GetMapping("/api/users")
    public List<UserSummary> listarUsuarios() {
        List<UserSummary> users = userRepository.findByActiveTrueOrderByEmailAsc()
                .stream()
                .map(this::toUserSummary)
                .toList();

        log.info("Usuarios activos cargados. Total: {}", users.size());
        return users;
    }

    private UserSummary toUserSummary(User user) {
        String displayName = user.getEmail();
        Integer profileId = null;
        String photoUrl = null;

        if ("dj".equals(user.getRole())) {
            DjProfile profile = djProfileRepository.findByUserId(user.getId()).orElse(null);
            if (profile != null) {
                displayName = profile.getArtistName();
                profileId = profile.getId();
                photoUrl = profile.getProfilePhoto();
            }
        }

        if (isOrganizerRole(user.getRole())) {
            OrganizerProfile profile = organizerProfileRepository.findByUserId(user.getId()).orElse(null);
            if (profile != null) {
                displayName = profile.getVenueName();
                profileId = profile.getId();
                photoUrl = profile.getLogoPhoto();
            }
        }

        return new UserSummary(user.getId(), user.getEmail(), user.getRole(), displayName, profileId, photoUrl);
    }

    private boolean isOrganizerRole(String role) {
        return "organizer".equals(role) || "private_party".equals(role);
    }
}
