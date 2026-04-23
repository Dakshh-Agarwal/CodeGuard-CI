package com.codeguard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "violations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Violation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID jobId;

    private String tool; // CHECKSTYLE, PMD

    private String severity; // ERROR, WARNING, INFO

    private String rule;

    @Column(columnDefinition = "TEXT")
    private String message;

    private Integer lineNumber;

    private String fileName;
}
