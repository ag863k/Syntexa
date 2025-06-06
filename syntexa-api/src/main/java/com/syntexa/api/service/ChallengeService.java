package com.syntexa.api.service;

import com.syntexa.api.model.Challenge;
import com.syntexa.api.repository.ChallengeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChallengeService {

    private final ChallengeRepository challengeRepository;

    @Autowired
    public ChallengeService(ChallengeRepository challengeRepository) {
        this.challengeRepository = challengeRepository;
    }

    
    public Challenge createChallenge(Challenge challenge) {
        
        return challengeRepository.save(challenge);
    }

    
    public List<Challenge> getAllChallenges() {
        return challengeRepository.findAll();
    }

    
    public Optional<Challenge> getChallengeById(Long id) {
        return challengeRepository.findById(id);
    }

    
    public Challenge updateChallenge(Long id, Challenge challengeDetails) {
        
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Challenge not found with id: " + id));

        
        challenge.setTitle(challengeDetails.getTitle());
        challenge.setDescription(challengeDetails.getDescription());
        challenge.setDifficulty(challengeDetails.getDifficulty());
        challenge.setSolution(challengeDetails.getSolution());

        
        return challengeRepository.save(challenge);
    }

    
    public void deleteChallenge(Long id) {
        
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Challenge not found with id: " + id));

        
        challengeRepository.delete(challenge);
    }
}