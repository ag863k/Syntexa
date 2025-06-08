package com.syntexa.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Entity
@Table(name = "problems")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("problem")
    private List<Note> notes = new ArrayList<>();

    // Added missing methods to resolve compilation issues
    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getId() {
        return this.id;
    }
}