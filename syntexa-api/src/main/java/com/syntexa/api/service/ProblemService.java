package com.syntexa.api.service;

import com.syntexa.api.dto.ProblemCreateRequest;
import com.syntexa.api.model.Problem;
import com.syntexa.api.repository.ProblemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProblemService {

    private static final Logger log = LoggerFactory.getLogger(ProblemService.class);
    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    public List<Problem> getAllProblems() {
        log.info("Fetching all problems from the database.");
        return problemRepository.findAll();
    }

    public Optional<Problem> getProblemById(Long id) {
        log.info("Fetching problem with ID: {}", id);
        return problemRepository.findById(id);
    }

    public Problem createProblem(ProblemCreateRequest request) {
        log.info("Creating a new problem with title: {}", request.getTitle());
        Problem newProblem = new Problem();
        newProblem.setTitle(request.getTitle());
        newProblem.setDescription(request.getDescription());
        Problem savedProblem = problemRepository.save(newProblem);
        log.info("Problem created successfully with ID: {}", savedProblem.getId());
        return savedProblem;
    }
}