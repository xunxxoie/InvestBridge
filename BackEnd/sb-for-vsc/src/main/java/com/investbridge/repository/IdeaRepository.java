package com.investbridge.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.investbridge.model.Idea;
import com.investbridge.model.enums.IdeaCategory;

public interface IdeaRepository extends MongoRepository<Idea, String>{

    List<Idea> findByTitleContaining(String keyword);
    List<Idea> findByContentContaining(String keyword);

    List<Idea> findByIsContracted(boolean isContracted);
    List<Idea> findByCategories(IdeaCategory category);
}