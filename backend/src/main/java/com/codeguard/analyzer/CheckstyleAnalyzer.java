package com.codeguard.analyzer;

import com.codeguard.model.Violation;
import com.puppycrawl.tools.checkstyle.Checker;
import com.puppycrawl.tools.checkstyle.ConfigurationLoader;
import com.puppycrawl.tools.checkstyle.PropertiesExpander;
import com.puppycrawl.tools.checkstyle.api.AuditEvent;
import com.puppycrawl.tools.checkstyle.api.AuditListener;
import com.puppycrawl.tools.checkstyle.api.Configuration;
import org.springframework.stereotype.Component;
import java.io.File;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

@Component
public class CheckstyleAnalyzer {

    public List<Violation> analyze(Path filePath, UUID jobId) throws Exception {
        // Load configuration from resources
        Configuration config = ConfigurationLoader.loadConfiguration(
            "checkstyle/google_checks.xml",
            new PropertiesExpander(System.getProperties())
        );

        Checker checker = new Checker();
        checker.setModuleClassLoader(Checker.class.getClassLoader());
        checker.configure(config);

        List<Violation> violations = new ArrayList<>();

        checker.addListener(new AuditListener() {
            @Override
            public void addError(AuditEvent event) {
                Violation v = Violation.builder()
                        .jobId(jobId)
                        .tool("CHECKSTYLE")
                        .rule(event.getSourceName())
                        .message(event.getMessage())
                        .lineNumber(event.getLine())
                        .severity(event.getSeverityLevel().getName().toUpperCase())
                        .fileName(event.getFileName())
                        .build();
                violations.add(v);
            }

            @Override public void auditStarted(AuditEvent event) {}
            @Override public void auditFinished(AuditEvent event) {}
            @Override public void fileStarted(AuditEvent event) {}
            @Override public void fileFinished(AuditEvent event) {}
            @Override public void addException(AuditEvent event, Throwable throwable) {}
        });

        checker.process(List.of(filePath.toFile()));
        checker.destroy();
        
        return violations;
    }
}
