package com.FNDBackend.FakeNewsDetection.service;
import com.FNDBackend.FakeNewsDetection.dto.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.nio.charset.StandardCharsets;
import java.time.Duration;


@Service
public class VerificationService {

    private final WebClient webClient;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${google.factcheck.api.key}")
    private String factCheckAPIKey;

    @Value("${google.customsearch.api.key}")
    private String customSearchAPIKey;

    @Value("${google.customsearch.cx}")
    private String customEngineId;

    @Value("${google.gemini.api.key}")
    private String geminiAPIKey;

    public VerificationService(WebClient.Builder builder) {
        this.webClient = builder.build();
    }

    // ================= MAIN =================

    public VerificationResult verify(String content) {

        FactCheckResponse fact = callFactCheckAPI(content);
        SearchResponse search = callCustomSearchAPI(content);
        GeminiResponse gemini = callGeminiAPI(content, fact, search);

        VerificationResult result = new VerificationResult();
        result.setVerdict(gemini.getVerdict());
        result.setConfidence(gemini.getConfidence() != null ? gemini.getConfidence() : 0);
        result.setSummary(gemini.getSummary());
        result.setFactCheckResponse(fact);
        result.setSearchResponse(search);

        return result;
    }

    // ================= GEMINI =================

    private GeminiResponse callGeminiAPI(String content,
                                         FactCheckResponse fact,
                                         SearchResponse search) {

        String url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key="
                + geminiAPIKey;

        try {
            String raw = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(new GeminiRequest(buildPrompt(content, fact, search)))
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            return parseGemini(raw);

        } catch (Exception e) {
            return defaultGemini();
        }
    }

    private GeminiResponse parseGemini(String raw) {
        try {
            JsonNode textNode = mapper.readTree(raw)
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text");

            String text = textNode.asText();

            if (text == null || text.isBlank()) return defaultGemini();

            text = text.replace("```json", "")
                    .replace("```", "")
                    .trim();

            int start = text.indexOf("{");
            int end = text.lastIndexOf("}");

            if (start == -1 || end == -1) return defaultGemini();

            return mapper.readValue(text.substring(start, end + 1), GeminiResponse.class);

        } catch (Exception e) {
            return defaultGemini();
        }
    }

    private GeminiResponse defaultGemini() {
        GeminiResponse r = new GeminiResponse();
        r.setVerdict("PENDING");
        r.setConfidence(0);
        r.setSummary("Gemini parsing failed");
        return r;
    }

    // ================= PROMPT =================

    private String buildPrompt(String content,
                               FactCheckResponse fact,
                               SearchResponse search) {

        return """
        You are a professional fact-checking AI.

        Analyze the claim using the evidence below.

        CLAIM:
        %s

        FACT CHECK DATA:
        %s

        SEARCH RESULTS:
        %s

        Respond ONLY in valid JSON:

        {
          "verdict": "TRUE or FALSE or PARTIALLY_TRUE or UNVERIFIABLE",
          "confidence": 0-100,
          "summary": "brief explanation"
        }
        """.formatted(
                content,
                extractFact(fact),
                extractSearch(search)
        );
    }

    // ================= FACT CHECK =================

    private FactCheckResponse callFactCheckAPI(String query) {

        String url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
                + "?query=" + encode(query)
                + "&key=" + factCheckAPIKey;

        try {
            return webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(FactCheckResponse.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
        } catch (Exception e) {
            return new FactCheckResponse();
        }
    }

    private String extractFact(FactCheckResponse response) {

        if (response == null || response.getClaims() == null || response.getClaims().isEmpty())
            return "No fact-check data.";

        StringBuilder sb = new StringBuilder();

        for (FactCheckResponse.Claim claim : response.getClaims()) {
            sb.append("Claim: ").append(claim.getText()).append("\n");

            if (claim.getClaimReview() != null) {
                for (FactCheckResponse.ClaimReview review : claim.getClaimReview()) {
                    sb.append("Rating: ").append(review.getTextualRating()).append("\n");
                }
            }
            sb.append("\n");
        }
        return sb.toString();
    }

    // ================= SEARCH =================

    private SearchResponse callCustomSearchAPI(String query) {

        String url = "https://www.googleapis.com/customsearch/v1"
                + "?q=" + encode(query)
                + "&key=" + customSearchAPIKey
                + "&cx=" + customEngineId;

        try {
            return webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(SearchResponse.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
        } catch (Exception e) {
            return new SearchResponse();
        }
    }

    private String extractSearch(SearchResponse response) {

        if (response == null || response.getItems() == null || response.getItems().isEmpty())
            return "No search results.";

        StringBuilder sb = new StringBuilder();

        int count = 0;
        for (SearchResponse.SearchItem item : response.getItems()) {
            sb.append("Title: ").append(item.getTitle()).append("\n");
            sb.append("Snippet: ").append(item.getSnippet()).append("\n\n");

            if (++count == 3) break;
        }
        return sb.toString();
    }

    private String encode(String query) {
        return java.net.URLEncoder.encode(query, StandardCharsets.UTF_8);
    }
}
