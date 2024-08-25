package com.investbridge.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.investbridge.model.db.Message;
@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByRoomIdOrderByTimestampAsc(String roomId);
    Message findTopByRoomIdOrderByTimestampDesc(String roomId);
}
