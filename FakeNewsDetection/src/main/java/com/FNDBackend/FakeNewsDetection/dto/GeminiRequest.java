package com.FNDBackend.FakeNewsDetection.dto;
import lombok.Data;
import java.util.List;

@Data
public class GeminiRequest {
    private List<Content> contents;

    public  GeminiRequest(String prompt) {
        this.contents = List.of(
                new Content(
                        List.of(new Part(prompt))
                )
        );
    }
    @Data
    public static class Content{
        private List<Part> parts;
        public Content(List<Part> parts) {
            this.parts = parts;
        }
    }
    @Data
    public static class Part{
        private String text;
        public Part(String text){
            this.text = text;
        }
    }
}
/*
We Require a JSON formate for the Gemini API-KEY
JSON Format --->
{
  "contents": [
    {
      "parts": [
        { "text": "your prompt here" }
      ]
    }
  ]
}
*/