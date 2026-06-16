package com.ewu.matching.service.impl;

import com.ewu.matching.dto.response.UserResponse;
import com.ewu.matching.entity.User;
import com.ewu.matching.enums.OpportunityType;
import com.ewu.matching.exception.ResourceNotFoundException;
import com.ewu.matching.mapper.ProfileMapper;
import com.ewu.matching.repository.InternshipRepository;
import com.ewu.matching.repository.ResearchOpportunityRepository;
import com.ewu.matching.repository.UserRepository;
import com.ewu.matching.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final InternshipRepository internshipRepository;
    private final ResearchOpportunityRepository researchRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> listUsers() {
        return userRepository.findAll().stream().map(ProfileMapper::toUserResponse).toList();
    }

    @Override
    @Transactional
    public UserResponse blockUser(Long userId) {
        return setBlocked(userId, true);
    }

    @Override
    @Transactional
    public UserResponse unblockUser(Long userId) {
        return setBlocked(userId, false);
    }

    private UserResponse setBlocked(Long userId, boolean blocked) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        user.setBlocked(blocked);
        return ProfileMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deletePost(OpportunityType type, Long postId) {
        if (type == OpportunityType.INTERNSHIP) {
            if (!internshipRepository.existsById(postId)) {
                throw ResourceNotFoundException.of("Internship", postId);
            }
            internshipRepository.deleteById(postId);
        } else {
            if (!researchRepository.existsById(postId)) {
                throw ResourceNotFoundException.of("Research opportunity", postId);
            }
            researchRepository.deleteById(postId);
        }
    }
}
