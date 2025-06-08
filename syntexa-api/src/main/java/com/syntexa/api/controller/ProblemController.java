package com.syntexa.api.controller;

import com.syntexa.api.model.Problem;
import com.syntexa.api.service.ProblemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/problems")
public class ProblemController {

    private final ProblemService problemService;

    @Autowired
    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    /**
     * Retrieves a list of all problems.
     *
     * @return ResponseEntity containing the list of problems or a 500 error in case of failure.
     */
    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        try {
            List<Problem> problems = problemService.getAllProblems();
            return ResponseEntity.ok(problems);
        } catch (Exception e) {
            // Optional: log the error for debugging purposes
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Retrieves a problem by its ID.
     *
     * @param id the ID of the problem to retrieve.
     * @return ResponseEntity containing the problem if found, or a 404 status if not found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Problem> getProblemById(@PathVariable("id") Long id) {
        return problemService.getProblemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Creates a new problem.
     *
     * @param problem the problem object to be created (validated with @Valid).
     * @return ResponseEntity containing the created problem with HTTP 201 status,
     *         or a 500 status in case of failure.
     */
    @PostMapping
    public ResponseEntity<Problem> createProblem(@Valid @RequestBody Problem problem) {
        try {
            Problem createdProblem = problemService.createProblem(problem);
            return new ResponseEntity<>(createdProblem, HttpStatus.CREATED);
        } catch (Exception e) {
            // Optional: log the exception for troubleshooting
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
