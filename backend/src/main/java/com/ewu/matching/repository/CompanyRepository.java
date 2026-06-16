package com.ewu.matching.repository;

import com.ewu.matching.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByUser_Id(Long userId);

    Optional<Company> findByUser_Email(String email);
}
