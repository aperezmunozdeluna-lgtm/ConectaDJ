package com.tfg.djmatch.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tfg.djmatch.model.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Integer> {

    List<Conversation> findByDjProfileIdOrderByLastMessageAtDesc(Integer djProfileId);

    List<Conversation> findByOrganizerIdOrderByLastMessageAtDesc(Integer organizerId);

    Optional<Conversation> findByDjProfileIdAndOrganizerId(Integer djProfileId, Integer organizerId);

    @Query("""
            SELECT c FROM Conversation c
            WHERE c.userOneId = :userId OR c.userTwoId = :userId
            ORDER BY c.lastMessageAt DESC
            """)
    List<Conversation> findByUserId(@Param("userId") Integer userId);

    @Query("""
            SELECT c FROM Conversation c
            WHERE (c.userOneId = :firstUserId AND c.userTwoId = :secondUserId)
            OR (c.userOneId = :secondUserId AND c.userTwoId = :firstUserId)
            """)
    Optional<Conversation> findBetweenUsers(
            @Param("firstUserId") Integer firstUserId,
            @Param("secondUserId") Integer secondUserId);
}
