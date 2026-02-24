package com.FNDBackend.FakeNewsDetection.dto;
import com.FNDBackend.FakeNewsDetection.model.Feedback;
import jakarta.persistence.PrePersist;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Builder
@Data
public class MessageRespDto {
    private Long id;

    private String content;

    private String verdict;

    private Integer confidence;

    private String summary;


    private String authorName;
    private String authorEmail;


    private LocalDate createdAt;

    private FeedBackStatsDTO  feedBackStatsDTO;
}
