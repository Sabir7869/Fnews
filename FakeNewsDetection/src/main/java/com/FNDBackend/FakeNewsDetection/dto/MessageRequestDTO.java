package com.FNDBackend.FakeNewsDetection.dto;

import lombok.Data;

@Data
public class MessageRequestDTO {
    private String content;
    private Long userId;
}
