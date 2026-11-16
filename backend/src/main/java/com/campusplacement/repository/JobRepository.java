package com.campusplacement.repository;

import com.campusplacement.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;

@RepositoryRestResource(path = "jobs-rest", collectionResourceRel = "jobs")
public interface JobRepository extends JpaRepository<Job, Long> {

    @RestResource(path = "by-title", rel = "byTitle")
    List<Job> findByTitleContainingIgnoreCase(String title);

    @RestResource(path = "active", rel = "activeJobs")
    List<Job> findByIsActiveTrue();

    List<Job> findByMinCgpaLessThanEqualAndIsActiveTrue(Double cgpa);

    List<Job> findByCompanyContainingIgnoreCase(String company);
}

