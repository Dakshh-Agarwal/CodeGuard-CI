package com.codeguard.controller;

import com.codeguard.dto.ReviewRequestDTO;
import com.codeguard.dto.ReviewResponseDTO;
import com.codeguard.model.ReviewJob;
import com.codeguard.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For development convenience
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> submitReview(@Valid @RequestBody ReviewRequestDTO request) {
        ReviewJob job = reviewService.submitJob(request);
        
        return ResponseEntity.accepted().body(ReviewResponseDTO.builder()
                .jobId(job.getId())
                .status(job.getStatus())
                .message("Job queued. Poll GET /api/review/" + job.getId() + " for results.")
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDTO> getReview(@PathVariable UUID id) {
        ReviewJob job = reviewService.getJob(id);
        
        ReviewResponseDTO.ReviewResponseDTOBuilder responseBuilder = ReviewResponseDTO.builder()
                .jobId(job.getId())
                .status(job.getStatus())
                .language(job.getLanguage())
                .submittedAt(job.getSubmittedAt())
                .completedAt(job.getCompletedAt())
                .totalViolations(job.getTotalViolations());

        if ("COMPLETED".equals(job.getStatus())) {
            responseBuilder.violations(reviewService.getViolations(id));
        }

        return ResponseEntity.ok(responseBuilder.build());
    }
}
