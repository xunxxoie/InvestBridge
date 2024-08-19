package com.investbridge.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.investbridge.model.db.Message;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByRoomIdOrderByTimestampAsc(String roomId);
    Message findTopByRoomIdOrderByTimestampDesc(String roomId);
}
