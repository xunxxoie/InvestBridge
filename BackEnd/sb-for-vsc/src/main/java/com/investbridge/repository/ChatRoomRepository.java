package com.investbridge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.investbridge.model.db.ChatRooms;

public interface ChatRoomRepository extends MongoRepository<ChatRooms, String> {
    Optional<List<ChatRooms>> findByMe(String userId);
    
}
