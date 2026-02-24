package com.FNDBackend.FakeNewsDetection.service;

import com.FNDBackend.FakeNewsDetection.dto.FeedBackStatsDTO;
import com.FNDBackend.FakeNewsDetection.dto.MessageRespDto;
import com.FNDBackend.FakeNewsDetection.dto.VerificationResult;
import com.FNDBackend.FakeNewsDetection.mapper.Converter;
import com.FNDBackend.FakeNewsDetection.model.Message;
import com.FNDBackend.FakeNewsDetection.model.User;
import com.FNDBackend.FakeNewsDetection.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private UserService userService;

    @Autowired
    private FeedbackService feedbackService;

    public MessageRespDto processMessage(String content, Long userId) {

        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = messageRepository
                .findByContentAndAuthor(content, user)
                .orElseGet(() -> {
                    Message newMessage = verifyAndCreate(content, user);
                    return messageRepository.save(newMessage);
                });

        return buildResponse(message);
    }

    private Message verifyAndCreate(String content, User user) {

        VerificationResult result = verificationService.verify(content);

        Message message = new Message();
        message.setContent(content);
        message.setAuthor(user);

        if (result != null) {
            message.setVerdict(result.getVerdict());
            message.setConfidence(result.getConfidence());
            message.setSummary(result.getSummary());
        } else {
            message.setVerdict("PENDING");
            message.setConfidence(0);
            message.setSummary("Verification failed");
        }

        return message;
    }

    private MessageRespDto buildResponse(Message message) {

        MessageRespDto dto = Converter.convertMessage(message);

        FeedBackStatsDTO stats =
                feedbackService.getFeedBackStats(message.getId());

        dto.setFeedBackStatsDTO(stats);

        // Calculate final confidence dynamically
        double aiConfidence = message.getConfidence() / 100.0;
        double userScore = stats.getLikePercent() / 100.0;

        double finalConfidence =
                ((aiConfidence * 0.7) + (userScore * 0.3)) * 100;

        dto.setConfidence((int) finalConfidence);

        return dto;
    }

    public MessageRespDto getMessage(Long id) {

        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        return buildResponse(message);
    }

    public void deleteMessage(Long messageId) {

        feedbackService.deleteByMessage(messageId);
        messageRepository.deleteById(messageId);
    }

    public Double calculateConfidence(Long id) {

        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        return computeFinalConfidence(message);
    }
    private double computeFinalConfidence(Message message) {

        FeedBackStatsDTO stats =
                feedbackService.getFeedBackStats(message.getId());

        double aiConfidence = message.getConfidence() / 100.0;
        double userScore = stats.getLikePercent() / 100.0;

        return ((aiConfidence * 0.7) + (userScore * 0.3)) * 100;
    }

}
