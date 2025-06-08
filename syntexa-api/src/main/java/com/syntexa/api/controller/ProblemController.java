package com.syntexa.api.controller;

import com.syntexa.api.dto.ProblemCreateRequest;
import com.syntexa.api.model.Problem;
import com.syntexa.api.service.ProblemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/problems")
public class ProblemController {

    private final ProblemService problemService;

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

    @PostMapping
    public ResponseEntity<Problem> createProblem(@Valid @RequestBody ProblemCreateRequest request) {
        Problem createdProblem = problemService.createProblem(request);
        return new ResponseEntity<>(createdProblem, HttpStatus.CREATED);
    }
}