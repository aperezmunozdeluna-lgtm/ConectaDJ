package com.tfg.djmatch.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "dj_profile_id")
    private Integer djProfileId;

    @Column(name = "organizer_id")
    private Integer organizerId;

    private Integer rating;

    private String comment;

    @Column(name = "job_offer_id")
    private Integer jobOfferId;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Transient
    private String organizerName;

    public Integer getId() {
        return id;
    }

    public Integer getDjProfileId() {
        return djProfileId;
    }

    public void setDjProfileId(Integer djProfileId) {
        this.djProfileId = djProfileId;
    }

    public Integer getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Integer organizerId) {
        this.organizerId = organizerId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getJobOfferId() {
        return jobOfferId;
    }

    public void setJobOfferId(Integer jobOfferId) {
        this.jobOfferId = jobOfferId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getOrganizerName() {
        return organizerName;
    }

    public void setOrganizerName(String organizerName) {
        this.organizerName = organizerName;
    }
}
