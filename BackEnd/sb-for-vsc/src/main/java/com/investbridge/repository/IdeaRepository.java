package com.investbridge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.investbridge.model.db.Idea;
import com.investbridge.model.enums.IdeaCategory;

public interface IdeaRepository extends MongoRepository<Idea, String>{

    Optional<Idea> findByTitleContaining(String keyword);
    Optional<Idea> findByContentContaining(String keyword);

    Optional<List<Idea>> findByUserName(String userName);

    Optional<Idea> findByIsContracted(boolean isContracted);
    Optional<Idea> findByCategories(IdeaCategory category);

    long countByIsContracted(boolean isContracted); // 추가
    
}