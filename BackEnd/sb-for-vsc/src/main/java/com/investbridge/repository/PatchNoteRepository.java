package com.investbridge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.investbridge.model.db.PatchNote;

public interface PatchNoteRepository extends MongoRepository<PatchNote, String> {
    Optional<PatchNote> findByVersion(String version);

    @Query(value = "{}", fields = "{ 'version' : 1, '_id' : 0}")
    List<String> findAllVersions();
}
