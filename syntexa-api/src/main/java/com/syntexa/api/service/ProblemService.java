package com.syntexa.api.service;

import com.syntexa.api.dto.ProblemCreateRequest;
import com.syntexa.api.model.Problem;
import com.syntexa.api.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;

    @Autowired
    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    public Optional<Problem> getProblemById(Long id) {
        return problemRepository.findById(id);
    }

    // Updated to use the DTO
    public Problem createProblem(ProblemCreateRequest request) {
        Problem newProblem = new Problem();
        newProblem.setTitle(request.getTitle());
        newProblem.setDescription(request.getDescription());
        return problemRepository.save(newProblem);
    }
}