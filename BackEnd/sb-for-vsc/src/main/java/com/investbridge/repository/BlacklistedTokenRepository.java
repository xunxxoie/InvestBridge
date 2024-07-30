package com.investbridge.repository;

import java.util.Date;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.investbridge.model.BlacklistedToken;

public interface BlacklistedTokenRepository extends MongoRepository<BlacklistedToken, String> {
    boolean existsByToken(String token);
    void deleteByExpiryDateBefore(Date date);
}
