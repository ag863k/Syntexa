package com.syntexa.api.service;

import com.syntexa.api.dto.NoteCreateRequest;
import com.syntexa.api.model.Note;
import com.syntexa.api.model.Problem;
import com.syntexa.api.model.User;
import com.syntexa.api.repository.NoteRepository;
import com.syntexa.api.repository.ProblemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NoteService {

    private static final Logger log = LoggerFactory.getLogger(NoteService.class);

    private final NoteRepository noteRepository;
    private final ProblemRepository problemRepository;

    public NoteService(NoteRepository noteRepository, ProblemRepository problemRepository) {
        this.noteRepository = noteRepository;
        this.problemRepository = problemRepository;
    }

    public Note createNote(Long problemId, NoteCreateRequest request, User author) {
        log.info("Creating a new note for problem ID: {}", problemId);
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> {
                    log.error("Problem not found with ID: {}", problemId);
                    return new RuntimeException("Error: Problem not found with id: " + problemId);
                });

        Note newNote = new Note();
        newNote.setApproachTitle(request.getApproachTitle());
        newNote.setContent(request.getContent());
        newNote.setProblem(problem);
        newNote.setAuthor(author);

        Note savedNote = noteRepository.save(newNote);
        log.info("Note created successfully with ID: {}", savedNote.getId());
        return savedNote;
    }
}