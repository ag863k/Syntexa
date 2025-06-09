package com.syntexa.api.service;

import com.syntexa.api.dto.NoteCreateRequest;
import com.syntexa.api.model.Note;
import com.syntexa.api.model.Problem;
import com.syntexa.api.model.User;
import com.syntexa.api.repository.NoteRepository;
import com.syntexa.api.repository.ProblemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

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
        newNote.setLanguage(request.getLanguage());
        newNote.setProblem(problem);
        newNote.setAuthor(author);

        Note savedNote = noteRepository.save(newNote);
        log.info("Note created successfully with ID: {}", savedNote.getId());
        return savedNote;
    }

    public Note updateNote(Long problemId, Long noteId, NoteCreateRequest request, User user) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found with id: " + problemId));
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + noteId));
        if (!note.getProblem().getId().equals(problem.getId())) {
            throw new IllegalArgumentException("Note does not belong to the specified problem.");
        }
        if (!note.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not the author of this note.");
        }
        note.setApproachTitle(request.getApproachTitle());
        note.setContent(request.getContent());
        note.setLanguage(request.getLanguage());
        return noteRepository.save(note);
    }

    public void deleteNote(Long problemId, Long noteId, User user) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found with id: " + problemId));
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + noteId));
        if (!note.getProblem().getId().equals(problem.getId())) {
            throw new IllegalArgumentException("Note does not belong to the specified problem.");
        }
        if (!note.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not the author of this note.");
        }
        noteRepository.delete(note);
    }

    public List<Note> getNotesByAuthor(User user) {
        return noteRepository.findAllByAuthor(user);
    }

    // Generate or return existing shareToken for a note (only by owner)
    public String generateShareToken(Long noteId, User user) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + noteId));
        if (!note.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not the author of this note.");
        }
        if (note.getShareToken() == null || note.getShareToken().isEmpty()) {
            // Generate a random, unguessable token
            String token = java.util.UUID.randomUUID().toString().replace("-", "");
            note.setShareToken(token);
            noteRepository.save(note);
        }
        return note.getShareToken();
    }

    // Get a note by shareToken (public, read-only)
    public Note getNoteByShareToken(String shareToken) {
        Note note = noteRepository.findByShareToken(shareToken);
        if (note == null) throw new IllegalArgumentException("Note not found for this share link.");
        return note;
    }
}