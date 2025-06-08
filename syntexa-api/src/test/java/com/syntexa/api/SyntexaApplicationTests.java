package com.syntexa.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")  // Activates application-test.properties
public class SyntexaApplicationTests {

    @Test
    void applicationStarts() {
        // Just ensures context loads
    }

}
