package com.syntexa.api.controller;

import com.syntexa.api.model.Note;
import com.syntexa.api.model.User;
import com.syntexa.api.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/problems/{problemId}/notes")
public class NoteController {

    private final NoteService noteService;

    @Autowired
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    /**
     * Endpoint to create a new note for a specified problem.
     *
     * @param problemId The ID of the problem to which the note will be added.
     * @param note      The note object containing note details.
     * @param user      The authenticated user (populated by Spring Security)
     * @return ResponseEntity with the created note or an error message.
     */
    @PostMapping
    public ResponseEntity<?> createNote(
            @PathVariable("problemId") Long problemId,
            @Valid @RequestBody Note note,
            @AuthenticationPrincipal User user
    ) {
        // Check that a user is authenticated.
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Unauthorized");
        }
        
        try {
            // Create the note using the NoteService.
            Note createdNote = noteService.createNote(problemId, note, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdNote);
        } catch (Exception e) {
            // Return an internal server error with the exception message.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("An error occurred while creating the note: " + e.getMessage());
        }
    }
}
