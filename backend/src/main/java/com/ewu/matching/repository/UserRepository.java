package com.ewu.matching.repository;

import com.ewu.matching.entity.User;
import com.ewu.matching.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRoles_Name(RoleType name);

    List<User> findByRoles_Name(RoleType name);
}
