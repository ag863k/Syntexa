package com.syntexa.api.service;

import com.syntexa.api.dto.NoteCreateRequest;
import com.syntexa.api.model.Note;
import com.syntexa.api.model.Problem;
import com.syntexa.api.model.User;
import com.syntexa.api.repository.NoteRepository;
import com.syntexa.api.repository.ProblemRepository;
import org.springframework.stereotype.Service;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final ProblemRepository problemRepository;

    public NoteService(NoteRepository noteRepository, ProblemRepository problemRepository) {
        this.noteRepository = noteRepository;
        this.problemRepository = problemRepository;
    }

    // Updated to use the DTO
    public Note createNote(Long problemId, NoteCreateRequest request, User author) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Error: Problem not found with id: " + problemId));

        Note newNote = new Note();
        newNote.setApproachTitle(request.getApproachTitle());
        newNote.setContent(request.getContent());
        newNote.setProblem(problem);
        newNote.setAuthor(author);

        return noteRepository.save(newNote);
    }
}