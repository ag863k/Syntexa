package com.syntexa.api.repository;

import com.syntexa.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for the User entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Retrieves a User by its username.
     *
     * @param username the username to search for.
     * @return an Optional containing the User if found.
     */
    Optional<User> findByUsername(String username);

    /**
     * Retrieves a User by its email.
     *
     * @param email the email to search for.
     * @return an Optional containing the User if found.
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks whether a user exists with the given username.
     *
     * @param username the username to check.
     * @return true if a user exists with the provided username, false otherwise.
     */
    Boolean existsByUsername(String username);

    /**
     * Checks whether a user exists with the given email.
     *
     * @param email the email to check.
     * @return true if a user exists with the provided email, false otherwise.
     */
    Boolean existsByEmail(String email);
}
