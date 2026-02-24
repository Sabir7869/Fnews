package com.FNDBackend.FakeNewsDetection.dto;

import lombok.Data;

@Data
public class GeminiResponse {
    private String verdict;
    private Integer confidence;
    private String summary;
}
