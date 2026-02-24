package com.FNDBackend.FakeNewsDetection.mapper;
import com.FNDBackend.FakeNewsDetection.dto.FeedBackRequestDTO;
import com.FNDBackend.FakeNewsDetection.dto.FeedBackResponseDTO;
import com.FNDBackend.FakeNewsDetection.dto.MessageRespDto;
import com.FNDBackend.FakeNewsDetection.dto.UserResponseDTO;
import com.FNDBackend.FakeNewsDetection.model.Feedback;
import com.FNDBackend.FakeNewsDetection.model.Message;
import com.FNDBackend.FakeNewsDetection.model.User;



public class Converter {
    public static UserResponseDTO convertRes(User user) {
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setEmail(user.getEmail());
        userResponseDTO.setName(user.getName());
        return userResponseDTO;
    }

    public static MessageRespDto  convertMessage(Message message) {
        return MessageRespDto.builder()
                .id(message.getId())
                .content(message.getContent())
                .verdict(message.getVerdict())
                .confidence(message.getConfidence())
                .summary(message.getSummary())
                .authorName(message.getAuthor().getName())
                .authorEmail(message.getAuthor().getEmail())
                .createdAt(message.getCreatedAt())
                .build();
    }

    public static FeedBackResponseDTO feedBackResponseDTO(Feedback feedback) {
        FeedBackResponseDTO feedBackResponseDTO = new FeedBackResponseDTO();
        feedBackResponseDTO.setId(feedback.getId());
        feedBackResponseDTO.setUserId(feedback.getUser().getId());
        feedBackResponseDTO.setMessageId(feedback.getMessage().getId());
        feedBackResponseDTO.setLiked(feedback.getLiked());
        feedBackResponseDTO.setDate(feedback.getDate());
        return feedBackResponseDTO;
    }


}
