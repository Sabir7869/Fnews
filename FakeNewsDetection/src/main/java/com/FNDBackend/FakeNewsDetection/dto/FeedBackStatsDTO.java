package com.FNDBackend.FakeNewsDetection.dto;

import lombok.Data;

@Data
public class FeedBackStatsDTO {
    private Long messageId;
    private long totalLikes;
    private long totalDislikes;
    private Double likePercent;
}
