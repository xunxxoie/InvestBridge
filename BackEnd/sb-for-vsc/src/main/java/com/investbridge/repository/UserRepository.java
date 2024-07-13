package com.investbridge.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.investbridge.model.User;

public interface UserRepository extends MongoRepository<User, String> {
}
