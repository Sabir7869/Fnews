package com.FNDBackend.FakeNewsDetection.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchResponse {
    private List<SearchItem> items;


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchItem {
        private String title;      // Article title
        private String link;       // URL
        private String snippet;    // Short description
    }
}
