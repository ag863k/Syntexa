package com.syntexa.api.dto;

import jakarta.validation.constraints.NotBlank;

public class NoteCreateRequest {

    @NotBlank(message = "Approach title cannot be blank")
    private String approachTitle;

    @NotBlank(message = "Content cannot be blank")
    private String content;

    private String language;

    // --- GETTERS AND SETTERS ---
    public String getApproachTitle() { return approachTitle; }
    public void setApproachTitle(String approachTitle) { this.approachTitle = approachTitle; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}