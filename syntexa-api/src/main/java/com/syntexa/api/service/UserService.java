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

@Service
public class UserService implements UserDetailsService {

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
        if (userRepository.existsByUsername(userToRegister.getUsername())) {
            throw new IllegalArgumentException("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(userToRegister.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }
        String hashedPassword = passwordEncoder.encode(userToRegister.getPassword());
        userToRegister.setPassword(hashedPassword);
        User savedUser = userRepository.save(userToRegister);
        createOrEnsureStarterProblemAndNote(savedUser);
        return savedUser;
    }

    public void createOrEnsureStarterProblemAndNote(User user) {
        String starterShareToken = "starter-note-" + user.getId();
        com.syntexa.api.model.Note existingStarter = noteRepository.findByShareToken(starterShareToken);
        if (existingStarter != null && existingStarter.getAuthor().getId().equals(user.getId())) {
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
        }
        if (existingStarter == null) {
            com.syntexa.api.model.Note starterNote = new com.syntexa.api.model.Note();
            starterNote.setApproachTitle("How to use Syntexa");
            starterNote.setContent("Welcome! Use Syntexa to save, organize, and share your coding notes and solutions. Start by creating a new problem and adding your own notes.");
            starterNote.setLanguage("markdown");
            starterNote.setShareToken(starterShareToken);
            starterNote.setProblem(starterProblem);
            starterNote.setAuthor(user);
            noteRepository.save(starterNote);
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }
}