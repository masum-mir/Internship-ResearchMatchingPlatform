package com.ewu.matching.service;

import com.ewu.matching.dto.response.*;
import java.util.List;

public interface NetworkService {
    ConnectionResponse requestConnection(Long userId);

    ConnectionResponse accept(Long id);

    ConnectionResponse reject(Long id);

    void removeConnection(Long id);

    void block(Long userId);

    void unblock(Long userId);

    List<ConnectionResponse> connections();

    List<ConnectionResponse> pendingReceived();

    List<ConnectionResponse> pendingSent();

    FollowResponse follow(Long userId);

    void unfollow(Long userId);

    List<FollowResponse> followers();

    List<FollowResponse> following();
}
