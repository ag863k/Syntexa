package com.syntexa.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-h2.properties")
class SyntexaApplicationTests {

    @Test
    void contextLoads() {
        assertTrue(true, "Context loads successfully.");
    }

    @Test
    void applicationStarts() {
        SyntexaApplication.main(new String[] {});
        assertTrue(true, "Application starts successfully.");
    }
}