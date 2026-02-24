package com.FNDBackend.FakeNewsDetection.dto;


import lombok.Data;

@Data
public class VerificationResult {
    private String verdict;
    private int confidence;
    private String summary;

    private FactCheckResponse factCheckResponse;
    private SearchResponse searchResponse;
}
