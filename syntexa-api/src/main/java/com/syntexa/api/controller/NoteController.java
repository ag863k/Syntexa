package com.syntexa.api.controller;

import com.syntexa.api.dto.NoteCreateRequest;
import com.syntexa.api.model.Note;
import com.syntexa.api.model.User;
import com.syntexa.api.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/problems/{problemId}/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
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
}
