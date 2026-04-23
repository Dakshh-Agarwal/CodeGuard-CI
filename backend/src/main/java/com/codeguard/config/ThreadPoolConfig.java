package com.codeguard.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class ThreadPoolConfig {

    @Value("${codeguard.thread-pool.size:10}")
    private int poolSize;

    @Bean
    public ExecutorService analysisExecutor() {
        return Executors.newFixedThreadPool(poolSize);
    }
}
