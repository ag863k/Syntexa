package com.syntexa.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProblemCreateRequest {

    @NotBlank(message = "Title cannot be blank")
    @Size(max = 255)
    private String title;

    @Size(max = 5000)
    private String description;

    // --- GETTERS AND SETTERS ---
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}