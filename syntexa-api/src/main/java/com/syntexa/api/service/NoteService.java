package com.syntexa.api.service;

import com.syntexa.api.model.Note;
import com.syntexa.api.model.Problem;
import com.syntexa.api.model.User;
import com.syntexa.api.repository.NoteRepository;
import com.syntexa.api.repository.ProblemRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final ProblemRepository problemRepository;

    @Autowired
    public NoteService(NoteRepository noteRepository, ProblemRepository problemRepository) {
        this.noteRepository = noteRepository;
        this.problemRepository = problemRepository;
    }

    /**
     * Creates a new note for the specified problem with the given author.
     *
     * @param problemId the ID of the problem to which the note will be linked
     * @param note the note details including content and metadata
     * @param author the user creating the note
     * @return the saved Note object
     * @throws ResponseStatusException if the problem with the given ID is not found
     */
    @Transactional
    public Note createNote(Long problemId, Note note, User author) {
        // Find the problem by its ID. If not present, throw a NOT_FOUND exception.
        Problem problem = problemRepository.findById(problemId)
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found with id: " + problemId)
            );

        // Link the note to the retrieved problem and assign the author.
        note.setProblem(problem);
        note.setAuthor(author);

        // Save and return the note.
        return noteRepository.save(note);
    }
}
