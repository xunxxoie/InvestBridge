package com.investbridge.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.investbridge.model.PatchNote;

public interface PatchNoteRepository extends MongoRepository<PatchNote, String> {
    Optional<PatchNote> findByVersion(String version);
}
