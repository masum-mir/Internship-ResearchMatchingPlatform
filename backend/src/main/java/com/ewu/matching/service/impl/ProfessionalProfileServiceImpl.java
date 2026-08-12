package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.*;
import com.ewu.matching.dto.response.*;
import com.ewu.matching.entity.*;
import com.ewu.matching.exception.*;
import com.ewu.matching.mapper.ProfileMapper;
import com.ewu.matching.repository.*;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProfessionalProfileServiceImpl implements ProfessionalProfileService {
        private final UserRepository userRepository;
        private final StudentRepository studentRepository;
        private final FacultyRepository facultyRepository;
        private final CompanyRepository companyRepository;
        private final EducationRepository educationRepository;
        private final ExperienceRepository experienceRepository;
        private final UserFollowRepository followRepository;
        private final ConnectionRepository connectionRepository;
        private final CurrentUserProvider currentUser;
        private final ProfileLookupService profileLookup;
        private final UserVisibilityService userVisibility;

        // @Override @Transactional(readOnly=true)
        // public PublicProfileResponse publicProfile(Long userId){User
        // u=userRepository.findById(userId).orElseThrow(() ->
        // ResourceNotFoundException.of("User",userId));if(u.isBlocked()||!u.isEnabled())throw
        // ResourceNotFoundException.of("User",userId);ProfileSummaryResponse
        // s=profileLookup.summary(u);String bio=null,cover=null,website=null;boolean
        // open=false,supervision=false,verified=false;List<SkillResponse>
        // skills=List.of();
        // Student
        // st=studentRepository.findByUser_Id(userId).orElse(null);if(st!=null){Student
        // d=studentRepository.findWithDetailsById(st.getId()).orElse(st);bio=d.getBio();cover=d.getCoverPicture();website=d.getPortfolioUrl();open=d.isOpenToWork();skills=ProfileMapper.toSkillList(d.getSkills());}
        // Faculty
        // f=facultyRepository.findByUser_Id(userId).orElse(null);if(f!=null){bio=f.getBio();cover=f.getCoverPicture();website=f.getUniversityProfileUrl();supervision=f.isAvailableForSupervision();}
        // Company
        // c=companyRepository.findByUser_Id(userId).orElse(null);if(c!=null){bio=c.getDescription();cover=c.getCoverPicture();website=c.getWebsite();verified=c.isVerified();}
        // return new
        // PublicProfileResponse(s,bio,cover,website,open,supervision,verified,skills,education(userId),experience(userId),followRepository.countByFollowing_Id(userId),connectionRepository.countAcceptedForUser(userId));}
        //
        @Override
        @Transactional(readOnly = true)
        public PublicProfileResponse publicProfile(Long userId) {

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));

                if (user.isBlocked() || !user.isEnabled()) {
                        throw ResourceNotFoundException.of("User", userId);
                }
                userVisibility.requirePublicUser(user);

                // ================= COMMON =================
                String role = null;
                String name = null;
                String headline = null;
                String bio = null;
                String profilePicture = null;
                String coverPicture = null;

                // ================= STUDENT =================
                String university = null;
                String department = null;
                String batch = null;
                String studentId = null;
                java.math.BigDecimal cgpa = null;
                String contactNumber = null;
                String address = null;
                String resumeUrl = null;
                String portfolioUrl = null;
                String githubUrl = null;
                String linkedinUrl = null;
                Boolean openToWork = false;

                List<SkillResponse> skills = List.of();
                List<ProjectResponse> projects = List.of();
                List<CertificationResponse> certifications = List.of();

                // ================= FACULTY =================
                String designation = null;
                String specialization = null;
                String researchInterests = null;
                String location = null;
                String googleScholarUrl = null;
                String orcidId = null;
                String researchgateUrl = null;
                String universityProfileUrl = null;
                Boolean availableForSupervision = false;

                // ================= COMPANY =================
                String companyName = null;
                String description = null;
                String website = null;
                String industry = null;
                String companySize = null;
                java.time.LocalDate foundedDate = null;
                String companyEmail = null;
                Boolean verified = false;

                // =====================================================
                // STUDENT
                // =====================================================

                Student student = studentRepository
                                .findByUser_Id(userId)
                                .orElse(null);

                if (student != null) {

                        Student s = studentRepository
                                        .findWithDetailsById(student.getId())
                                        .orElse(student);

                        role = "STUDENT";

                        name = s.getName();
                        headline = s.getHeadline();
                        bio = s.getBio();

                        profilePicture = s.getProfilePicture();
                        coverPicture = s.getCoverPicture();

                        university = s.getUniversity();
                        department = s.getDepartment();
                        batch = s.getBatch();
                        studentId = s.getStudentId();
                        cgpa = s.getCgpa();

                        contactNumber = s.getContactNumber();
                        address = s.getAddress();

                        resumeUrl = s.getResumeUrl();
                        portfolioUrl = s.getPortfolioUrl();
                        githubUrl = s.getGithubUrl();
                        linkedinUrl = s.getLinkedinUrl();

                        openToWork = s.isOpenToWork();

                        skills = ProfileMapper.toSkillList(
                                        s.getSkills());

                        projects = s.getProjects()
                                        .stream()
                                        .map(ProfileMapper::toProjectResponse)
                                        .toList();

                        certifications = s.getCertifications()
                                        .stream()
                                        .map(ProfileMapper::toCertificationResponse)
                                        .toList();
                }

                // =====================================================
                // FACULTY
                // =====================================================

                Faculty faculty = facultyRepository
                                .findByUser_Id(userId)
                                .orElse(null);

                if (faculty != null) {

                        role = "FACULTY";

                        name = faculty.getName();

                        // headline হিসেবে designation দেখাবে
                        headline = faculty.getDesignation();

                        bio = faculty.getBio();

                        profilePicture = faculty.getProfilePicture();
                        coverPicture = faculty.getCoverPicture();

                        university = faculty.getUniversity();
                        department = faculty.getDepartment();

                        contactNumber = faculty.getContactNumber();
                        linkedinUrl = faculty.getLinkedinUrl();

                        designation = faculty.getDesignation();
                        specialization = faculty.getSpecialization();
                        researchInterests = faculty.getResearchInterests();

                        location = faculty.getLocation();

                        googleScholarUrl = faculty.getGoogleScholarUrl();
                        orcidId = faculty.getOrcidId();
                        researchgateUrl = faculty.getResearchgateUrl();
                        universityProfileUrl = faculty.getUniversityProfileUrl();

                        availableForSupervision = faculty.isAvailableForSupervision();
                }

                // =====================================================
                // COMPANY
                // =====================================================

                Company company = companyRepository
                                .findByUser_Id(userId)
                                .orElse(null);

                if (company != null) {

                        role = "COMPANY";

                        name = company.getCompanyName();

                        // headline হিসেবে industry দেখাবে
                        headline = company.getIndustry();

                        bio = company.getDescription();

                        profilePicture = company.getProfilePicture();
                        coverPicture = company.getCoverPicture();

                        location = company.getLocation();

                        contactNumber = company.getContactNumber();

                        companyName = company.getCompanyName();
                        description = company.getDescription();
                        website = company.getWebsite();

                        industry = company.getIndustry();
                        companySize = company.getCompanySize();
                        foundedDate = company.getFoundedDate();

                        companyEmail = company.getCompanyEmail();

                        verified = company.isVerified();
                }

                // =====================================================
                // RESPONSE
                // =====================================================

                return new PublicProfileResponse(

                                user.getId(),
                                role,

                                // Common
                                name,
                                headline,
                                bio,
                                profilePicture,
                                coverPicture,

                                // Student / common academic
                                university,
                                department,
                                batch,
                                studentId,
                                cgpa,
                                contactNumber,
                                address,
                                resumeUrl,
                                portfolioUrl,
                                githubUrl,
                                linkedinUrl,
                                openToWork,

                                skills,
                                projects,
                                certifications,

                                // Faculty
                                designation,
                                specialization,
                                researchInterests,
                                location,
                                googleScholarUrl,
                                orcidId,
                                researchgateUrl,
                                universityProfileUrl,
                                availableForSupervision,

                                // Company
                                companyName,
                                description,
                                website,
                                industry,
                                companySize,
                                foundedDate,
                                companyEmail,
                                verified);
        }

        @Override
        @Transactional(readOnly = true)
        public List<EducationResponse> education(Long userId) {
                User user = userRepository.findById(userId).orElseThrow(() -> ResourceNotFoundException.of("User", userId));
                userVisibility.requirePublicUser(user);
                return educationRepository.findByUser_IdOrderByStartDateDesc(userId).stream().map(this::map).toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<ExperienceResponse> experience(Long userId) {
                User user = userRepository.findById(userId).orElseThrow(() -> ResourceNotFoundException.of("User", userId));
                userVisibility.requirePublicUser(user);
                return experienceRepository.findByUser_IdOrderByStartDateDesc(userId).stream().map(this::map).toList();
        }

        @Override
        @Transactional
        public EducationResponse addEducation(EducationRequest r) {
                User me = currentUser.currentUser();
                dates(r.startDate(), r.endDate());
                return map(educationRepository.save(Education.builder().user(me).institution(r.institution().trim())
                                .degree(clean(r.degree())).fieldOfStudy(clean(r.fieldOfStudy()))
                                .startDate(r.startDate()).endDate(r.endDate()).description(clean(r.description()))
                                .build()));
        }

        @Override
        @Transactional
        public EducationResponse updateEducation(Long id, EducationRequest r) {
                User me = currentUser.currentUser();
                Education e = educationRepository.findById(id)
                                .orElseThrow(() -> ResourceNotFoundException.of("Education", id));
                own(e.getUser(), me);
                dates(r.startDate(), r.endDate());
                e.setInstitution(r.institution().trim());
                e.setDegree(clean(r.degree()));
                e.setFieldOfStudy(clean(r.fieldOfStudy()));
                e.setStartDate(r.startDate());
                e.setEndDate(r.endDate());
                e.setDescription(clean(r.description()));
                return map(educationRepository.save(e));
        }

        @Override
        @Transactional
        public void deleteEducation(Long id) {
                User me = currentUser.currentUser();
                Education e = educationRepository.findById(id)
                                .orElseThrow(() -> ResourceNotFoundException.of("Education", id));
                own(e.getUser(), me);
                educationRepository.delete(e);
        }

        @Override
        @Transactional
        public ExperienceResponse addExperience(ExperienceRequest r) {
                User me = currentUser.currentUser();
                experienceDates(r);
                return map(experienceRepository.save(Experience.builder().user(me).title(r.title().trim())
                                .organizationName(r.organizationName().trim()).employmentType(r.employmentType())
                                .location(clean(r.location())).startDate(r.startDate())
                                .endDate(r.currentlyWorking() ? null : r.endDate())
                                .currentlyWorking(r.currentlyWorking()).description(clean(r.description())).build()));
        }

        @Override
        @Transactional
        public ExperienceResponse updateExperience(Long id, ExperienceRequest r) {
                User me = currentUser.currentUser();
                Experience e = experienceRepository.findById(id)
                                .orElseThrow(() -> ResourceNotFoundException.of("Experience", id));
                own(e.getUser(), me);
                experienceDates(r);
                e.setTitle(r.title().trim());
                e.setOrganizationName(r.organizationName().trim());
                e.setEmploymentType(r.employmentType());
                e.setLocation(clean(r.location()));
                e.setStartDate(r.startDate());
                e.setEndDate(r.currentlyWorking() ? null : r.endDate());
                e.setCurrentlyWorking(r.currentlyWorking());
                e.setDescription(clean(r.description()));
                return map(experienceRepository.save(e));
        }

        @Override
        @Transactional
        public void deleteExperience(Long id) {
                User me = currentUser.currentUser();
                Experience e = experienceRepository.findById(id)
                                .orElseThrow(() -> ResourceNotFoundException.of("Experience", id));
                own(e.getUser(), me);
                experienceRepository.delete(e);
        }

        private void own(User owner, User me) {
                if (!owner.getId().equals(me.getId()))
                        throw new ForbiddenOperationException("You do not own this profile record");
        }

        private void dates(java.time.LocalDate a, java.time.LocalDate b) {
                if (a != null && b != null && b.isBefore(a))
                        throw new BadRequestException("End date cannot be before start date");
        }

        private void experienceDates(ExperienceRequest r) {
                if (!r.currentlyWorking())
                        dates(r.startDate(), r.endDate());
        }

        private String clean(String s) {
                if (s == null)
                        return null;
                String v = s.trim();
                return v.isEmpty() ? null : v;
        }

        private EducationResponse map(Education e) {
                return new EducationResponse(e.getId(), e.getInstitution(), e.getDegree(), e.getFieldOfStudy(),
                                e.getStartDate(), e.getEndDate(), e.getDescription());
        }

        private ExperienceResponse map(Experience e) {
                return new ExperienceResponse(e.getId(), e.getTitle(), e.getOrganizationName(), e.getEmploymentType(),
                                e.getLocation(), e.getStartDate(), e.getEndDate(), e.isCurrentlyWorking(),
                                e.getDescription());
        }
}
