package com.codeguard.service;

import com.codeguard.analyzer.CheckstyleAnalyzer;
import com.codeguard.analyzer.PmdAnalyzer;
import com.codeguard.dto.ReviewRequestDTO;
import com.codeguard.model.ReviewJob;
import com.codeguard.model.Violation;
import com.codeguard.repository.ReviewJobRepository;
import com.codeguard.repository.ViolationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutorService;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ExecutorService executor;
    private final ReviewJobRepository jobRepo;
    private final ViolationRepository violationRepo;
    private final CheckstyleAnalyzer checkstyle;
    private final PmdAnalyzer pmd;

    public ReviewJob submitJob(ReviewRequestDTO request) {
        ReviewJob job = ReviewJob.builder()
                .submittedCode(request.getCode())
                .language(request.getLanguage())
                .status("PENDING")
                .build();
        
        job = jobRepo.save(job);
        
        UUID jobId = job.getId();
        executor.submit(() -> runAnalysis(jobId));
        
        return job;
    }

    private void runAnalysis(UUID jobId) {
        ReviewJob job = jobRepo.findById(jobId).orElseThrow();
        job.setStatus("RUNNING");
        jobRepo.save(job);

        try {
            // Write code to temp file
            Path tempDir = Files.createTempDirectory("codeguard-");
            String fileName = job.getLanguage().equalsIgnoreCase("java") ? "AnalysisTarget.java" : "AnalysisTarget.txt";
            Path tempFile = tempDir.resolve(fileName);
            Files.writeString(tempFile, job.getSubmittedCode());

            List<Violation> violations = new ArrayList<>();
            
            // Run Checkstyle
            try {
                violations.addAll(checkstyle.analyze(tempFile, jobId));
            } catch (Exception e) {
                log.error("Checkstyle analysis failed for job {}", jobId, e);
            }

            // Run PMD
            try {
                violations.addAll(pmd.analyze(tempFile, jobId));
            } catch (Exception e) {
                log.error("PMD analysis failed for job {}", jobId, e);
            }

            violationRepo.saveAll(violations);
            
            job.setTotalViolations(violations.size());
            job.setStatus("COMPLETED");
            job.setCompletedAt(LocalDateTime.now());
            
            // Cleanup
            Files.deleteIfExists(tempFile);
            Files.deleteIfExists(tempDir);

        } catch (IOException e) {
            log.error("IO error during analysis for job {}", jobId, e);
            job.setStatus("FAILED");
        } catch (Exception e) {
            log.error("Unexpected error during analysis for job {}", jobId, e);
            job.setStatus("FAILED");
        }

        jobRepo.save(job);
    }

    public ReviewJob getJob(UUID jobId) {
        return jobRepo.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public List<Violation> getViolations(UUID jobId) {
        return violationRepo.findByJobId(jobId);
    }
}
