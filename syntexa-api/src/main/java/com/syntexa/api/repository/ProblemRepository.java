package com.syntexa.api.repository;

import com.syntexa.api.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for the Problem entity.
 * Provides standard CRUD operations as well as pagination and sorting for Problem entities.
 * Additional custom query methods can be declared in this interface if needed.
 */
@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    // Example custom query method:
    // Optional<Problem> findByTitle(String title);
}
