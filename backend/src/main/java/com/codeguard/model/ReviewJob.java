package com.codeguard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "review_jobs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewJob {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(columnDefinition = "TEXT")
    private String submittedCode;

    private String language;
    
    private String status; // PENDING, RUNNING, COMPLETED, FAILED

    private Integer totalViolations;

    private LocalDateTime submittedAt;

    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
        if (status == null) status = "PENDING";
    }
}
