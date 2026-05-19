package com.tfg.djmatch.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tfg.djmatch.model.Message;

public interface MessageRepository extends JpaRepository<Message, Integer> {

    List<Message> findByConversationIdOrderBySentAtAsc(Integer conversationId);

    List<Message> findByConversationIdAndSenderUserIdNotAndReadFalse(Integer conversationId, Integer senderUserId);

    long countByConversationIdAndSenderUserIdNotAndReadFalse(Integer conversationId, Integer senderUserId);
}
