package com.syntexa.api.service;

import com.syntexa.api.model.User;
import com.syntexa.api.repository.UserRepository;
import com.syntexa.api.repository.ProblemRepository;
import com.syntexa.api.repository.NoteRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProblemRepository problemRepository;
    private final NoteRepository noteRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, ProblemRepository problemRepository, NoteRepository noteRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.problemRepository = problemRepository;
        this.noteRepository = noteRepository;
    }

    public User registerUser(User userToRegister) {
        log.info("Registering a new user with username: {}", userToRegister.getUsername());
        if (userRepository.existsByUsername(userToRegister.getUsername())) {
            log.error("Username is already taken: {}", userToRegister.getUsername());
            throw new IllegalArgumentException("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(userToRegister.getEmail())) {
            log.error("Email is already in use: {}", userToRegister.getEmail());
            throw new IllegalArgumentException("Error: Email is already in use!");
        }
        String hashedPassword = passwordEncoder.encode(userToRegister.getPassword());
        userToRegister.setPassword(hashedPassword);
        User savedUser = userRepository.save(userToRegister);
        log.info("User registered successfully with ID: {}", savedUser.getId());
        // --- PROFESSIONAL STARTER PROBLEM & NOTE ---
        createOrEnsureStarterProblemAndNote(savedUser);
        return savedUser;
    }

    /**
     * Ensures the user has a professional, non-deletable starter problem and note.
     * If missing, creates them. Existing users will get it if not present.
     */
    public void createOrEnsureStarterProblemAndNote(User user) {
        // Check if user already has the starter note (by shareToken)
        com.syntexa.api.model.Note existingStarter = noteRepository.findByShareToken("starter-note");
        if (existingStarter != null && existingStarter.getAuthor().getId().equals(user.getId())) {
            // Starter note already exists for this user, do nothing
            return;
        }
        // Check if the starter problem already exists
        String starterTitle = "Welcome to Syntexa: Your Coding Notes Hub";
        com.syntexa.api.model.Problem starterProblem = problemRepository.findAll().stream()
            .filter(p -> starterTitle.equals(p.getTitle()))
            .findFirst()
            .orElse(null);
        if (starterProblem == null) {
            starterProblem = new com.syntexa.api.model.Problem();
            starterProblem.setTitle(starterTitle);
            starterProblem.setDescription("This is your starter problem. Here you can see how notes work. You can always add your own problems and notes. This starter note cannot be deleted, but you can edit it to try out the editor.");
            starterProblem = problemRepository.save(starterProblem);
        }
        // Create a professional starter note
        com.syntexa.api.model.Note starterNote = new com.syntexa.api.model.Note();
        starterNote.setApproachTitle("Starter Note");
        starterNote.setContent("Welcome! This is your first note. You can edit this note, but you cannot delete it. Try adding your own notes and problems!");
        starterNote.setLanguage("markdown");
        starterNote.setShareToken("starter-note");
        starterNote.setProblem(starterProblem);
        starterNote.setAuthor(user);
        noteRepository.save(starterNote);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Loading user by username: {}", username);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("User not found with username: {}", username);
                    return new UsernameNotFoundException("User not found with username: " + username);
                });
    }
}