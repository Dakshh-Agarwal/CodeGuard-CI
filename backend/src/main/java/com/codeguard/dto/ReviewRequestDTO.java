package com.codeguard.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class ReviewRequestDTO {
    @NotBlank(message = "Code is required")
    private String code;
    
    @NotBlank(message = "Language is required")
    private String language;
}
