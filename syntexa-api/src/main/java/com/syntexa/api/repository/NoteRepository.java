package com.syntexa.api.repository;

import com.syntexa.api.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for the Note entity.
 * Provides CRUD operations and custom queries specific to notes.
 */
@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    // Add custom query methods here if needed in the future.
}
