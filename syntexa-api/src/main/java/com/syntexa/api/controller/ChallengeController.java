package com.syntexa.api.controller;

import com.syntexa.api.model.Challenge;
import com.syntexa.api.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/challenges") 
public class ChallengeController {

    private final ChallengeService challengeService;

    @Autowired
    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @PostMapping
    public ResponseEntity<Challenge> createChallenge(@RequestBody Challenge challenge) {
        Challenge newChallenge = challengeService.createChallenge(challenge);
        return new ResponseEntity<>(newChallenge, HttpStatus.CREATED); // Status 201 Created
    }

    @GetMapping
    public List<Challenge> getAllChallenges() {
        return challengeService.getAllChallenges();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Challenge> getChallengeById(@PathVariable Long id) {
        return challengeService.getChallengeById(id)
                .map(challenge -> ResponseEntity.ok(challenge)) 
                .orElse(ResponseEntity.notFound().build()); 
    }

    @PutMapping("/{id}")
    public ResponseEntity<Challenge> updateChallenge(@PathVariable Long id, @RequestBody Challenge challengeDetails) {
        try {
            Challenge updatedChallenge = challengeService.updateChallenge(id, challengeDetails);
            return ResponseEntity.ok(updatedChallenge);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChallenge(@PathVariable Long id) {
        try {
            challengeService.deleteChallenge(id);
            return ResponseEntity.noContent().build(); // Status 204 No Content
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}