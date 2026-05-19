package com.tfg.djmatch.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.tfg.djmatch.dto.LoginRequest;
import com.tfg.djmatch.dto.RegisterRequest;
import com.tfg.djmatch.model.User;
import com.tfg.djmatch.repository.DjProfileRepository;
import com.tfg.djmatch.repository.OrganizerProfileRepository;
import com.tfg.djmatch.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private DjProfileRepository djProfileRepository;

    @Mock
    private OrganizerProfileRepository organizerProfileRepository;

    @InjectMocks
    private AuthController authController;

    @Test
    void registerRejectsAdminRole() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Admin");
        request.setEmail("admin-nuevo@example.com");
        request.setPassword("demo123");
        request.setRole("admin");

        ResponseEntity<?> response = authController.register(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(userRepository, never()).save(any(User.class));
        verifyNoInteractions(djProfileRepository, organizerProfileRepository);
    }

    @Test
    void registerRejectsShortPassword() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Alex Beat");
        request.setEmail("alex@example.com");
        request.setPassword("123");
        request.setRole("dj");

        ResponseEntity<?> response = authController.register(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void loginRejectsWrongPassword() {
        User user = new User();
        user.setEmail("alex@example.com");
        user.setPasswordHash("demo123");
        user.setRole("dj");
        user.setActive(true);

        LoginRequest request = new LoginRequest();
        request.setEmail("alex@example.com");
        request.setPassword("incorrecta");

        when(userRepository.findByEmail("alex@example.com")).thenReturn(Optional.of(user));

        ResponseEntity<?> response = authController.login(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verifyNoInteractions(djProfileRepository, organizerProfileRepository);
    }
}
