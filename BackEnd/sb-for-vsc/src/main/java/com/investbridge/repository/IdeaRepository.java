package com.investbridge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.investbridge.model.db.Idea;
import com.investbridge.model.enums.IdeaCategory;
@Repository
public interface IdeaRepository extends MongoRepository<Idea, String>{

    Optional<Idea> findByTitleContaining(String keyword);
    Optional<Idea> findByContentContaining(String keyword);

    Optional<List<Idea>> findByUserId(String userId);

    Optional<Idea> findByIsContracted(boolean isContracted);
    Optional<Idea> findByCategories(IdeaCategory category);

    long countByIsContracted(boolean isContracted); // 추가
    @Query("{}")
    List<Idea> findTop5Ideas();
    
}