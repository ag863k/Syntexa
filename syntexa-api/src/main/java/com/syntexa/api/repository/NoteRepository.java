package com.syntexa.api.repository;

import com.syntexa.api.model.Note;
import com.syntexa.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    // Add custom query methods if needed in the future
    List<Note> findAllByAuthor(User author);
    Note findByShareToken(String shareToken);
}