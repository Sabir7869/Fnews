package com.FNDBackend.FakeNewsDetection.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class FeedBackResponseDTO {
    private Long id;
    private Long userId;
    private Long messageId;
    private Boolean liked;
    private LocalDate date;
}
