//package com.ewu.matching.service.impl;
//
//import com.ewu.matching.dto.request.FacultyProfileRequest;
//import com.ewu.matching.dto.response.FacultyProfileResponse;
//import com.ewu.matching.entity.Faculty;
//import com.ewu.matching.mapper.ProfileMapper;
//import com.ewu.matching.repository.FacultyRepository;
//import com.ewu.matching.security.CurrentUserProvider;
//import com.ewu.matching.service.FacultyService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//@Service
//@RequiredArgsConstructor
//public class FacultyServiceImpl implements FacultyService {
//
//    private final FacultyRepository facultyRepository;
//    private final CurrentUserProvider currentUser;
//
//    @Override
//    @Transactional(readOnly = true)
//    public FacultyProfileResponse getMyProfile() {
//        return ProfileMapper.toFacultyProfile(currentUser.currentFaculty());
//    }
////
////    @Override
////@Transactional
////public FacultyProfileResponse updateMyProfile(FacultyProfileRequest req) {
////
////    Faculty f = currentUser.currentFaculty();
////
////    if (req.name() != null)
////        f.setName(req.name());
////
////    if (req.department() != null)
////        f.setDepartment(req.department());
////
////    if (req.designation() != null)
////        f.setDesignation(req.designation());
////
////    if (req.contactNumber() != null)
////        f.setContactNumber(req.contactNumber());
////
////    if (req.profilePicture() != null)
////        f.setProfilePicture(req.profilePicture());
////
////    if (req.coverPicture() != null)
////        f.setCoverPicture(req.coverPicture());
////
////    return ProfileMapper.toFacultyProfile(facultyRepository.save(f));
////}
//@Override
//@Transactional
//public FacultyProfileResponse updateMyProfile(
//        FacultyProfileRequest request
//) {
//    Faculty faculty =
//            currentUser.currentFaculty();
//
//    if (request.name() != null) {
//        faculty.setName(
//                request.name().trim()
//        );
//    }
//
//    if (request.department() != null) {
//        faculty.setDepartment(
//                normalize(request.department())
//        );
//    }
//
//    if (request.designation() != null) {
//        faculty.setDesignation(
//                normalize(request.designation())
//        );
//    }
//
//    if (request.bio() != null) {
//        faculty.setBio(
//                normalize(request.bio())
//        );
//    }
//
//    if (request.specialization() != null) {
//        faculty.setSpecialization(
//                normalize(
//                        request.specialization()
//                )
//        );
//    }
//
//    if (request.researchInterests() != null) {
//        faculty.setResearchInterests(
//                normalize(
//                        request.researchInterests()
//                )
//        );
//    }
//
//    if (request.contactNumber() != null) {
//        faculty.setContactNumber(
//                normalize(
//                        request.contactNumber()
//                )
//        );
//    }
//
//    if (request.university() != null) {
//        faculty.setUniversity(
//                normalize(request.university())
//        );
//    }
//
//    if (request.profilePicture() != null) {
//        faculty.setProfilePicture(
//                normalize(
//                        request.profilePicture()
//                )
//        );
//    }
//
//    if (request.coverPicture() != null) {
//        faculty.setCoverPicture(
//                normalize(
//                        request.coverPicture()
//                )
//        );
//    }
//
//    if (request.googleScholarUrl() != null) {
//        faculty.setGoogleScholarUrl(
//                normalize(
//                        request.googleScholarUrl()
//                )
//        );
//    }
//
//    if (request.orcidId() != null) {
//        faculty.setOrcidId(
//                normalize(request.orcidId())
//        );
//    }
//
//    if (request.researchgateUrl() != null) {
//        faculty.setResearchgateUrl(
//                normalize(
//                        request.researchgateUrl()
//                )
//        );
//    }
//
//    if (request.linkedinUrl() != null) {
//        faculty.setLinkedinUrl(
//                normalize(
//                        request.linkedinUrl()
//                )
//        );
//    }
//
//    if (
//            request.universityProfileUrl()
//                    != null
//    ) {
//        faculty.setUniversityProfileUrl(
//                normalize(
//                        request
//                                .universityProfileUrl()
//                )
//        );
//    }
//
//    Faculty saved =
//            facultyRepository.save(faculty);
//
//    return toFacultyProfileResponse(saved);
//}
//
//    private String normalize(String value) {
//        if (value == null) {
//            return null;
//        }
//
//        String trimmed = value.trim();
//
//        return trimmed.isEmpty()
//                ? null
//                : trimmed;
//    }
//}


package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.FacultyProfileRequest;
import com.ewu.matching.dto.response.FacultyProfileResponse;
import com.ewu.matching.entity.Faculty;
import com.ewu.matching.mapper.ProfileMapper;
import com.ewu.matching.repository.FacultyRepository;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FacultyServiceImpl
        implements FacultyService {

    private final FacultyRepository facultyRepository;
    private final CurrentUserProvider currentUser;

    @Override
    @Transactional(readOnly = true)
    public FacultyProfileResponse getMyProfile() {
        Faculty faculty =
                currentUser.currentFaculty();

        return ProfileMapper
                .toFacultyProfileResponse(
                        faculty
                );
    }

    @Override
    @Transactional
    public FacultyProfileResponse updateMyProfile(
            FacultyProfileRequest request
    ) {
        Faculty faculty =
                currentUser.currentFaculty();

        if (request.name() != null) {
            faculty.setName(
                    normalize(request.name())
            );
        }

        if (request.department() != null) {
            faculty.setDepartment(
                    normalize(
                            request.department()
                    )
            );
        }

        if (request.designation() != null) {
            faculty.setDesignation(
                    normalize(
                            request.designation()
                    )
            );
        }

        if (request.bio() != null) {
            faculty.setBio(
                    normalize(request.bio())
            );
        }

        if (request.specialization() != null) {
            faculty.setSpecialization(
                    normalize(
                            request.specialization()
                    )
            );
        }

        if (
                request.researchInterests()
                        != null
        ) {
            faculty.setResearchInterests(
                    normalize(
                            request
                                    .researchInterests()
                    )
            );
        }

        if (request.contactNumber() != null) {
            faculty.setContactNumber(
                    normalize(
                            request.contactNumber()
                    )
            );
        }

        if (request.university() != null) {
            faculty.setUniversity(
                    normalize(
                            request.university()
                    )
            );
        }

        if (
                request.profilePicture()
                        != null
        ) {
            faculty.setProfilePicture(
                    normalize(
                            request.profilePicture()
                    )
            );
        }

        if (
                request.coverPicture()
                        != null
        ) {
            faculty.setCoverPicture(
                    normalize(
                            request.coverPicture()
                    )
            );
        }

        if (
                request.googleScholarUrl()
                        != null
        ) {
            faculty.setGoogleScholarUrl(
                    normalize(
                            request
                                    .googleScholarUrl()
                    )
            );
        }

        if (request.orcidId() != null) {
            faculty.setOrcidId(
                    normalize(
                            request.orcidId()
                    )
            );
        }

        if (
                request.researchgateUrl()
                        != null
        ) {
            faculty.setResearchgateUrl(
                    normalize(
                            request
                                    .researchgateUrl()
                    )
            );
        }

        if (
                request.linkedinUrl()
                        != null
        ) {
            faculty.setLinkedinUrl(
                    normalize(
                            request.linkedinUrl()
                    )
            );
        }

        if (
                request.universityProfileUrl()
                        != null
        ) {
            faculty.setUniversityProfileUrl(
                    normalize(
                            request
                                    .universityProfileUrl()
                    )
            );
        }

        Faculty saved =
                facultyRepository.save(faculty);

        return ProfileMapper
                .toFacultyProfileResponse(
                        saved
                );
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();

        return trimmed.isEmpty()
                ? null
                : trimmed;
    }
}