package com.syntexa.api.repository;

import com.syntexa.api.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    // Add custom query methods if needed in the future
}