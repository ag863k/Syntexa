package com.syntexa.api.service;

import com.syntexa.api.model.Note;
import com.syntexa.api.model.Problem;
import com.syntexa.api.model.User;
import com.syntexa.api.repository.NoteRepository;
import com.syntexa.api.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final ProblemRepository problemRepository;

    @Autowired
    public NoteService(NoteRepository noteRepository, ProblemRepository problemRepository) {
        this.noteRepository = noteRepository;
        this.problemRepository = problemRepository;
    }

    public Note createNote(Long problemId, Note note, User author) {
        // Find the problem by its ID, or throw an exception if not found.
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found with id: " + problemId));

        // Link the note to the problem and the author
        note.setProblem(problem);
        note.setAuthor(author);

        // Save the new note to the database
        return noteRepository.save(note);
    }
}