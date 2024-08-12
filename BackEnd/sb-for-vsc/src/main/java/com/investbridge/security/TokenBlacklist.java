package com.investbridge.security;

import java.util.Date;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.investbridge.model.db.BlacklistedToken;
import com.investbridge.repository.BlacklistedTokenRepository;

@Component
public class TokenBlacklist {
    
    private BlacklistedTokenRepository blacklistedTokenRepository;
    private JwtTokenProvider jwtTokenProvider;
    
    public TokenBlacklist(BlacklistedTokenRepository blacklistedTokenRepository, JwtTokenProvider jwtTokenProvider) {
        this.blacklistedTokenRepository = blacklistedTokenRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public void addToBlacklist(String token){
        Date expiryDate = jwtTokenProvider.getEpirationDateFromToken(token);
        BlacklistedToken blacklistedToken = new BlacklistedToken();
        blacklistedToken.setToken(token);
        blacklistedToken.setExpiryDate(expiryDate);
        blacklistedTokenRepository.save(blacklistedToken);
    }

    public boolean isBlacklisted(String token){
        return blacklistedTokenRepository.existsByToken(token);
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanupBlacklist(){
        blacklistedTokenRepository.deleteByExpiryDateBefore(new Date());
    }
}
