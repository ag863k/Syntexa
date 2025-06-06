package com.syntexa.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource; 

@SpringBootTest
@TestPropertySource(locations = "classpath:application-h2.properties")
class SyntexaApplicationTests {

    @Test
    void contextLoads() {
    }
}