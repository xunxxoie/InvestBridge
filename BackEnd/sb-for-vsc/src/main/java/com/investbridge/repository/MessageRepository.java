package com.investbridge.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.investbridge.model.db.Messages;

public interface MessageRepository extends MongoRepository<Messages, String> {

}
