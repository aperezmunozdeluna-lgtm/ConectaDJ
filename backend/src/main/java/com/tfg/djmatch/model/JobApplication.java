package com.tfg.djmatch.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "job_offer_id")
    private Integer jobOfferId;

    @Column(name = "dj_profile_id")
    private Integer djProfileId;

    private String status;

    private String message;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Integer getId() {
        return id;
    }

    public Integer getJobOfferId() {
        return jobOfferId;
    }

    public void setJobOfferId(Integer jobOfferId) {
        this.jobOfferId = jobOfferId;
    }

    public Integer getDjProfileId() {
        return djProfileId;
    }

    public void setDjProfileId(Integer djProfileId) {
        this.djProfileId = djProfileId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
