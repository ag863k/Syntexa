package com.syntexa.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "notes")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String approachTitle;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    @JsonIgnoreProperties("notes")
    private Problem problem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"notes", "email", "password", "enabled", "accountNonExpired", "credentialsNonExpired", "accountNonLocked", "authorities"})
    private User author;

    // --- GETTERS AND SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getApproachTitle() { return approachTitle; }
    public void setApproachTitle(String approachTitle) { this.approachTitle = approachTitle; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
}
