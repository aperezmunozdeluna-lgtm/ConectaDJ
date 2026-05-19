package com.tfg.djmatch.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "job_offers")
public class JobOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "organizer_id")
    private Integer organizerId;

    private String title;

    private String description;

    @Column(name = "event_date")
    private LocalDate eventDate;

    private String city;

    @Column(name = "music_style_id")
    private Integer musicStyleId;

    @Column(name = "min_experience_years")
    private Integer minExperienceYears;

    private BigDecimal budget;

    @Column(name = "duration_hours")
    private BigDecimal durationHours;

    @Column(name = "image_url")
    private String imageUrl;

    private String status;

    public Integer getId() {
        return id;
    }

    public Integer getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Integer organizerId) {
        this.organizerId = organizerId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getMusicStyleId() {
        return musicStyleId;
    }

    public void setMusicStyleId(Integer musicStyleId) {
        this.musicStyleId = musicStyleId;
    }

    public Integer getMinExperienceYears() {
        return minExperienceYears;
    }

    public void setMinExperienceYears(Integer minExperienceYears) {
        this.minExperienceYears = minExperienceYears;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public BigDecimal getDurationHours() {
        return durationHours;
    }

    public void setDurationHours(BigDecimal durationHours) {
        this.durationHours = durationHours;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
