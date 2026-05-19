package com.tfg.djmatch.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tfg.djmatch.model.Conversation;
import com.tfg.djmatch.model.Message;
import com.tfg.djmatch.model.User;
import com.tfg.djmatch.repository.ConversationRepository;
import com.tfg.djmatch.repository.MessageRepository;
import com.tfg.djmatch.repository.UserRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    private static final Logger log = LoggerFactory.getLogger(MessageController.class);

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageController(
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/api/conversations/dj/{djProfileId}")
    public List<Conversation> listarConversacionesDj(@PathVariable Integer djProfileId) {
        List<Conversation> conversations = conversationRepository.findByDjProfileIdOrderByLastMessageAtDesc(djProfileId);
        log.info("Conversaciones del DJ {}. Total: {}", djProfileId, conversations.size());
        return conversations;
    }

    @GetMapping("/api/conversations/organizer/{organizerId}")
    public List<Conversation> listarConversacionesOrganizador(@PathVariable Integer organizerId) {
        List<Conversation> conversations = conversationRepository.findByOrganizerIdOrderByLastMessageAtDesc(organizerId);
        log.info("Conversaciones del organizador {}. Total: {}", organizerId, conversations.size());
        return conversations;
    }

    @GetMapping("/api/conversations/user/{userId}")
    public List<Conversation> listarConversacionesUsuario(@PathVariable Integer userId) {
        List<Conversation> conversations = conversationRepository.findByUserId(userId);
        log.info("Conversaciones del usuario {}. Total: {}", userId, conversations.size());
        return conversations;
    }

    @GetMapping("/api/conversations/user/{userId}/unread")
    public Map<Integer, Long> contarMensajesNoLeidos(@PathVariable Integer userId) {
        List<Conversation> conversations = conversationRepository.findByUserId(userId);
        Map<Integer, Long> unreadByConversation = new HashMap<>();

        for (Conversation conversation : conversations) {
            long unreadMessages = messageRepository.countByConversationIdAndSenderUserIdNotAndReadFalse(
                    conversation.getId(), userId);
            unreadByConversation.put(conversation.getId(), unreadMessages);
        }

        log.info("Conteo de mensajes no leidos para usuario {}", userId);
        return unreadByConversation;
    }

    @PostMapping("/api/conversations")
    public ResponseEntity<?> crearConversacion(@RequestBody Conversation conversation) {
        Integer userOneId = conversation.getUserOneId();
        Integer userTwoId = conversation.getUserTwoId();

        if (userOneId == null || userTwoId == null) {
            return ResponseEntity.badRequest().body("Faltan los usuarios de la conversacion");
        }

        if (userOneId.equals(userTwoId)) {
            return ResponseEntity.badRequest().body("No puedes abrir una conversacion contigo mismo");
        }

        User userOne = userRepository.findById(userOneId).orElse(null);
        User userTwo = userRepository.findById(userTwoId).orElse(null);

        if (userOne == null || userTwo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Uno de los usuarios no existe");
        }

        if (!puedenHablar(userOne, userTwo)) {
            return ResponseEntity.badRequest()
                    .body("Las fiestas privadas solo pueden hablar con DJs");
        }

        Conversation existingConversation = conversationRepository.findBetweenUsers(userOneId, userTwoId).orElse(null);
        if (existingConversation != null) {
            if (conversation.getDjProfileId() != null) {
                existingConversation.setDjProfileId(conversation.getDjProfileId());
            }
            if (conversation.getOrganizerId() != null) {
                existingConversation.setOrganizerId(conversation.getOrganizerId());
            }
            if (conversation.getJobOfferId() != null) {
                existingConversation.setJobOfferId(conversation.getJobOfferId());
            }
            conversationRepository.save(existingConversation);
            return ResponseEntity.ok(existingConversation);
        }

        Conversation newConversation = new Conversation();
        newConversation.setUserOneId(userOneId);
        newConversation.setUserTwoId(userTwoId);
        newConversation.setDjProfileId(conversation.getDjProfileId());
        newConversation.setOrganizerId(conversation.getOrganizerId());
        newConversation.setJobOfferId(conversation.getJobOfferId());
        newConversation.setStatus("active");
        newConversation.setLastMessageAt(LocalDateTime.now());

        Conversation savedConversation = conversationRepository.save(newConversation);
        log.info("Conversacion creada. Id: {}, usuarios: {} y {}", savedConversation.getId(), userOneId, userTwoId);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedConversation);
    }

    @GetMapping("/api/conversations/{conversationId}/messages")
    public List<Message> listarMensajes(@PathVariable Integer conversationId) {
        List<Message> messages = messageRepository.findByConversationIdOrderBySentAtAsc(conversationId);
        log.info("Mensajes de conversacion {}. Total: {}", conversationId, messages.size());
        return messages;
    }

    @PatchMapping("/api/conversations/{conversationId}/read")
    public ResponseEntity<Void> marcarConversacionComoLeida(
            @PathVariable Integer conversationId,
            @RequestParam Integer userId) {
        Conversation conversation = conversationRepository.findById(conversationId).orElse(null);

        if (conversation == null) {
            return ResponseEntity.notFound().build();
        }

        if (!userId.equals(conversation.getUserOneId()) && !userId.equals(conversation.getUserTwoId())) {
            return ResponseEntity.badRequest().build();
        }

        List<Message> unreadMessages = messageRepository
                .findByConversationIdAndSenderUserIdNotAndReadFalse(conversationId, userId);

        for (Message unreadMessage : unreadMessages) {
            unreadMessage.setRead(true);
        }

        messageRepository.saveAll(unreadMessages);
        log.info("Conversacion {} marcada como leida por usuario {}", conversationId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/messages")
    public ResponseEntity<?> enviarMensaje(@RequestBody Message message) {
        if (message.getConversationId() == null || message.getSenderUserId() == null) {
            return ResponseEntity.badRequest().body("Faltan datos del mensaje");
        }

        if (message.getBody() == null || message.getBody().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El mensaje no puede estar vacio");
        }

        Conversation conversation = conversationRepository.findById(message.getConversationId()).orElse(null);
        if (conversation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La conversacion no existe");
        }

        if (!message.getSenderUserId().equals(conversation.getUserOneId())
                && !message.getSenderUserId().equals(conversation.getUserTwoId())) {
            return ResponseEntity.badRequest().body("El usuario no pertenece a esta conversacion");
        }

        Integer otherUserId = message.getSenderUserId().equals(conversation.getUserOneId())
                ? conversation.getUserTwoId()
                : conversation.getUserOneId();

        User sender = userRepository.findById(message.getSenderUserId()).orElse(null);
        User otherUser = userRepository.findById(otherUserId).orElse(null);

        if (sender == null || otherUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Uno de los usuarios no existe");
        }

        if (!puedenHablar(sender, otherUser)) {
            return ResponseEntity.badRequest()
                    .body("Las fiestas privadas solo pueden hablar con DJs");
        }

        message.setBody(message.getBody().trim());
        message.setRead(false);
        Message savedMessage = messageRepository.save(message);

        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        log.info("Mensaje enviado. Id: {}, conversacion: {}", savedMessage.getId(), savedMessage.getConversationId());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMessage);
    }

    private boolean puedenHablar(User userOne, User userTwo) {
        boolean userOnePrivateParty = "private_party".equals(userOne.getRole());
        boolean userTwoPrivateParty = "private_party".equals(userTwo.getRole());

        if (!userOnePrivateParty && !userTwoPrivateParty) {
            return true;
        }

        return ("dj".equals(userOne.getRole()) && userTwoPrivateParty)
                || ("dj".equals(userTwo.getRole()) && userOnePrivateParty);
    }
}
