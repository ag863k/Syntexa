package com.syntexa.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class SyntexaApplication {

    private static final Logger log = LoggerFactory.getLogger(SyntexaApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(SyntexaApplication.class, args);
        log.info("Syntexa API has started successfully.");
    }
}