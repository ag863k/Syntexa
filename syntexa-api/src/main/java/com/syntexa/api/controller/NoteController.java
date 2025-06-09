package com.syntexa.api.controller;

import com.syntexa.api.dto.UserProfileDTO;
import com.syntexa.api.model.Note;
import com.syntexa.api.model.User;
import com.syntexa.api.service.NoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    // Only allow logged-in users to get their own notes
    @GetMapping("/mine")
    public ResponseEntity<?> getMyNotes(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must be logged in to view your notes.");
        }
        return ResponseEntity.ok(noteService.getNotesByAuthor(user));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }
        // Only return safe user info
        return ResponseEntity.ok(new UserProfileDTO(user.getId(), user.getUsername(), user.getEmail()));
    }

    // --- SHARING ENDPOINT (public, read-only) ---
    @GetMapping("/shared/{shareToken}")
    public ResponseEntity<?> getSharedNote(@PathVariable String shareToken) {
        try {
            Note note = noteService.getNoteByShareToken(shareToken);
            // Only return safe fields (no author email, etc.)
            return ResponseEntity.ok(note);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }
}
