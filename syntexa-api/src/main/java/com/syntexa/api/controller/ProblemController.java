package com.syntexa.api.controller;

import com.syntexa.api.model.Problem;
import com.syntexa.api.service.ProblemService;
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

    @GetMapping
    public List<Problem> getAllProblems() {
        return problemService.getAllProblems();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Problem> getProblemById(@PathVariable Long id) {
        return problemService.getProblemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint to create a new problem
    @PostMapping
    public ResponseEntity<Problem> createProblem(@RequestBody Problem problem) {
        Problem createdProblem = problemService.createProblem(problem);
        return new ResponseEntity<>(createdProblem, HttpStatus.CREATED);
    }
}