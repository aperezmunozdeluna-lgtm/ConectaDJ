package com.tfg.djmatch.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "dj_profiles")
public class DjProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "artist_name")
    private String artistName;

    private String bio;

    private String city;

    private String province;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "fee_per_session")
    private Double feePerSession;

    @Column(name = "instagram_url")
    private String instagramUrl;

    @Column(name = "soundcloud_url")
    private String soundcloudUrl;

    @Column(name = "mixcloud_url")
    private String mixcloudUrl;

    @Column(name = "profile_photo")
    private String profilePhoto;

    @Column(name = "avg_rating")
    private Double avgRating;

    @Column(name = "is_available")
    private Boolean available;

    @Transient
    private List<String> styles;

    public Integer getId() {
        return id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getArtistName() {
        return artistName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public Double getFeePerSession() {
        return feePerSession;
    }

    public void setFeePerSession(Double feePerSession) {
        this.feePerSession = feePerSession;
    }

    public String getInstagramUrl() {
        return instagramUrl;
    }

    public void setInstagramUrl(String instagramUrl) {
        this.instagramUrl = instagramUrl;
    }

    public String getSoundcloudUrl() {
        return soundcloudUrl;
    }

    public void setSoundcloudUrl(String soundcloudUrl) {
        this.soundcloudUrl = soundcloudUrl;
    }

    public String getMixcloudUrl() {
        return mixcloudUrl;
    }

    public void setMixcloudUrl(String mixcloudUrl) {
        this.mixcloudUrl = mixcloudUrl;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public Double getAvgRating() {
        return avgRating;
    }

    public void setAvgRating(Double avgRating) {
        this.avgRating = avgRating;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public List<String> getStyles() {
        return styles;
    }

    public void setStyles(List<String> styles) {
        this.styles = styles;
    }
}
