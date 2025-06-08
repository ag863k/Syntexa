package com.syntexa.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "notes")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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

    public Long getId() {
        return id;
    }

    public void setApproachTitle(String approachTitle) {
        this.approachTitle = approachTitle;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setProblem(Problem problem) {
        this.problem = problem;
    }

    public void setAuthor(User author) {
        this.author = author;
    }
}
