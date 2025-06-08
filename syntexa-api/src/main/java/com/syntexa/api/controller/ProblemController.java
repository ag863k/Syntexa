package com.syntexa.api.controller;

import com.syntexa.api.dto.ProblemCreateRequest;
import com.syntexa.api.model.Problem;
import com.syntexa.api.service.ProblemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        try {
            List<Problem> problems = problemService.getAllProblems();
            return ResponseEntity.ok(problems);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Problem> getProblemById(@PathVariable Long id) {
        return problemService.getProblemById(id)
                .map(problem -> ResponseEntity.ok(problem))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));
    }

    @PostMapping
    public ResponseEntity<?> createProblem(@Valid @RequestBody ProblemCreateRequest request) {
        try {
            Problem createdProblem = problemService.createProblem(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProblem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}