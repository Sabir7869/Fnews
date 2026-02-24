package com.FNDBackend.FakeNewsDetection.dto;

import lombok.Data;
import java.util.List;

@Data
public class FactCheckResponse {

    private List<Claim> claims;

    @Data
    public static class Claim {

        private String text;

        private String claimDate;

        private List<ClaimReview> claimReview;
    }

    @Data
    public static class ClaimReview {

        private Publisher publisher;

        private String url;

        private String textualRating;
    }

    @Data
    public static class Publisher {
        private String name;
    }
}
