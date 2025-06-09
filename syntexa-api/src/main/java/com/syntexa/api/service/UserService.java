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
        String starterShareToken = "starter-note-" + user.getId();
        com.syntexa.api.model.Note existingStarter = noteRepository.findByShareToken(starterShareToken);
        if (existingStarter != null && existingStarter.getAuthor().getId().equals(user.getId())) {
            log.info("Starter note already exists for user {}", user.getId());
            return;
        }
        String starterTitle = "Welcome to Syntexa: Your Coding Notes Hub";
        com.syntexa.api.model.Problem starterProblem = problemRepository.findAll().stream()
            .filter(p -> starterTitle.equals(p.getTitle()))
            .findFirst()
            .orElse(null);
        if (starterProblem == null) {
            starterProblem = new com.syntexa.api.model.Problem();
            starterProblem.setTitle(starterTitle);
            starterProblem.setDescription("Get started by creating your first coding note! This starter problem is shared by all users.");
            starterProblem = problemRepository.save(starterProblem);
            log.info("Created global starter problem with id {}", starterProblem.getId());
        }
        // Only create the starter note if it does not exist for this user
        if (existingStarter == null) {
            com.syntexa.api.model.Note starterNote = new com.syntexa.api.model.Note();
            starterNote.setApproachTitle("How to use Syntexa");
            starterNote.setContent("Welcome! Use Syntexa to save, organize, and share your coding notes and solutions. Start by creating a new problem and adding your own notes.");
            starterNote.setLanguage("markdown");
            starterNote.setShareToken(starterShareToken);
            starterNote.setProblem(starterProblem);
            starterNote.setAuthor(user);
            noteRepository.save(starterNote);
            log.info("Created starter note for user {}", user.getId());
        }
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