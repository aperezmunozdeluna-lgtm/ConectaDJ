package com.tfg.djmatch.dto;

public class AuthResponse {

    private Integer userId;
    private String email;
    private String role;
    private Integer djProfileId;
    private Integer organizerProfileId;
    private String displayName;

    public AuthResponse(
            Integer userId,
            String email,
            String role,
            Integer djProfileId,
            Integer organizerProfileId,
            String displayName) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.djProfileId = djProfileId;
        this.organizerProfileId = organizerProfileId;
        this.displayName = displayName;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public Integer getDjProfileId() {
        return djProfileId;
    }

    public Integer getOrganizerProfileId() {
        return organizerProfileId;
    }

    public String getDisplayName() {
        return displayName;
    }
}
