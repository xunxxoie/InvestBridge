package com.investbridge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.investbridge.model.db.ChatRoom;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    Optional<ChatRoom> findBySupporterIdAndDreamerId(String investorId, String dreamerId);
    List<ChatRoom> findBySupporterIdOrDreamerId(String investorId, String dreamerId);
}
