package com.FNDBackend.FakeNewsDetection.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponseDTO {
    private String email;
    private String name;
    private String token;
}
