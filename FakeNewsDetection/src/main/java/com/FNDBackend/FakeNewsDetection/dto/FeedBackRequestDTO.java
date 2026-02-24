package com.FNDBackend.FakeNewsDetection.dto;

import com.FNDBackend.FakeNewsDetection.model.Feedback;
import lombok.Data;

import java.util.Optional;
import java.util.UUID;

@Data
public class FeedBackRequestDTO {
    private Long userID;
    private Long messageId;
    // true - like , false - dislike
    private Boolean liked;

}
