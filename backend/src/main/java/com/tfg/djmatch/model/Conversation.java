package com.tfg.djmatch.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "conversations")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_one_id")
    private Integer userOneId;

    @Column(name = "user_two_id")
    private Integer userTwoId;

    @Column(name = "dj_profile_id")
    private Integer djProfileId;

    @Column(name = "organizer_id")
    private Integer organizerId;

    @Column(name = "job_offer_id")
    private Integer jobOfferId;

    private String status;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    public Integer getId() {
        return id;
    }

    public Integer getUserOneId() {
        return userOneId;
    }

    public void setUserOneId(Integer userOneId) {
        this.userOneId = userOneId;
    }

    public Integer getUserTwoId() {
        return userTwoId;
    }

    public void setUserTwoId(Integer userTwoId) {
        this.userTwoId = userTwoId;
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

    public Integer getJobOfferId() {
        return jobOfferId;
    }

    public void setJobOfferId(Integer jobOfferId) {
        this.jobOfferId = jobOfferId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(LocalDateTime lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }
}
