package com.tfg.djmatch.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "favorite_djs")
public class FavoriteDj {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "organizer_id")
    private Integer organizerId;

    @Column(name = "dj_profile_id")
    private Integer djProfileId;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Integer getId() {
        return id;
    }

    public Integer getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Integer organizerId) {
        this.organizerId = organizerId;
    }

    public Integer getDjProfileId() {
        return djProfileId;
    }

    public void setDjProfileId(Integer djProfileId) {
        this.djProfileId = djProfileId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
