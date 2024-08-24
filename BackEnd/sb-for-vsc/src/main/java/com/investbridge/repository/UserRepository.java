package com.investbridge.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;

import com.investbridge.model.db.User;
import com.investbridge.model.enums.UserRole;

public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByUserId(String userId);
    Optional<User> findByUserName(String userName);
    Optional<User> findByUserEmail(String userEmail);

    List<User> findByUserRole(UserRole userRole);

    @Query("{ 'id' : ?0 }")
    @Update("{ '$set' : { 'refreshToken' : ?1 }}")
    void saveRefreshToken(String userId, String refreshToken);

    // 추가
    long countByCreatedAtAfter(LocalDateTime createdAt);
    long countByUserRole(String UserRole);
}
