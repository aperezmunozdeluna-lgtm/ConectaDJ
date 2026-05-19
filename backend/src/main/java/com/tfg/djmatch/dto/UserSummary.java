package com.tfg.djmatch.dto;

public class UserSummary {

    private Integer userId;
    private String email;
    private String role;
    private String displayName;
    private Integer profileId;
    private String photoUrl;
    private Boolean active;

    public UserSummary(
            Integer userId,
            String email,
            String role,
            String displayName,
            Integer profileId,
            String photoUrl) {
        this(userId, email, role, displayName, profileId, photoUrl, null);
    }

    public UserSummary(
            Integer userId,
            String email,
            String role,
            String displayName,
            Integer profileId,
            String photoUrl,
            Boolean active) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.displayName = displayName;
        this.profileId = profileId;
        this.photoUrl = photoUrl;
        this.active = active;
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

    public String getDisplayName() {
        return displayName;
    }

    public Integer getProfileId() {
        return profileId;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public Boolean getActive() {
        return active;
    }
}
