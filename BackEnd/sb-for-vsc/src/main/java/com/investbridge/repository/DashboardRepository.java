package com.investbridge.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.investbridge.model.db.Dashboard;

@Repository
public interface DashboardRepository extends MongoRepository<Dashboard, String> {
    @Query(sort = "{ 'updatedAt': -1 }")
    Dashboard findTopByOrderByUpdatedAtDesc();
}
