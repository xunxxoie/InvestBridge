package com.investbridge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.investbridge.model.db.User;
import com.investbridge.model.enums.UserRole;

public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByUserId(String userId);
    Optional<User> findByUserName(String userName);
    Optional<User> findByUserEmail(String userEmail);

    List<User> findByUserRole(UserRole userRole);
}
