package com.investbridge.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.investbridge.model.Idea;
import com.investbridge.model.enums.IdeaCategory;

public interface IdeaRepository extends MongoRepository<Idea, String>{

    Optional<Idea> findByTitleContaining(String keyword);
    Optional<Idea> findByContentContaining(String keyword);

    Optional<Idea> findByIsContracted(boolean isContracted);
    Optional<Idea> findByCategories(IdeaCategory category);
}