package com.codeguard.analyzer;

import com.codeguard.model.Violation;
import net.sourceforge.pmd.PMDConfiguration;
import net.sourceforge.pmd.PmdAnalysis;
import net.sourceforge.pmd.reporting.Report;
import net.sourceforge.pmd.reporting.RuleViolation;
import org.springframework.stereotype.Component;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class PmdAnalyzer {

    public List<Violation> analyze(Path filePath, UUID jobId) throws Exception {
        PMDConfiguration config = new PMDConfiguration();
        config.addRuleSet("category/java/errorprone.xml");
        config.addRuleSet("category/java/bestpractices.xml");
        config.setIgnoreIncrementalAnalysis(true); // Simplified for this use case

        List<Violation> violations = new ArrayList<>();

        try (PmdAnalysis pmd = PmdAnalysis.create(config)) {
            pmd.files().addFile(filePath);
            Report report = pmd.performAnalysisAndCollectReport();

            for (RuleViolation rv : report.getViolations()) {
                Violation v = Violation.builder()
                        .jobId(jobId)
                        .tool("PMD")
                        .rule(rv.getRule().getName())
                        .message(rv.getDescription())
                        .lineNumber(rv.getBeginLine())
                        .severity(rv.getRule().getPriority().getName().toUpperCase())
                        .fileName(rv.getFilename())
                        .build();
                violations.add(v);
            }
        }

        return violations;
    }
}
