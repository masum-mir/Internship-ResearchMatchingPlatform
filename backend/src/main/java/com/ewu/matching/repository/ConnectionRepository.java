package com.ewu.matching.repository;

import com.ewu.matching.entity.Connection;
import com.ewu.matching.enums.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    @Query("select c from Connection c where (c.requester.id=:a and c.addressee.id=:b) or (c.requester.id=:b and c.addressee.id=:a)")
    Optional<Connection> findBetween(@Param("a") Long a, @Param("b") Long b);

    @Query("select case when count(c)>0 then true else false end from Connection c where c.status=com.ewu.matching.enums.ConnectionStatus.ACCEPTED and ((c.requester.id=:a and c.addressee.id=:b) or (c.requester.id=:b and c.addressee.id=:a))")
    boolean areConnected(@Param("a") Long a, @Param("b") Long b);

    @Query("select case when count(c)>0 then true else false end from Connection c where c.status=com.ewu.matching.enums.ConnectionStatus.BLOCKED and ((c.requester.id=:a and c.addressee.id=:b) or (c.requester.id=:b and c.addressee.id=:a))")
    boolean areBlocked(@Param("a") Long a, @Param("b") Long b);

    List<Connection> findByAddressee_IdAndStatusOrderByRequestedAtDesc(Long addresseeId, ConnectionStatus status);

    List<Connection> findByRequester_IdAndStatusOrderByRequestedAtDesc(Long requesterId, ConnectionStatus status);

    @Query("select c from Connection c where c.status=com.ewu.matching.enums.ConnectionStatus.ACCEPTED and (c.requester.id=:userId or c.addressee.id=:userId) order by c.respondedAt desc")
    List<Connection> findAcceptedForUser(@Param("userId") Long userId);

    @Query("select count(c) from Connection c where c.status=com.ewu.matching.enums.ConnectionStatus.ACCEPTED and (c.requester.id=:userId or c.addressee.id=:userId)")
    long countAcceptedForUser(@Param("userId") Long userId);
}
