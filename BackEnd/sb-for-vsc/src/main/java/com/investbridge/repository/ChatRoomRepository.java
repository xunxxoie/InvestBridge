package com.investbridge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.investbridge.model.db.ChatRoom;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    Optional<ChatRoom> findByInvestorIdAndDreamerId(String investorId, String dreamerId);
    List<ChatRoom> findByInvestorIdOrDreamerId(String investorId, String dreamerId);

}
