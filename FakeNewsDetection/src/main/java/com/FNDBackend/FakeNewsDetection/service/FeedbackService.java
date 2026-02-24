package com.FNDBackend.FakeNewsDetection.service;

import com.FNDBackend.FakeNewsDetection.dto.FeedBackRequestDTO;
import com.FNDBackend.FakeNewsDetection.dto.FeedBackResponseDTO;
import com.FNDBackend.FakeNewsDetection.dto.FeedBackStatsDTO;
import com.FNDBackend.FakeNewsDetection.mapper.Converter;
import com.FNDBackend.FakeNewsDetection.model.Feedback;
import com.FNDBackend.FakeNewsDetection.model.Message;
import com.FNDBackend.FakeNewsDetection.model.User;
import com.FNDBackend.FakeNewsDetection.repository.FeedBackRepository;
import com.FNDBackend.FakeNewsDetection.repository.MessageRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class FeedbackService {

    @Autowired
    private FeedBackRepository feedBackRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private MessageRepository messageRepository;

    public FeedBackResponseDTO addOrUpdateFeedBack(FeedBackRequestDTO dto) {

        User user = userService.findById(dto.getUserID())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = messageRepository.findById(dto.getMessageId())
                .orElseThrow(() -> new RuntimeException("Message not found"));

        Optional<Feedback> existing =
                feedBackRepository.findByUserIdAndMessageId(
                        dto.getUserID(),
                        dto.getMessageId()
                );

        Feedback feedback;

        if (existing.isPresent()) {
            feedback = existing.get();
            feedback.setLiked(dto.getLiked());
        } else {
            feedback = new Feedback();
            feedback.setUser(user);
            feedback.setMessage(message);
            feedback.setLiked(dto.getLiked());
        }

        Feedback saved = feedBackRepository.save(feedback);

        return Converter.feedBackResponseDTO(saved);
    }

    public FeedBackStatsDTO getFeedBackStats(Long messageId) {

        if (!messageRepository.existsById(messageId)) {
            throw new RuntimeException("Message not found");
        }

        long likes =
                feedBackRepository.countByMessageIdAndLiked(messageId, true);

        long dislikes =
                feedBackRepository.countByMessageIdAndLiked(messageId, false);

        long total = likes + dislikes;

        double percent = total == 0
                ? 0
                : (likes * 100.0) / total;

        FeedBackStatsDTO dto = new FeedBackStatsDTO();
        dto.setMessageId(messageId);
        dto.setTotalLikes(likes);
        dto.setTotalDislikes(dislikes);
        dto.setLikePercent(percent);

        return dto;
    }

    public List<FeedBackResponseDTO> getFeedBackByUser(Long userId) {

        if (!userService.findById(userId).isPresent()) {
            throw new RuntimeException("User not found");
        }

        return feedBackRepository.findByUserId(userId)
                .stream()
                .map(Converter::feedBackResponseDTO)
                .toList();
    }

    public List<FeedBackResponseDTO> getFeedBackByMessage(Long messageId) {

        if (!messageRepository.existsById(messageId)) throw new RuntimeException("Message not found");

        return feedBackRepository.findByMessageId(messageId)
                .stream()
                .map(Converter::feedBackResponseDTO)
                .toList();
    }

    public void deleteFeedBack(Long feedbackId) {

        Feedback feedback = feedBackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        feedBackRepository.delete(feedback);
    }

    public void deleteByMessage(Long messageId) {
        feedBackRepository.deleteAll(
                feedBackRepository.findByMessageId(messageId)
        );
    }
}
