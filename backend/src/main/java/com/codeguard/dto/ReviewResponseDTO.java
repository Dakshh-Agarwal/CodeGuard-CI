package com.codeguard.dto;

import com.codeguard.model.Violation;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ReviewResponseDTO {
    private UUID jobId;
    private String status;
    private String language;
    private LocalDateTime submittedAt;
    private LocalDateTime completedAt;
    private Integer totalViolations;
    private List<Violation> violations;
    private String message;
}
