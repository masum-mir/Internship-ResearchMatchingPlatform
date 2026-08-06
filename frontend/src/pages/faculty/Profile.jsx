// // import { useEffect, useState } from "react";
// // import { facultyApi } from "../../api/profileApi.js";
// // import { apiMessage } from "../../api/axiosClient.js";
// // import Loader from "../../components/Loader.jsx";
// // import Notice from "../../components/Toast.jsx";
// // import { resolveImageUrl } from "../../utils/imageUrl.js";

// // export default function FacultyProfile() {

// //     const [p, setP] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const [notice, setNotice] = useState({
// //         type: "",
// //         message: ""
// //     });

// //     useEffect(() => {
// //         facultyApi.getMyProfile()
// //             .then(setP)
// //             .catch(e =>
// //                 setNotice({
// //                     type: "danger",
// //                     message: apiMessage(e)
// //                 }))
// //             .finally(() => setLoading(false));
// //     }, []);

// //     if (loading) return <Loader />;

// //     if (!p)
// //         return <Notice type="danger" message={notice.message} />;

// //     const set = (k, v) => setP({
// //         ...p,
// //         [k]: v
// //     });

// //     const save = async (e) => {

// //         e.preventDefault();

// //         try {

// //             await facultyApi.updateMyProfile(p);

// //             setNotice({
// //                 type: "success",
// //                 message: "Profile saved successfully."
// //             });

// //         } catch (err) {

// //             setNotice({
// //                 type: "danger",
// //                 message: apiMessage(err)
// //             });

// //         }
// //     };

// //     const uploadProfile = async (e) => {

// //         const file = e.target.files[0];

// //         if (!file) return;

// //         try {

// //             const res = await facultyApi.uploadProfileImage(file);

// //             const updated = {
// //                 ...p,
// //                 profilePicture: res.filename
// //             };

// //             await facultyApi.updateMyProfile(updated);

// //             setP(updated);

// //         } catch (err) {
// //             alert("Failed to upload profile picture.");
// //         }

// //     };

// //     const uploadCover = async (e) => {

// //         const file = e.target.files[0];

// //         if (!file) return;

// //         try {

// //             const res = await facultyApi.uploadCoverImage(file);

// //             const updated = {
// //                 ...p,
// //                 coverPicture: res.filename
// //             };

// //             await facultyApi.updateMyProfile(updated);

// //             setP(updated);

// //         } catch (err) {
// //             alert("Failed to upload cover photo.");
// //         }

// //     };

// //     return (

// //         <div className="container">

// //             <Notice
// //                 type={notice.type}
// //                 message={notice.message}
// //                 onClose={() => setNotice({ type: "", message: "" })}
// //             />

// //             <div className="card shadow">

// //                 {/* Cover */}

// //                 <div
// //                     style={{
// //                         height: 250,
// //                         background: "#ddd",
// //                         position: "relative"
// //                     }}
// //                 >

// //                     {p.coverPicture && (

// //                         <img
// //                             src={resolveImageUrl(p.coverPicture)}
// //                             alt=""
// //                             style={{
// //                                 width: "100%",
// //                                 height: "100%",
// //                                 objectFit: "cover"
// //                             }}
// //                         />

// //                     )}

// //                     <label
// //                         className="btn btn-dark btn-sm"
// //                         style={{
// //                             position: "absolute",
// //                             right: 20,
// //                             bottom: 20
// //                         }}
// //                     >

// //                         Change Cover

// //                         <input
// //                             type="file"
// //                             hidden
// //                             onChange={uploadCover}
// //                         />

// //                     </label>

// //                 </div>

// //                 {/* Avatar */}

// //                 <div
// //                     style={{
// //                         marginTop: -60,
// //                         marginLeft: 40,
// //                         position: "relative",
// //                         width: 130
// //                     }}
// //                 >

// //                     <img
// //                         src={
// //                             p.profilePicture
// //                                 ? resolveImageUrl(p.profilePicture)
// //                                 : "https://via.placeholder.com/120"
// //                         }
// //                         alt=""
// //                         style={{
// //                             width: 120,
// //                             height: 120,
// //                             borderRadius: "50%",
// //                             border: "4px solid white",
// //                             objectFit: "cover"
// //                         }}
// //                     />

// //                     <label
// //                         className="btn btn-primary btn-sm"
// //                         style={{
// //                             position: "absolute",
// //                             bottom: 0,
// //                             right: 0
// //                         }}
// //                     >

// //                         📷

// //                         <input
// //                             hidden
// //                             type="file"
// //                             onChange={uploadProfile}
// //                         />

// //                     </label>

// //                 </div>

// //                 <div className="card-body">

// //                     <form onSubmit={save}>

// //                         <div className="row g-3">

// //                             <div className="col-md-6">

// //                                 <label>Name</label>

// //                                 <input
// //                                     className="form-control"
// //                                     value={p.name || ""}
// //                                     onChange={e => set("name", e.target.value)}
// //                                 />

// //                             </div>

// //                             <div className="col-md-6">

// //                                 <label>Department</label>

// //                                 <input
// //                                     className="form-control"
// //                                     value={p.department || ""}
// //                                     onChange={e => set("department", e.target.value)}
// //                                 />

// //                             </div>

// //                             <div className="col-md-6">

// //                                 <label>Designation</label>

// //                                 <input
// //                                     className="form-control"
// //                                     value={p.designation || ""}
// //                                     onChange={e => set("designation", e.target.value)}
// //                                 />

// //                             </div>

// //                             <div className="col-md-6">

// //                                 <label>Contact Number</label>

// //                                 <input
// //                                     className="form-control"
// //                                     value={p.contactNumber || ""}
// //                                     onChange={e => set("contactNumber", e.target.value)}
// //                                 />

// //                             </div>

// //                             <div className="col-12">

// //                                 <button className="btn btn-success">

// //                                     Save Profile

// //                                 </button>

// //                             </div>

// //                         </div>

// //                     </form>

// //                 </div>

// //             </div>

// //         </div>

// //     );

// // }

// import { useCallback, useEffect, useMemo, useState } from "react";
// import { facultyApi } from "../../api/profileApi.js";
// import { apiMessage } from "../../api/axiosClient.js";
// import Loader from "../../components/Loader.jsx";
// import Notice from "../../components/Toast.jsx";
// import { resolveImageUrl } from "../../utils/imageUrl.js";
// import "../../css/FacultyProfile.css";

// function FacultyProfileModal({
//   show,
//   title,
//   subtitle,
//   onClose,
//   children
// }) {
//   useEffect(() => {
//     if (!show) return undefined;

//     const previousOverflow = document.body.style.overflow;

//     document.body.style.overflow = "hidden";

//     const handleEscape = (event) => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };

//     window.addEventListener("keydown", handleEscape);

//     return () => {
//       document.body.style.overflow = previousOverflow;
//       window.removeEventListener("keydown", handleEscape);
//     };
//   }, [show, onClose]);

//   if (!show) return null;

//   return (
//     <div
//       className="faculty-modal-backdrop"
//       onMouseDown={(event) => {
//         if (event.target === event.currentTarget) {
//           onClose();
//         }
//       }}
//     >
//       <div
//         className="faculty-modal-dialog"
//         role="dialog"
//         aria-modal="true"
//         aria-label={title}
//       >
//         <div className="faculty-modal-header">
//           <div>
//             <h2>{title}</h2>

//             {subtitle && <p>{subtitle}</p>}
//           </div>

//           <button
//             type="button"
//             className="faculty-modal-close"
//             onClick={onClose}
//             aria-label="Close modal"
//           >
//             <i className="bi bi-x-lg" />
//           </button>
//         </div>

//         <div className="faculty-modal-body">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

// function FacultyDetailItem({
//   icon,
//   label,
//   value,
//   fullWidth = false
// }) {
//   return (
//     <div
//       className={`faculty-detail-item ${
//         fullWidth ? "faculty-detail-full" : ""
//       }`}
//     >
//       <div className="faculty-detail-icon">
//         <i className={`bi ${icon}`} />
//       </div>

//       <div className="faculty-detail-content">
//         <span>{label}</span>

//         <strong className={!value ? "faculty-empty-value" : ""}>
//           {value || "Not added yet"}
//         </strong>
//       </div>
//     </div>
//   );
// }

// export default function FacultyProfile() {
//   const [profile, setProfile] = useState(null);
//   const [editData, setEditData] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [uploadingProfile, setUploadingProfile] = useState(false);
//   const [uploadingCover, setUploadingCover] = useState(false);

//   const [showEditModal, setShowEditModal] = useState(false);

//   const [notice, setNotice] = useState({
//     type: "",
//     message: ""
//   });

//   const flash = useCallback((type, message) => {
//     setNotice({ type, message });

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth"
//     });
//   }, []);

//   const loadProfile = useCallback(async () => {
//     try {
//       const response = await facultyApi.getMyProfile();

//       // Supports direct data and Axios { data: ... } responses.
//       const profileData = response?.data ?? response;

//       setProfile(profileData);
//       return profileData;
//     } catch (error) {
//       flash("danger", apiMessage(error));
//       throw error;
//     }
//   }, [flash]);

//   useEffect(() => {
//     loadProfile()
//       .finally(() => setLoading(false));
//   }, [loadProfile]);

//   const createUpdatePayload = (
//     source,
//     additionalValues = {}
//   ) => ({
//     name: source?.name || "",
//     department: source?.department || "",
//     designation: source?.designation || "",
//     contactNumber: source?.contactNumber || "",
//     profilePicture: source?.profilePicture || null,
//     coverPicture: source?.coverPicture || null,
//     ...additionalValues
//   });

//   const openEditModal = () => {
//     setEditData({
//       name: profile?.name || "",
//       department: profile?.department || "",
//       designation: profile?.designation || "",
//       contactNumber: profile?.contactNumber || ""
//     });

//     setShowEditModal(true);
//   };

//   const closeEditModal = useCallback(() => {
//     if (saving) return;

//     setShowEditModal(false);
//   }, [saving]);

//   const updateEditField = (field, value) => {
//     setEditData((current) => ({
//       ...current,
//       [field]: value
//     }));
//   };

//   const saveProfile = async (event) => {
//     event.preventDefault();

//     setSaving(true);

//     try {
//       const updatedProfile = {
//         ...profile,
//         ...editData
//       };

//       await facultyApi.updateMyProfile(
//         createUpdatePayload(updatedProfile)
//       );

//       await loadProfile();

//       setShowEditModal(false);

//       flash(
//         "success",
//         "Faculty profile updated successfully."
//       );
//     } catch (error) {
//       flash("danger", apiMessage(error));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const uploadProfileImage = async (event) => {
//     const file = event.target.files?.[0];

//     if (!file) return;

//     setUploadingProfile(true);

//     try {
//       const response =
//         await facultyApi.uploadProfileImage(file);

//       const uploadData = response?.data ?? response;

//       await facultyApi.updateMyProfile(
//         createUpdatePayload(profile, {
//           profilePicture: uploadData.filename
//         })
//       );

//       await loadProfile();

//       flash(
//         "success",
//         "Profile picture updated successfully."
//       );
//     } catch (error) {
//       console.error(error);
//       flash("danger", apiMessage(error));
//     } finally {
//       setUploadingProfile(false);
//       event.target.value = "";
//     }
//   };

//   const uploadCoverImage = async (event) => {
//     const file = event.target.files?.[0];

//     if (!file) return;

//     setUploadingCover(true);

//     try {
//       const response =
//         await facultyApi.uploadCoverImage(file);

//       const uploadData = response?.data ?? response;

//       await facultyApi.updateMyProfile(
//         createUpdatePayload(profile, {
//           coverPicture: uploadData.filename
//         })
//       );

//       await loadProfile();

//       flash(
//         "success",
//         "Cover picture updated successfully."
//       );
//     } catch (error) {
//       console.error(error);
//       flash("danger", apiMessage(error));
//     } finally {
//       setUploadingCover(false);
//       event.target.value = "";
//     }
//   };

//   const initials = useMemo(() => {
//     const name = profile?.name?.trim();

//     if (!name) return "F";

//     return name
//       .split(/\s+/)
//       .slice(0, 2)
//       .map((part) => part.charAt(0).toUpperCase())
//       .join("");
//   }, [profile?.name]);

//   const completionPercentage = useMemo(() => {
//     if (!profile) return 0;

//     const fields = [
//       profile.name,
//       profile.department,
//       profile.designation,
//       profile.contactNumber,
//       profile.profilePicture,
//       profile.coverPicture
//     ];

//     return Math.round(
//       (fields.filter(Boolean).length / fields.length) * 100
//     );
//   }, [profile]);

//   if (loading) {
//     return <Loader />;
//   }

//   if (!profile) {
//     return (
//       <Notice
//         type="danger"
//         message={
//           notice.message || "Could not load faculty profile."
//         }
//       />
//     );
//   }

//   const coverUrl = resolveImageUrl(profile.coverPicture);
//   const profileImageUrl = resolveImageUrl(
//     profile.profilePicture
//   );

//   return (
//     <div className="faculty-profile-page">
//       <Notice
//         type={notice.type}
//         message={notice.message}
//         onClose={() =>
//           setNotice({
//             type: "",
//             message: ""
//           })
//         }
//       />

//       {/* Profile header */}
//       <section className="faculty-profile-hero">
//         <div
//           className={`faculty-cover ${
//             coverUrl ? "faculty-cover-image" : ""
//           }`}
//           style={
//             coverUrl
//               ? {
//                   backgroundImage: `
//                     linear-gradient(
//                       180deg,
//                       rgba(0, 0, 0, 0.05),
//                       rgba(0, 0, 0, 0.3)
//                     ),
//                     url("${coverUrl}")
//                   `
//                 }
//               : undefined
//           }
//         >
//           <div className="faculty-cover-decoration" />

//           <label
//             className={`faculty-cover-button ${
//               uploadingCover ? "disabled" : ""
//             }`}
//             title="Change cover picture"
//           >
//             {uploadingCover ? (
//               <>
//                 <span className="spinner-border spinner-border-sm" />
//                 Uploading
//               </>
//             ) : (
//               <>
//                 <i className="bi bi-camera-fill" />
//                 Change cover
//               </>
//             )}

//             <input
//               type="file"
//               hidden
//               accept="image/*"
//               disabled={uploadingCover}
//               onChange={uploadCoverImage}
//             />
//           </label>
//         </div>

//         <div className="faculty-profile-summary">
//           <div className="faculty-avatar-container">
//             {profileImageUrl ? (
//               <img
//                 src={profileImageUrl}
//                 alt={profile.name || "Faculty member"}
//                 className="faculty-profile-avatar"
//               />
//             ) : (
//               <div className="faculty-avatar-fallback">
//                 {initials}
//               </div>
//             )}

//             <label
//               className={`faculty-avatar-button ${
//                 uploadingProfile ? "disabled" : ""
//               }`}
//               title="Change profile picture"
//             >
//               {uploadingProfile ? (
//                 <span className="spinner-border spinner-border-sm" />
//               ) : (
//                 <i className="bi bi-camera-fill" />
//               )}

//               <input
//                 type="file"
//                 hidden
//                 accept="image/*"
//                 disabled={uploadingProfile}
//                 onChange={uploadProfileImage}
//               />
//             </label>
//           </div>

//           <div className="faculty-heading-content">
//             <div className="faculty-name-row">
//               <div>
//                 <h1>
//                   {profile.name || "Faculty Member"}
//                 </h1>

//                 <p className="faculty-headline">
//                   {[
//                     profile.designation,
//                     profile.department
//                   ]
//                     .filter(Boolean)
//                     .join(" at ") ||
//                     "Complete your faculty profile"}
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 className="faculty-edit-primary"
//                 onClick={openEditModal}
//               >
//                 <i className="bi bi-pencil-fill" />
//                 Edit profile
//               </button>
//             </div>

//             <div className="faculty-summary-meta">
//               {profile.department && (
//                 <span>
//                   <i className="bi bi-building" />
//                   {profile.department}
//                 </span>
//               )}

//               {profile.designation && (
//                 <span>
//                   <i className="bi bi-person-badge" />
//                   {profile.designation}
//                 </span>
//               )}

//               {profile.email && (
//                 <span>
//                   <i className="bi bi-envelope" />
//                   {profile.email}
//                 </span>
//               )}
//             </div>

//             <div className="faculty-role-badge">
//               <i className="bi bi-patch-check-fill" />
//               Faculty Member
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="faculty-profile-layout">
//         <main className="faculty-profile-main">
//           {/* About section */}
//           <section className="faculty-section-card">
//             <div className="faculty-section-header">
//               <div>
//                 <h2>About</h2>
//                 <p>
//                   Academic and professional profile information
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 className="faculty-section-edit"
//                 onClick={openEditModal}
//                 title="Edit profile information"
//               >
//                 <i className="bi bi-pencil" />
//               </button>
//             </div>

//             <div className="faculty-detail-grid">
//               <FacultyDetailItem
//                 icon="bi-person"
//                 label="Full name"
//                 value={profile.name}
//               />

//               <FacultyDetailItem
//                 icon="bi-person-badge"
//                 label="Designation"
//                 value={profile.designation}
//               />

//               <FacultyDetailItem
//                 icon="bi-building"
//                 label="Department"
//                 value={profile.department}
//               />

//               <FacultyDetailItem
//                 icon="bi-telephone"
//                 label="Contact number"
//                 value={profile.contactNumber}
//               />

//               {profile.email && (
//                 <FacultyDetailItem
//                   icon="bi-envelope"
//                   label="Email address"
//                   value={profile.email}
//                   fullWidth
//                 />
//               )}
//             </div>
//           </section>

//           {/* Professional summary */}
//           <section className="faculty-section-card">
//             <div className="faculty-section-header">
//               <div>
//                 <h2>Faculty profile</h2>
//                 <p>
//                   Information visible to students and other users
//                 </p>
//               </div>
//             </div>

//             <div className="faculty-professional-summary">
//               <div className="faculty-summary-icon">
//                 <i className="bi bi-mortarboard-fill" />
//               </div>

//               <div>
//                 <h3>
//                   {profile.designation ||
//                     "Faculty designation"}
//                 </h3>

//                 <p>
//                   {profile.name || "This faculty member"}
//                   {profile.department
//                     ? ` is associated with the ${profile.department} department.`
//                     : " has not added a department yet."}
//                 </p>

//                 {profile.contactNumber && (
//                   <a
//                     href={`tel:${profile.contactNumber}`}
//                     className="faculty-contact-link"
//                   >
//                     <i className="bi bi-telephone" />
//                     Contact faculty
//                   </a>
//                 )}
//               </div>
//             </div>
//           </section>
//         </main>

//         <aside className="faculty-profile-sidebar">
//           {/* Completion card */}
//           <section className="faculty-section-card faculty-completion-card">
//             <div className="faculty-completion-heading">
//               <div>
//                 <h2>Profile strength</h2>

//                 <p>
//                   Complete your profile to improve visibility.
//                 </p>
//               </div>

//               <div className="faculty-completion-circle">
//                 {completionPercentage}%
//               </div>
//             </div>

//             <div className="faculty-completion-progress">
//               <div
//                 className="faculty-completion-value"
//                 style={{
//                   width: `${completionPercentage}%`
//                 }}
//               />
//             </div>

//             {completionPercentage < 100 ? (
//               <button
//                 type="button"
//                 onClick={openEditModal}
//                 className="faculty-completion-action"
//               >
//                 Complete profile
//                 <i className="bi bi-arrow-right" />
//               </button>
//             ) : (
//               <div className="faculty-complete-message">
//                 <i className="bi bi-check-circle-fill" />
//                 Your profile is complete
//               </div>
//             )}
//           </section>

//           {/* Contact card */}
//           <section className="faculty-section-card">
//             <div className="faculty-section-header faculty-small-header">
//               <div>
//                 <h2>Contact information</h2>
//               </div>
//             </div>

//             <div className="faculty-contact-list">
//               {profile.email ? (
//                 <a href={`mailto:${profile.email}`}>
//                   <span>
//                     <i className="bi bi-envelope" />
//                   </span>

//                   <div>
//                     <small>Email</small>
//                     <strong>{profile.email}</strong>
//                   </div>
//                 </a>
//               ) : (
//                 <div className="faculty-contact-empty">
//                   <i className="bi bi-envelope" />
//                   Email is not available
//                 </div>
//               )}

//               {profile.contactNumber ? (
//                 <a href={`tel:${profile.contactNumber}`}>
//                   <span>
//                     <i className="bi bi-telephone" />
//                   </span>

//                   <div>
//                     <small>Phone</small>
//                     <strong>
//                       {profile.contactNumber}
//                     </strong>
//                   </div>
//                 </a>
//               ) : (
//                 <button
//                   type="button"
//                   className="faculty-contact-empty"
//                   onClick={openEditModal}
//                 >
//                   <i className="bi bi-plus-circle" />
//                   Add contact number
//                 </button>
//               )}
//             </div>
//           </section>
//         </aside>
//       </div>

//       {/* Edit modal */}
//       <FacultyProfileModal
//         show={showEditModal}
//         title="Edit faculty profile"
//         subtitle="Update the information displayed on your profile."
//         onClose={closeEditModal}
//       >
//         {editData && (
//           <form onSubmit={saveProfile}>
//             <div className="row g-3">
//               <div className="col-md-6">
//                 <label className="form-label">
//                   Full name
//                 </label>

//                 <input
//                   type="text"
//                   className="form-control"
//                   required
//                   placeholder="Enter your full name"
//                   value={editData.name}
//                   onChange={(event) =>
//                     updateEditField(
//                       "name",
//                       event.target.value
//                     )
//                   }
//                 />
//               </div>

//               <div className="col-md-6">
//                 <label className="form-label">
//                   Designation
//                 </label>

//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="For example: Assistant Professor"
//                   value={editData.designation}
//                   onChange={(event) =>
//                     updateEditField(
//                       "designation",
//                       event.target.value
//                     )
//                   }
//                 />
//               </div>

//               <div className="col-md-6">
//                 <label className="form-label">
//                   Department
//                 </label>

//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="For example: Computer Science"
//                   value={editData.department}
//                   onChange={(event) =>
//                     updateEditField(
//                       "department",
//                       event.target.value
//                     )
//                   }
//                 />
//               </div>

//               <div className="col-md-6">
//                 <label className="form-label">
//                   Contact number
//                 </label>

//                 <input
//                   type="tel"
//                   className="form-control"
//                   placeholder="Enter contact number"
//                   value={editData.contactNumber}
//                   onChange={(event) =>
//                     updateEditField(
//                       "contactNumber",
//                       event.target.value
//                     )
//                   }
//                 />
//               </div>
//             </div>

//             <div className="faculty-modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-light rounded-pill px-4"
//                 onClick={closeEditModal}
//                 disabled={saving}
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 className="btn btn-primary rounded-pill px-4"
//                 disabled={saving}
//               >
//                 {saving ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" />
//                     Saving
//                   </>
//                 ) : (
//                   <>
//                     <i className="bi bi-check-lg me-2" />
//                     Update
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         )}
//       </FacultyProfileModal>
//     </div>
//   );
// }

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { facultyApi } from "../../api/profileApi.js";
import { apiMessage } from "../../api/axiosClient.js";
import Loader from "../../components/Loader.jsx";
import Notice from "../../components/Toast.jsx";
import { resolveImageUrl } from "../../utils/imageUrl.js";
import "../../css/FacultyProfile.css";

const EMPTY_PROFILE = {
  name: "",
  department: "",
  designation: "",
  bio: "",
  specialization: "",
  researchInterests: "",
  contactNumber: "",
  university: "",
  googleScholarUrl: "",
  orcidId: "",
  researchgateUrl: "",
  linkedinUrl: "",
  universityProfileUrl: ""
};

function FacultyProfileModal({ show, title, subtitle, onClose, children }) {
  useEffect(() => {
    if (!show) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="faculty-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="faculty-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="faculty-modal-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>

          <button
            type="button"
            className="faculty-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="faculty-modal-body">{children}</div>
      </div>
    </div>
  );
}

function FacultyDetailItem({ icon, label, value, fullWidth = false }) {
  return (
    <div
      className={`faculty-detail-item ${
        fullWidth ? "faculty-detail-full" : ""
      }`}
    >
      <div className="faculty-detail-icon">
        <i className={`bi ${icon}`} />
      </div>

      <div className="faculty-detail-content">
        <span>{label}</span>
        <strong className={!value ? "faculty-empty-value" : ""}>
          {value || "Not added yet"}
        </strong>
      </div>
    </div>
  );
}

function toExternalUrl(value) {
  const url = value?.trim();
  if (!url) return null;

  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function ExternalProfileLink({ icon, label, value, subtitle }) {
  const href = toExternalUrl(value);

  if (!href) return null;

  return (
    <a
      className="faculty-social-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="faculty-social-icon">
        <i className={`bi ${icon}`} />
      </span>

      <span className="faculty-social-content">
        <strong>{label}</strong>
        <small>{subtitle}</small>
      </span>

      <i className="bi bi-box-arrow-up-right faculty-social-arrow" />
    </a>
  );
}

export default function FacultyProfile() {
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [notice, setNotice] = useState({ type: "", message: "" });

  const flash = useCallback((type, message) => {
    setNotice({ type, message });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const response = await facultyApi.getMyProfile();
      const profileData = response?.data ?? response;
      setProfile(profileData);
      return profileData;
    } catch (error) {
      flash("danger", apiMessage(error));
      throw error;
    }
  }, [flash]);

  useEffect(() => {
    loadProfile().finally(() => setLoading(false));
  }, [loadProfile]);

  const createUpdatePayload = (source, extra = {}) => ({
    name: source?.name?.trim() || "",
    department: source?.department?.trim() || "",
    designation: source?.designation?.trim() || "",
    bio: source?.bio?.trim() || "",
    specialization: source?.specialization?.trim() || "",
    researchInterests: source?.researchInterests?.trim() || "",
    contactNumber: source?.contactNumber?.trim() || "",
    university: source?.university?.trim() || "",
    googleScholarUrl: source?.googleScholarUrl?.trim() || "",
    orcidId: source?.orcidId?.trim() || "",
    researchgateUrl: source?.researchgateUrl?.trim() || "",
    linkedinUrl: source?.linkedinUrl?.trim() || "",
    universityProfileUrl: source?.universityProfileUrl?.trim() || "",
    profilePicture: source?.profilePicture || null,
    coverPicture: source?.coverPicture || null,
    ...extra
  });

  const openEditModal = () => {
    setEditData({
      ...EMPTY_PROFILE,
      name: profile?.name || "",
      department: profile?.department || "",
      designation: profile?.designation || "",
      bio: profile?.bio || "",
      specialization: profile?.specialization || "",
      researchInterests: profile?.researchInterests || "",
      contactNumber: profile?.contactNumber || "",
      university: profile?.university || "",
      googleScholarUrl: profile?.googleScholarUrl || "",
      orcidId: profile?.orcidId || "",
      researchgateUrl: profile?.researchgateUrl || "",
      linkedinUrl: profile?.linkedinUrl || "",
      universityProfileUrl: profile?.universityProfileUrl || ""
    });

    setShowEditModal(true);
  };

  const closeEditModal = useCallback(() => {
    if (!saving) setShowEditModal(false);
  }, [saving]);

  const updateEditField = (field, value) => {
    setEditData((current) => ({ ...current, [field]: value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const updatedProfile = { ...profile, ...editData };
      await facultyApi.updateMyProfile(createUpdatePayload(updatedProfile));
      await loadProfile();
      setShowEditModal(false);
      flash("success", "Faculty profile updated successfully.");
    } catch (error) {
      flash("danger", apiMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const uploadProfileImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingProfile(true);

    try {
      const response = await facultyApi.uploadProfileImage(file);
      const uploadData = response?.data ?? response;

      await facultyApi.updateMyProfile(
        createUpdatePayload(profile, {
          profilePicture: uploadData.filename
        })
      );

      await loadProfile();
      flash("success", "Profile picture updated successfully.");
    } catch (error) {
      flash("danger", apiMessage(error));
    } finally {
      setUploadingProfile(false);
      event.target.value = "";
    }
  };

  const uploadCoverImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);

    try {
      const response = await facultyApi.uploadCoverImage(file);
      const uploadData = response?.data ?? response;

      await facultyApi.updateMyProfile(
        createUpdatePayload(profile, {
          coverPicture: uploadData.filename
        })
      );

      await loadProfile();
      flash("success", "Cover picture updated successfully.");
    } catch (error) {
      flash("danger", apiMessage(error));
    } finally {
      setUploadingCover(false);
      event.target.value = "";
    }
  };

  const initials = useMemo(() => {
    const name = profile?.name?.trim();
    if (!name) return "F";

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [profile?.name]);

  const researchInterestList = useMemo(() => {
    return (profile?.researchInterests || "")
      .split(/[,;\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }, [profile?.researchInterests]);

  const completionPercentage = useMemo(() => {
    if (!profile) return 0;

    const fields = [
      profile.name,
      profile.department,
      profile.designation,
      profile.bio,
      profile.specialization,
      profile.researchInterests,
      profile.contactNumber,
      profile.university,
      profile.profilePicture,
      profile.coverPicture,
      profile.googleScholarUrl,
      profile.orcidId,
      profile.linkedinUrl
    ];

    return Math.round(
      (fields.filter((value) => Boolean(String(value || "").trim())).length /
        fields.length) *
        100
    );
  }, [profile]);

  const hasProfessionalLinks = Boolean(
    profile?.googleScholarUrl ||
      profile?.orcidId ||
      profile?.researchgateUrl ||
      profile?.linkedinUrl ||
      profile?.universityProfileUrl
  );

  if (loading) return <Loader />;

  if (!profile) {
    return (
      <Notice
        type="danger"
        message={notice.message || "Could not load faculty profile."}
      />
    );
  }

  const coverUrl = resolveImageUrl(profile.coverPicture);
  const profileImageUrl = resolveImageUrl(profile.profilePicture);
  const orcidUrl = profile.orcidId
    ? `https://orcid.org/${profile.orcidId.replace(
        /^https?:\/\/(www\.)?orcid\.org\//i,
        ""
      )}`
    : null;

  return (
    <div className="faculty-profile-page">
      <Notice
        type={notice.type}
        message={notice.message}
        onClose={() => setNotice({ type: "", message: "" })}
      />

      <section className="faculty-profile-hero">
        <div
          className={`faculty-cover ${coverUrl ? "faculty-cover-image" : ""}`}
          style={
            coverUrl
              ? {
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.04), rgba(0,0,0,.34)), url("${coverUrl}")`
                }
              : undefined
          }
        >
          <div className="faculty-cover-decoration" />

          <label
            className={`faculty-cover-button ${
              uploadingCover ? "disabled" : ""
            }`}
            title="Change cover picture"
          >
            {uploadingCover ? (
              <>
                <span className="spinner-border spinner-border-sm" />
                Uploading
              </>
            ) : (
              <>
                <i className="bi bi-camera-fill" />
                Change cover
              </>
            )}

            <input
              type="file"
              hidden
              accept="image/*"
              disabled={uploadingCover}
              onChange={uploadCoverImage}
            />
          </label>
        </div>

        <div className="faculty-profile-summary">
          <div className="faculty-avatar-container">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={profile.name || "Faculty member"}
                className="faculty-profile-avatar"
              />
            ) : (
              <div className="faculty-avatar-fallback">{initials}</div>
            )}

            <label
              className={`faculty-avatar-button ${
                uploadingProfile ? "disabled" : ""
              }`}
              title="Change profile picture"
            >
              {uploadingProfile ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <i className="bi bi-camera-fill" />
              )}

              <input
                type="file"
                hidden
                accept="image/*"
                disabled={uploadingProfile}
                onChange={uploadProfileImage}
              />
            </label>
          </div>

          <div className="faculty-heading-content">
            <div className="faculty-name-row">
              <div>
                <h1>{profile.name || "Faculty Member"}</h1>

                <p className="faculty-headline">
                  {[profile.designation, profile.department, profile.university]
                    .filter(Boolean)
                    .join(" • ") || "Complete your faculty profile"}
                </p>
              </div>

              <button
                type="button"
                className="faculty-edit-primary"
                onClick={openEditModal}
              >
                <i className="bi bi-pencil-fill" />
                Edit profile
              </button>
            </div>

            <div className="faculty-summary-meta">
              {profile.specialization && (
                <span>
                  <i className="bi bi-lightbulb" />
                  {profile.specialization}
                </span>
              )}

              {profile.email && (
                <span>
                  <i className="bi bi-envelope" />
                  {profile.email}
                </span>
              )}

              {profile.contactNumber && (
                <span>
                  <i className="bi bi-telephone" />
                  {profile.contactNumber}
                </span>
              )}
            </div>

            <div className="faculty-role-badge">
              <i className="bi bi-patch-check-fill" />
              Faculty Member
            </div>
          </div>
        </div>
      </section>

      <div className="faculty-profile-layout">
        <main className="faculty-profile-main">
          <section className="faculty-section-card">
            <div className="faculty-section-header">
              <div>
                <h2>About</h2>
                <p>Professional biography and academic introduction</p>
              </div>

              <button
                type="button"
                className="faculty-section-edit"
                onClick={openEditModal}
                title="Edit about information"
              >
                <i className="bi bi-pencil" />
              </button>
            </div>

            {profile.bio ? (
              <p className="faculty-about-text">{profile.bio}</p>
            ) : (
              <button
                type="button"
                className="faculty-add-empty-content"
                onClick={openEditModal}
              >
                <i className="bi bi-plus-circle" />
                Add a professional biography
              </button>
            )}
          </section>

          <section className="faculty-section-card">
            <div className="faculty-section-header">
              <div>
                <h2>Academic information</h2>
                <p>Department, designation and university information</p>
              </div>

              <button
                type="button"
                className="faculty-section-edit"
                onClick={openEditModal}
                title="Edit academic information"
              >
                <i className="bi bi-pencil" />
              </button>
            </div>

            <div className="faculty-detail-grid">
              <FacultyDetailItem
                icon="bi-person"
                label="Full name"
                value={profile.name}
              />
              <FacultyDetailItem
                icon="bi-person-badge"
                label="Designation"
                value={profile.designation}
              />
              <FacultyDetailItem
                icon="bi-building"
                label="Department"
                value={profile.department}
              />
              <FacultyDetailItem
                icon="bi-mortarboard"
                label="University"
                value={profile.university}
              />
              <FacultyDetailItem
                icon="bi-telephone"
                label="Contact number"
                value={profile.contactNumber}
              />
              <FacultyDetailItem
                icon="bi-envelope"
                label="Email address"
                value={profile.email}
              />
            </div>
          </section>

          <section className="faculty-section-card">
            <div className="faculty-section-header">
              <div>
                <h2>Research & expertise</h2>
                <p>Primary specialization and research interests</p>
              </div>

              <button
                type="button"
                className="faculty-section-edit"
                onClick={openEditModal}
                title="Edit research information"
              >
                <i className="bi bi-pencil" />
              </button>
            </div>

            <div className="faculty-research-highlight">
              <div className="faculty-research-icon">
                <i className="bi bi-journal-richtext" />
              </div>

              <div>
                <span>Specialization</span>
                <h3>{profile.specialization || "Not added yet"}</h3>
              </div>
            </div>

            <div className="faculty-interest-area">
              <h3>Research interests</h3>

              {researchInterestList.length ? (
                <div className="faculty-interest-list">
                  {researchInterestList.map((interest) => (
                    <span key={interest}>{interest}</span>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  className="faculty-add-empty-content"
                  onClick={openEditModal}
                >
                  <i className="bi bi-plus-circle" />
                  Add research interests
                </button>
              )}
            </div>
          </section>

          <section className="faculty-section-card">
            <div className="faculty-section-header">
              <div>
                <h2>Professional profiles</h2>
                <p>Academic identity and external profile links</p>
              </div>

              <button
                type="button"
                className="faculty-section-edit"
                onClick={openEditModal}
                title="Edit professional links"
              >
                <i className="bi bi-pencil" />
              </button>
            </div>

            {hasProfessionalLinks ? (
              <div className="faculty-social-grid">
                <ExternalProfileLink
                  icon="bi-google"
                  label="Google Scholar"
                  subtitle="View publications and citations"
                  value={profile.googleScholarUrl}
                />

                {orcidUrl && (
                  <ExternalProfileLink
                    icon="bi-person-bounding-box"
                    label="ORCID"
                    subtitle={profile.orcidId}
                    value={orcidUrl}
                  />
                )}

                <ExternalProfileLink
                  icon="bi-journal-bookmark-fill"
                  label="ResearchGate"
                  subtitle="View research profile"
                  value={profile.researchgateUrl}
                />

                <ExternalProfileLink
                  icon="bi-linkedin"
                  label="LinkedIn"
                  subtitle="View professional profile"
                  value={profile.linkedinUrl}
                />

                <ExternalProfileLink
                  icon="bi-building-check"
                  label="University profile"
                  subtitle="View official university page"
                  value={profile.universityProfileUrl}
                />
              </div>
            ) : (
              <button
                type="button"
                className="faculty-add-empty-content"
                onClick={openEditModal}
              >
                <i className="bi bi-link-45deg" />
                Add academic and professional links
              </button>
            )}
          </section>
        </main>

        <aside className="faculty-profile-sidebar">
          <section className="faculty-section-card faculty-completion-card">
            <div className="faculty-completion-heading">
              <div>
                <h2>Profile strength</h2>
                <p>Complete your profile to improve visibility.</p>
              </div>

              <div className="faculty-completion-circle">
                {completionPercentage}%
              </div>
            </div>

            <div className="faculty-completion-progress">
              <div
                className="faculty-completion-value"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            {completionPercentage < 100 ? (
              <button
                type="button"
                onClick={openEditModal}
                className="faculty-completion-action"
              >
                Complete profile
                <i className="bi bi-arrow-right" />
              </button>
            ) : (
              <div className="faculty-complete-message">
                <i className="bi bi-check-circle-fill" />
                Your profile is complete
              </div>
            )}
          </section>

          <section className="faculty-section-card">
            <div className="faculty-section-header faculty-small-header">
              <div>
                <h2>Contact information</h2>
              </div>
            </div>

            <div className="faculty-contact-list">
              {profile.email ? (
                <a href={`mailto:${profile.email}`}>
                  <span>
                    <i className="bi bi-envelope" />
                  </span>
                  <div>
                    <small>Email</small>
                    <strong>{profile.email}</strong>
                  </div>
                </a>
              ) : (
                <div className="faculty-contact-empty">
                  <i className="bi bi-envelope" />
                  Email is not available
                </div>
              )}

              {profile.contactNumber ? (
                <a href={`tel:${profile.contactNumber}`}>
                  <span>
                    <i className="bi bi-telephone" />
                  </span>
                  <div>
                    <small>Phone</small>
                    <strong>{profile.contactNumber}</strong>
                  </div>
                </a>
              ) : (
                <button
                  type="button"
                  className="faculty-contact-empty"
                  onClick={openEditModal}
                >
                  <i className="bi bi-plus-circle" />
                  Add contact number
                </button>
              )}
            </div>
          </section>

          <section className="faculty-section-card faculty-quick-card">
            <div className="faculty-quick-icon">
              <i className="bi bi-journal-plus" />
            </div>
            <h2>Research opportunities</h2>
            <p>Create and manage research positions for interested students.</p>
            <Link to="/faculty/research" className="faculty-quick-link">
              Manage research
              <i className="bi bi-arrow-right" />
            </Link>
          </section>
        </aside>
      </div>

      <FacultyProfileModal
        show={showEditModal}
        title="Edit faculty profile"
        subtitle="Update your academic, research and professional information."
        onClose={closeEditModal}
      >
        {editData && (
          <form onSubmit={saveProfile}>
            <div className="faculty-form-section">
              <h3>Basic information</h3>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={editData.name}
                    onChange={(event) =>
                      updateEditField("name", event.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Assistant Professor"
                    value={editData.designation}
                    onChange={(event) =>
                      updateEditField("designation", event.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Computer Science and Engineering"
                    value={editData.department}
                    onChange={(event) =>
                      updateEditField("department", event.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">University</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="East West University"
                    value={editData.university}
                    onChange={(event) =>
                      updateEditField("university", event.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Contact number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={editData.contactNumber}
                    onChange={(event) =>
                      updateEditField("contactNumber", event.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="faculty-form-section">
              <h3>About and research</h3>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Professional biography</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    maxLength="3000"
                    placeholder="Write a short academic and professional biography..."
                    value={editData.bio}
                    onChange={(event) =>
                      updateEditField("bio", event.target.value)
                    }
                  />
                  <div className="faculty-field-counter">
                    {editData.bio.length}/3000
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Specialization</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Artificial Intelligence and Cybersecurity"
                    value={editData.specialization}
                    onChange={(event) =>
                      updateEditField("specialization", event.target.value)
                    }
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Research interests</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Machine Learning, IoT Security, Cloud Computing"
                    value={editData.researchInterests}
                    onChange={(event) =>
                      updateEditField("researchInterests", event.target.value)
                    }
                  />
                  <div className="form-text">
                    Separate multiple interests using commas.
                  </div>
                </div>
              </div>
            </div>

            <div className="faculty-form-section">
              <h3>Academic and professional links</h3>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Google Scholar URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://scholar.google.com/citations?user=..."
                    value={editData.googleScholarUrl}
                    onChange={(event) =>
                      updateEditField("googleScholarUrl", event.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">ORCID ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="0000-0000-0000-0000"
                    value={editData.orcidId}
                    onChange={(event) =>
                      updateEditField("orcidId", event.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">LinkedIn URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://linkedin.com/in/..."
                    value={editData.linkedinUrl}
                    onChange={(event) =>
                      updateEditField("linkedinUrl", event.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">ResearchGate URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://researchgate.net/profile/..."
                    value={editData.researchgateUrl}
                    onChange={(event) =>
                      updateEditField("researchgateUrl", event.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">University profile URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://university.edu/faculty/..."
                    value={editData.universityProfileUrl}
                    onChange={(event) =>
                      updateEditField(
                        "universityProfileUrl",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="faculty-modal-footer">
              <button
                type="button"
                className="btn btn-light rounded-pill px-4"
                onClick={closeEditModal}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2" />
                    Update
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </FacultyProfileModal>
    </div>
  );
}