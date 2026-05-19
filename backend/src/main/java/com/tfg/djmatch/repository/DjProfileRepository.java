package com.tfg.djmatch.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tfg.djmatch.model.DjProfile;

public interface DjProfileRepository extends JpaRepository<DjProfile, Integer> {

    Optional<DjProfile> findByUserId(Integer userId);

    @Query(value = """
            SELECT DISTINCT d.*
            FROM dj_profiles d
            LEFT JOIN dj_styles ds ON ds.dj_profile_id = d.id
            LEFT JOIN music_styles ms ON ms.id = ds.music_style_id
            WHERE (:city IS NULL OR LOWER(d.city) LIKE LOWER(CONCAT('%', :city, '%')))
            AND (:minExperience IS NULL OR d.experience_years >= :minExperience)
            AND (:available IS NULL OR d.is_available = :available)
            AND (:styleSlug IS NULL OR ms.slug = :styleSlug)
            ORDER BY d.artist_name ASC
            """, nativeQuery = true)
    List<DjProfile> buscarDjs(
            @Param("city") String city,
            @Param("minExperience") Integer minExperience,
            @Param("available") Boolean available,
            @Param("styleSlug") String styleSlug);

    @Query(value = """
            SELECT ms.name
            FROM music_styles ms
            INNER JOIN dj_styles ds ON ds.music_style_id = ms.id
            WHERE ds.dj_profile_id = :djProfileId
            ORDER BY ms.name ASC
            """, nativeQuery = true)
    List<String> findStyleNamesByDjProfileId(@Param("djProfileId") Integer djProfileId);
}
