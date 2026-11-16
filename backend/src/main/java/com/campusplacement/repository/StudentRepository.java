package com.campusplacement.repository;

import com.campusplacement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(path = "students-rest", collectionResourceRel = "students")
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByUserId(Long userId);
    
    Optional<Student> findByStudentIdNum(String studentIdNum);
    
    @RestResource(path = "by-department", rel = "byDepartment")
    List<Student> findByDepartment(String department);
    
    @RestResource(path = "by-cgpa-gte", rel = "byCgpaGte")
    List<Student> findByCgpaGreaterThanEqual(Double minCgpa);

    List<Student> findByGraduationYear(Integer graduationYear);
}

