package com.syntexa.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Represents a Note associated with a Problem along with the approach details and content.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notes")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The title describing the approach used in this note.
     */
    @Column(nullable = false)
    private String approachTitle; 

    /**
     * Detailed content (text) of the note.
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content; 

    /**
     * Associated problem to which the note belongs.
     * The JSON serialization ignores the "notes" property in Problem to prevent circular references.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    @JsonIgnoreProperties("notes")
    private Problem problem;

    /**
     * The author (user) of this note.
     * Only selective properties of the User are exposed for security reasons.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({
        "email",
        "password",
        "enabled",
        "accountNonExpired",
        "credentialsNonExpired",
        "accountNonLocked",
        "authorities"})
    private User author;
}
