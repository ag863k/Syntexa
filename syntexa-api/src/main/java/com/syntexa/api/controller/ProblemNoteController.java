package com.syntexa.api.controller;

import com.syntexa.api.dto.NoteCreateRequest;
import com.syntexa.api.model.Note;
import com.syntexa.api.model.User;
import com.syntexa.api.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/problems/{problemId}/notes")
public class ProblemNoteController {
    private final NoteService noteService;

    public ProblemNoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping
    public ResponseEntity<?> createNote(
            @PathVariable Long problemId,
            @Valid @RequestBody NoteCreateRequest request,
            @AuthenticationPrincipal User user
    ) {
        try {
            Note createdNote = noteService.createNote(problemId, request, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdNote);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    @PutMapping("/{noteId}")
    public ResponseEntity<?> updateNote(
            @PathVariable Long problemId,
            @PathVariable Long noteId,
            @Valid @RequestBody NoteCreateRequest request,
            @AuthenticationPrincipal User user
    ) {
        try {
            Note updated = noteService.updateNote(problemId, noteId, request, user);
            return ResponseEntity.ok(updated);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not the author of this note.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<?> deleteNote(
            @PathVariable Long problemId,
            @PathVariable Long noteId,
            @AuthenticationPrincipal User user
    ) {
        try {
            noteService.deleteNote(problemId, noteId, user);
            return ResponseEntity.ok().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not the author of this note.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    // --- SHARING ENDPOINTS ---
    @PostMapping("/{noteId}/share")
    public ResponseEntity<?> shareNote(
            @PathVariable Long problemId,
            @PathVariable Long noteId,
            @AuthenticationPrincipal User user
    ) {
        try {
            String shareToken = noteService.generateShareToken(noteId, user);
            String shareUrl = String.format("/api/v1/notes/shared/%s", shareToken);
            return ResponseEntity.ok().body(shareUrl);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not the author of this note.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }
}
