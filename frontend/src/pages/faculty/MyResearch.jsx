
// import {
//   useCallback,
//   useEffect,
//   useState
// } from 'react';
// import { Link } from 'react-router-dom';
// import { researchApi } from '../../api/researchApi.js';
// import { apiMessage } from '../../api/axiosClient.js';
// import Loader from '../../components/Loader.jsx';
// import Notice from '../../components/Toast.jsx';
// import EmptyState from '../../components/EmptyState.jsx';
// import '../../css/MyResearch.css';

// const CATEGORIES = [
//   'LANGUAGE',
//   'FRAMEWORK',
//   'TOOL',
//   'DATABASE'
// ];

// const EMPTY_SKILL = {
//   name: '',
//   category: 'LANGUAGE'
// };

// const EMPTY_FORM = {
//   topic: '',
//   researchArea: '',
//   description: '',
//   minCgpa: '',
//   duration: '',
//   availablePositions: '',
//   applicationDeadline: '',
//   departments: '',
//   skills: [{ ...EMPTY_SKILL }],
//   status: ''
// };

// function toDateTimeLocal(value) {
//   if (!value) return '';

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return String(value).slice(0, 16);
//   }

//   const pad = (number) =>
//     String(number).padStart(2, '0');

//   return [
//     date.getFullYear(),
//     '-',
//     pad(date.getMonth() + 1),
//     '-',
//     pad(date.getDate()),
//     'T',
//     pad(date.getHours()),
//     ':',
//     pad(date.getMinutes())
//   ].join('');
// }

// function formatDate(value) {
//   if (!value) return 'No deadline';

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return value;
//   }

//   return new Intl.DateTimeFormat('en', {
//     dateStyle: 'medium',
//     timeStyle: 'short'
//   }).format(date);
// }

// function getStatusClass(status) {
//   switch (status) {
//     case 'ACTIVE':
//       return 'research-status-active';

//     case 'CLOSED':
//       return 'research-status-closed';

//     case 'DRAFT':
//       return 'research-status-draft';

//     default:
//       return 'research-status-default';
//   }
// }

// function ResearchModal({
//   show,
//   editing,
//   loading,
//   saving,
//   form,
//   onChange,
//   onSkillChange,
//   onAddSkill,
//   onRemoveSkill,
//   onSubmit,
//   onClose
// }) {
//   useEffect(() => {
//     if (!show) return undefined;

//     const previousOverflow =
//       document.body.style.overflow;

//     document.body.style.overflow = 'hidden';

//     const handleEscape = (event) => {
//       if (
//         event.key === 'Escape' &&
//         !saving
//       ) {
//         onClose();
//       }
//     };

//     window.addEventListener(
//       'keydown',
//       handleEscape
//     );

//     return () => {
//       document.body.style.overflow =
//         previousOverflow;

//       window.removeEventListener(
//         'keydown',
//         handleEscape
//       );
//     };
//   }, [show, saving, onClose]);

//   if (!show) return null;

//   return (
//     <div
//       className="research-modal-backdrop"
//       onMouseDown={(event) => {
//         if (
//           event.target === event.currentTarget &&
//           !saving
//         ) {
//           onClose();
//         }
//       }}
//     >
//       <div
//         className="research-modal-dialog"
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="research-modal-title"
//       >
//         <div className="research-modal-header">
//           <div>
//             <span className="research-modal-label">
//               Research opportunity
//             </span>

//             <h2 id="research-modal-title">
//               {editing
//                 ? 'Edit research post'
//                 : 'Create research post'}
//             </h2>

//             <p>
//               {editing
//                 ? 'Update the information for this research opportunity.'
//                 : 'Create a research opportunity for eligible students.'}
//             </p>
//           </div>

//           <button
//             type="button"
//             className="research-modal-close"
//             onClick={onClose}
//             disabled={saving}
//             aria-label="Close modal"
//           >
//             <i className="bi bi-x-lg" />
//           </button>
//         </div>

//         <div className="research-modal-body">
//           {loading ? (
//             <div className="research-modal-loader">
//               <span className="spinner-border text-primary" />
//               <p>Loading research information...</p>
//             </div>
//           ) : (
//             <form
//               id="research-form"
//               onSubmit={onSubmit}
//             >
//               <section className="research-form-section">
//                 <div className="research-form-section-heading">
//                   <span>
//                     <i className="bi bi-journal-text" />
//                   </span>

//                   <div>
//                     <h3>Basic information</h3>
//                     <p>
//                       Describe the research opportunity.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="row g-3">
//                   <div className="col-12">
//                     <label className="form-label">
//                       Research topic
//                       <span className="text-danger ms-1">
//                         *
//                       </span>
//                     </label>

//                     <input
//                       type="text"
//                       className="form-control"
//                       required
//                       maxLength={255}
//                       placeholder="For example: AI-based Medical Image Analysis"
//                       value={form.topic}
//                       onChange={(event) =>
//                         onChange(
//                           'topic',
//                           event.target.value
//                         )
//                       }
//                     />
//                   </div>

//                   <div className="col-md-7">
//                     <label className="form-label">
//                       Research area
//                     </label>

//                     <input
//                       type="text"
//                       className="form-control"
//                       maxLength={255}
//                       placeholder="For example: Artificial Intelligence"
//                       value={form.researchArea}
//                       onChange={(event) =>
//                         onChange(
//                           'researchArea',
//                           event.target.value
//                         )
//                       }
//                     />
//                   </div>

//                   <div className="col-md-5">
//                     <label className="form-label">
//                       Duration
//                     </label>

//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="For example: 6 months"
//                       value={form.duration}
//                       onChange={(event) =>
//                         onChange(
//                           'duration',
//                           event.target.value
//                         )
//                       }
//                     />
//                   </div>

//                   <div className="col-12">
//                     <label className="form-label">
//                       Description
//                     </label>

//                     <textarea
//                       className="form-control"
//                       rows={5}
//                       placeholder="Explain the research problem, expected work, responsibilities and outcomes."
//                       value={form.description}
//                       onChange={(event) =>
//                         onChange(
//                           'description',
//                           event.target.value
//                         )
//                       }
//                     />
//                   </div>
//                 </div>
//               </section>

//               <section className="research-form-section">
//                 <div className="research-form-section-heading">
//                   <span>
//                     <i className="bi bi-person-check" />
//                   </span>

//                   <div>
//                     <h3>Eligibility</h3>
//                     <p>
//                       Define the student requirements.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="row g-3">
//                   <div className="col-md-4">
//                     <label className="form-label">
//                       Minimum CGPA
//                     </label>

//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       max="4"
//                       className="form-control"
//                       placeholder="3.00"
//                       value={form.minCgpa}
//                       onChange={(event) =>
//                         onChange(
//                           'minCgpa',
//                           event.target.value
//                         )
//                       }
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label className="form-label">
//                       Available positions
//                     </label>

//                     <input
//                       type="number"
//                       min="1"
//                       className="form-control"
//                       placeholder="1"
//                       value={form.availablePositions}
//                       onChange={(event) =>
//                         onChange(
//                           'availablePositions',
//                           event.target.value
//                         )
//                       }
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label className="form-label">
//                       Application deadline
//                     </label>

//                     <input
//                       type="datetime-local"
//                       className="form-control"
//                       value={form.applicationDeadline}
//                       onChange={(event) =>
//                         onChange(
//                           'applicationDeadline',
//                           event.target.value
//                         )
//                       }
//                     />
//                   </div>

//                   <div className="col-12">
//                     <label className="form-label">
//                       Target departments
//                     </label>

//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="CSE, EEE, ICE"
//                       value={form.departments}
//                       onChange={(event) =>
//                         onChange(
//                           'departments',
//                           event.target.value
//                         )
//                       }
//                     />

//                     <small className="research-form-help">
//                       Separate multiple departments with
//                       commas.
//                     </small>
//                   </div>
//                 </div>
//               </section>

//               <section className="research-form-section">
//                 <div className="research-form-section-heading">
//                   <span>
//                     <i className="bi bi-tools" />
//                   </span>

//                   <div>
//                     <h3>Required skills</h3>
//                     <p>
//                       Add the technical skills students
//                       should have.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="research-skill-form-list">
//                   {form.skills.map((skill, index) => (
//                     <div
//                       className="research-skill-form-row"
//                       key={index}
//                     >
//                       <div className="research-skill-number">
//                         {index + 1}
//                       </div>

//                       <div className="research-skill-name">
//                         <label className="form-label">
//                           Skill
//                         </label>

//                         <input
//                           type="text"
//                           className="form-control"
//                           placeholder="For example: Python"
//                           value={skill.name}
//                           onChange={(event) =>
//                             onSkillChange(
//                               index,
//                               'name',
//                               event.target.value
//                             )
//                           }
//                         />
//                       </div>

//                       <div className="research-skill-category">
//                         <label className="form-label">
//                           Category
//                         </label>

//                         <select
//                           className="form-select"
//                           value={skill.category}
//                           onChange={(event) =>
//                             onSkillChange(
//                               index,
//                               'category',
//                               event.target.value
//                             )
//                           }
//                         >
//                           {CATEGORIES.map(
//                             (category) => (
//                               <option
//                                 key={category}
//                                 value={category}
//                               >
//                                 {category}
//                               </option>
//                             )
//                           )}
//                         </select>
//                       </div>

//                       <button
//                         type="button"
//                         className="research-skill-remove"
//                         onClick={() =>
//                           onRemoveSkill(index)
//                         }
//                         disabled={
//                           form.skills.length === 1
//                         }
//                         aria-label="Remove skill"
//                         title="Remove skill"
//                       >
//                         <i className="bi bi-trash3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 <button
//                   type="button"
//                   className="research-add-skill"
//                   onClick={onAddSkill}
//                 >
//                   <i className="bi bi-plus-lg" />
//                   Add another skill
//                 </button>
//               </section>
//             </form>
//           )}
//         </div>

//         {!loading && (
//           <div className="research-modal-footer">
//             <button
//               type="button"
//               className="btn btn-light rounded-pill px-4"
//               onClick={onClose}
//               disabled={saving}
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               form="research-form"
//               className="btn btn-primary rounded-pill px-4"
//               disabled={saving}
//             >
//               {saving ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" />
//                   {editing
//                     ? 'Saving...'
//                     : 'Posting...'}
//                 </>
//               ) : (
//                 <>
//                   <i
//                     className={`bi ${
//                       editing
//                         ? 'bi-check-lg'
//                         : 'bi-send'
//                     } me-2`}
//                   />

//                   {editing
//                     ? 'Update'
//                     : 'Post research'}
//                 </>
//               )}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function MyResearch() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] =
//     useState(true);

//   const [notice, setNotice] = useState({
//     type: '',
//     message: ''
//   });

//   const [showModal, setShowModal] =
//     useState(false);

//   const [editingId, setEditingId] =
//     useState(null);

//   const [modalLoading, setModalLoading] =
//     useState(false);

//   const [saving, setSaving] =
//     useState(false);

//   const [form, setForm] = useState({
//     ...EMPTY_FORM,
//     skills: [{ ...EMPTY_SKILL }]
//   });

//   const load = useCallback(
//     async (showPageLoader = true) => {
//       if (showPageLoader) {
//         setLoading(true);
//       }

//       try {
//         const response =
//           await researchApi.mine();

//         const data =
//           response?.data ?? response;

//         setItems(
//           Array.isArray(data) ? data : []
//         );
//       } catch (error) {
//         setNotice({
//           type: 'danger',
//           message: apiMessage(error)
//         });
//       } finally {
//         if (showPageLoader) {
//           setLoading(false);
//         }
//       }
//     },
//     []
//   );

//   useEffect(() => {
//     load();
//   }, [load]);

//   const resetForm = () => {
//     setForm({
//       ...EMPTY_FORM,
//       skills: [{ ...EMPTY_SKILL }]
//     });
//   };

//   const openCreateModal = () => {
//     setEditingId(null);
//     resetForm();
//     setShowModal(true);
//   };

//   const openEditModal = async (id) => {
//     setEditingId(id);
//     setShowModal(true);
//     setModalLoading(true);

//     try {
//       const response =
//         await researchApi.getById(id);

//       const item =
//         response?.data ?? response;

//       setForm({
//         topic: item?.topic || '',
//         researchArea:
//           item?.researchArea || '',
//         description:
//           item?.description || '',
//         minCgpa:
//           item?.minCgpa ?? '',
//         duration:
//           item?.duration || '',
//         availablePositions:
//           item?.availablePositions ?? '',
//         applicationDeadline:
//           toDateTimeLocal(
//             item?.applicationDeadline
//           ),
//         departments: (
//           item?.targetDepartments || []
//         ).join(', '),
//         skills:
//           item?.requiredSkills?.length
//             ? item.requiredSkills.map(
//                 (skill) => ({
//                   name: skill.name || '',
//                   category:
//                     skill.category ||
//                     'LANGUAGE'
//                 })
//               )
//             : [{ ...EMPTY_SKILL }],
//         status: item?.status || ''
//       });
//     } catch (error) {
//       setNotice({
//         type: 'danger',
//         message: apiMessage(error)
//       });

//       setShowModal(false);
//       setEditingId(null);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const closeModal = useCallback(() => {
//     if (saving) return;

//     setShowModal(false);
//     setEditingId(null);
//     setModalLoading(false);
//     resetForm();
//   }, [saving]);

//   const updateForm = (field, value) => {
//     setForm((current) => ({
//       ...current,
//       [field]: value
//     }));
//   };

//   const updateSkill = (
//     index,
//     field,
//     value
//   ) => {
//     setForm((current) => ({
//       ...current,
//       skills: current.skills.map(
//         (skill, skillIndex) =>
//           skillIndex === index
//             ? {
//                 ...skill,
//                 [field]: value
//               }
//             : skill
//       )
//     }));
//   };

//   const addSkill = () => {
//     setForm((current) => ({
//       ...current,
//       skills: [
//         ...current.skills,
//         { ...EMPTY_SKILL }
//       ]
//     }));
//   };

//   const removeSkill = (index) => {
//     setForm((current) => {
//       if (current.skills.length === 1) {
//         return current;
//       }

//       return {
//         ...current,
//         skills: current.skills.filter(
//           (_, skillIndex) =>
//             skillIndex !== index
//         )
//       };
//     });
//   };

//   const submit = async (event) => {
//     event.preventDefault();

//     const trimmedTopic =
//       form.topic.trim();

//     if (!trimmedTopic) {
//       setNotice({
//         type: 'danger',
//         message:
//           'Research topic is required.'
//       });

//       return;
//     }

//     const departments = [
//       ...new Set(
//         form.departments
//           .split(',')
//           .map((department) =>
//             department.trim()
//           )
//           .filter(Boolean)
//       )
//     ];

//     const requiredSkills =
//       form.skills
//         .map((skill) => ({
//           name: skill.name.trim(),
//           category: skill.category
//         }))
//         .filter((skill) => skill.name);

//     const body = {
//       topic: trimmedTopic,
//       researchArea:
//         form.researchArea.trim() || null,
//       description:
//         form.description.trim() || null,

//       minCgpa:
//         form.minCgpa === ''
//           ? null
//           : Number(form.minCgpa),

//       duration:
//         form.duration.trim() || null,

//       availablePositions:
//         form.availablePositions === ''
//           ? null
//           : Number(
//               form.availablePositions
//             ),

//       applicationDeadline:
//         form.applicationDeadline || null,

//       targetDepartments: departments,
//       requiredSkills
//     };

//     /*
//      * Preserve the existing status during edit
//      * when the backend request supports status.
//      */
//     if (editingId && form.status) {
//       body.status = form.status;
//     }

//     setSaving(true);

//     try {
//       if (editingId) {
//         await researchApi.update(
//           editingId,
//           body
//         );
//       } else {
//         await researchApi.create(body);
//       }

//       await load(false);

//       setNotice({
//         type: 'success',
//         message: editingId
//           ? 'Research post updated successfully.'
//           : 'Research opportunity posted successfully.'
//       });

//       setShowModal(false);
//       setEditingId(null);
//       resetForm();

//       window.scrollTo({
//         top: 0,
//         behavior: 'smooth'
//       });
//     } catch (error) {
//       setNotice({
//         type: 'danger',
//         message: apiMessage(error)
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const remove = async (id) => {
//     const confirmed = window.confirm(
//       'Are you sure you want to delete this research post?'
//     );

//     if (!confirmed) return;

//     try {
//       await researchApi.remove(id);
//       await load(false);

//       setNotice({
//         type: 'success',
//         message:
//           'Research post deleted successfully.'
//       });
//     } catch (error) {
//       setNotice({
//         type: 'danger',
//         message: apiMessage(error)
//       });
//     }
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className="my-research-page">
//       <div className="my-research-heading">
//         <div>
//           <span className="my-research-eyebrow">
//             Faculty workspace
//           </span>

//           <h1>My Research</h1>

//           <p>
//             Create research opportunities and
//             manage student applications.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="research-create-button"
//           onClick={openCreateModal}
//         >
//           <i className="bi bi-plus-lg" />
//           New research
//         </button>
//       </div>

//       <Notice
//         type={notice.type}
//         message={notice.message}
//         onClose={() =>
//           setNotice({
//             type: '',
//             message: ''
//           })
//         }
//       />

//       <div className="research-summary-row">
//         <div className="research-summary-item">
//           <span className="research-summary-icon">
//             <i className="bi bi-journal-text" />
//           </span>

//           <div>
//             <strong>{items.length}</strong>
//             <small>Total posts</small>
//           </div>
//         </div>

//         <div className="research-summary-item">
//           <span className="research-summary-icon active">
//             <i className="bi bi-broadcast" />
//           </span>

//           <div>
//             <strong>
//               {
//                 items.filter(
//                   (item) =>
//                     item.status === 'ACTIVE'
//                 ).length
//               }
//             </strong>

//             <small>Active posts</small>
//           </div>
//         </div>

//         <div className="research-summary-item">
//           <span className="research-summary-icon positions">
//             <i className="bi bi-people" />
//           </span>

//           <div>
//             <strong>
//               {items.reduce(
//                 (total, item) =>
//                   total +
//                   Number(
//                     item.availablePositions ||
//                       0
//                   ),
//                 0
//               )}
//             </strong>

//             <small>Available positions</small>
//           </div>
//         </div>
//       </div>

//       {items.length === 0 ? (
//         <div className="research-empty-wrapper">
//           <EmptyState
//             icon="bi-journal-text"
//             title="No research posts yet"
//           />

//           <button
//             type="button"
//             className="btn btn-primary rounded-pill px-4"
//             onClick={openCreateModal}
//           >
//             <i className="bi bi-plus-lg me-2" />
//             Create first research post
//           </button>
//         </div>
//       ) : (
//         <div className="research-card-grid">
//           {items.map((item) => (
//             <article
//               className="research-management-card"
//               key={item.id}
//             >
//               <div className="research-card-top">
//                 <div className="research-card-icon">
//                   <i className="bi bi-lightbulb" />
//                 </div>

//                 <span
//                   className={`research-status ${getStatusClass(
//                     item.status
//                   )}`}
//                 >
//                   {item.status || 'UNKNOWN'}
//                 </span>
//               </div>

//               <div className="research-card-content">
//                 <span className="research-card-area">
//                   {item.researchArea ||
//                     'General research'}
//                 </span>

//                 <h2>{item.topic}</h2>

//                 {item.description && (
//                   <p className="research-card-description">
//                     {item.description}
//                   </p>
//                 )}

//                 <div className="research-card-meta">
//                   <span>
//                     <i className="bi bi-clock" />

//                     {item.duration ||
//                       'Duration not specified'}
//                   </span>

//                   <span>
//                     <i className="bi bi-mortarboard" />

//                     {item.minCgpa != null
//                       ? `Minimum CGPA ${item.minCgpa}`
//                       : 'No CGPA restriction'}
//                   </span>

//                   <span>
//                     <i className="bi bi-person-plus" />

//                     {item.availablePositions !=
//                     null
//                       ? `${item.availablePositions} position${
//                           Number(
//                             item.availablePositions
//                           ) === 1
//                             ? ''
//                             : 's'
//                         }`
//                       : 'Positions not specified'}
//                   </span>

//                   <span>
//                     <i className="bi bi-calendar-event" />

//                     {formatDate(
//                       item.applicationDeadline
//                     )}
//                   </span>
//                 </div>

//                 {item.requiredSkills?.length >
//                   0 && (
//                   <div className="research-card-skills">
//                     {item.requiredSkills
//                       .slice(0, 4)
//                       .map((skill) => (
//                         <span
//                           key={
//                             skill.id ||
//                             `${item.id}-${skill.name}`
//                           }
//                         >
//                           {skill.name}
//                         </span>
//                       ))}

//                     {item.requiredSkills.length >
//                       4 && (
//                       <span>
//                         +
//                         {item.requiredSkills
//                           .length - 4}
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div className="research-card-actions">
//                 <Link
//                   to={`/faculty/research/${item.id}/applicants`}
//                   className="research-applicants-button"
//                 >
//                   <i className="bi bi-people" />
//                   Applicants
//                 </Link>

//                 <button
//                   type="button"
//                   className="research-edit-button"
//                   onClick={() =>
//                     openEditModal(item.id)
//                   }
//                   aria-label="Edit research post"
//                   title="Edit research post"
//                 >
//                   <i className="bi bi-pencil" />
//                 </button>

//                 <button
//                   type="button"
//                   className="research-delete-button"
//                   onClick={() =>
//                     remove(item.id)
//                   }
//                   aria-label="Delete research post"
//                   title="Delete research post"
//                 >
//                   <i className="bi bi-trash3" />
//                 </button>
//               </div>
//             </article>
//           ))}
//         </div>
//       )}

//       <ResearchModal
//         show={showModal}
//         editing={Boolean(editingId)}
//         loading={modalLoading}
//         saving={saving}
//         form={form}
//         onChange={updateForm}
//         onSkillChange={updateSkill}
//         onAddSkill={addSkill}
//         onRemoveSkill={removeSkill}
//         onSubmit={submit}
//         onClose={closeModal}
//       />
//     </div>
//   );
// }

import {
  useCallback,
  useEffect,
  useState
} from 'react';
import { Link } from 'react-router-dom';
import { researchApi } from '../../api/researchApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import Loader from '../../components/Loader.jsx';
import Notice from '../../components/Toast.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import PostResearchModal from '../../components/modals/PostResearchModal.jsx';
import '../../css/MyResearch.css';

function formatDate(value) {
  if (!value) return 'No deadline';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

function getStatusClass(status) {
  switch (status) {
    case 'ACTIVE':
      return 'research-status-active';

    case 'CLOSED':
      return 'research-status-closed';

    case 'DRAFT':
      return 'research-status-draft';

    default:
      return 'research-status-default';
  }
}

export default function MyResearch() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [notice, setNotice] = useState({
    type: '',
    message: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const load = useCallback(
    async (showPageLoader = true) => {
      if (showPageLoader) {
        setLoading(true);
      }

      try {
        const response = await researchApi.mine();
        const data = response?.data ?? response;

        setItems(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        setNotice({
          type: 'danger',
          message: apiMessage(error)
        });
      } finally {
        if (showPageLoader) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  /*
   * If a research post is created from the Sidebar modal,
   * refresh this page automatically.
   */
  useEffect(() => {
    const handleResearchCreated = () => {
      load(false);

      setNotice({
        type: 'success',
        message:
          'Research opportunity posted successfully.'
      });
    };

    window.addEventListener(
      'research-created',
      handleResearchCreated
    );

    return () => {
      window.removeEventListener(
        'research-created',
        handleResearchCreated
      );
    };
  }, [load]);

  const openCreateModal = () => {
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (id) => {
    setEditingId(id);
    setShowModal(true);
  };

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingId(null);
  }, []);

  /*
   * PostResearchModal should call onSaved after
   * a successful create or update request.
   */
  const handleSaved = async (savedResearch) => {
    const wasEditing = Boolean(editingId);

    await load(false);

    setNotice({
      type: 'success',
      message: wasEditing
        ? 'Research post updated successfully.'
        : 'Research opportunity posted successfully.'
    });

    setShowModal(false);
    setEditingId(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    return savedResearch;
  };

  const remove = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this research post?'
    );

    if (!confirmed) return;

    try {
      await researchApi.remove(id);
      await load(false);

      setNotice({
        type: 'success',
        message:
          'Research post deleted successfully.'
      });
    } catch (error) {
      setNotice({
        type: 'danger',
        message: apiMessage(error)
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  const activePosts = items.filter(
    (item) => item.status === 'ACTIVE'
  ).length;

  const totalPositions = items.reduce(
    (total, item) =>
      total +
      Number(item.availablePositions || 0),
    0
  );

  return (
    <div className="my-research-page">
      <div className="my-research-heading">
        <div> 

          <h1>My Research</h1>

          <p>
            Create research opportunities and
            manage student applications.
          </p>
        </div>

        <button
          type="button"
          className="research-create-button"
          onClick={openCreateModal}
        >
          <i className="bi bi-plus-lg" />
          New research
        </button>
      </div>

      <Notice
        type={notice.type}
        message={notice.message}
        onClose={() =>
          setNotice({
            type: '',
            message: ''
          })
        }
      />

      <div className="research-summary-row">
        <div className="research-summary-item">
          <span className="research-summary-icon">
            <i className="bi bi-journal-text" />
          </span>

          <div>
            <strong>{items.length}</strong>
            <small>Total posts</small>
          </div>
        </div>

        <div className="research-summary-item">
          <span className="research-summary-icon active">
            <i className="bi bi-broadcast" />
          </span>

          <div>
            <strong>{activePosts}</strong>
            <small>Active posts</small>
          </div>
        </div>

        <div className="research-summary-item">
          <span className="research-summary-icon positions">
            <i className="bi bi-people" />
          </span>

          <div>
            <strong>{totalPositions}</strong>
            <small>Available positions</small>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="research-empty-wrapper">
          <EmptyState
            icon="bi-journal-text"
            title="No research posts yet"
          />

          <button
            type="button"
            className="btn btn-primary rounded-pill px-4"
            onClick={openCreateModal}
          >
            <i className="bi bi-plus-lg me-2" />
            Create first research post
          </button>
        </div>
      ) : (
        <div className="research-card-grid">
          {items.map((item) => (
            <article
              className="research-management-card"
              key={item.id}
            >
              <div className="research-card-top">
                <div className="research-card-icon">
                  <i className="bi bi-lightbulb" />
                </div>

                <span
                  className={`research-status ${getStatusClass(
                    item.status
                  )}`}
                >
                  {item.status || 'UNKNOWN'}
                </span>
              </div>

              <div className="research-card-content">
                <span className="research-card-area">
                  {item.researchArea ||
                    'General research'}
                </span>

                <h2>{item.topic}</h2>

                {item.description && (
                  <p className="research-card-description">
                    {item.description}
                  </p>
                )}

                <div className="research-card-meta">
                  <span>
                    <i className="bi bi-clock" />

                    {item.duration ||
                      'Duration not specified'}
                  </span>

                  <span>
                    <i className="bi bi-mortarboard" />

                    {item.minCgpa != null
                      ? `Minimum CGPA ${item.minCgpa}`
                      : 'No CGPA restriction'}
                  </span>

                  <span>
                    <i className="bi bi-person-plus" />

                    {item.availablePositions != null
                      ? `${item.availablePositions} position${
                          Number(
                            item.availablePositions
                          ) === 1
                            ? ''
                            : 's'
                        }`
                      : 'Positions not specified'}
                  </span>

                  <span>
                    <i className="bi bi-calendar-event" />

                    {formatDate(
                      item.applicationDeadline
                    )}
                  </span>
                </div>

                {item.requiredSkills?.length > 0 && (
                  <div className="research-card-skills">
                    {item.requiredSkills
                      .slice(0, 4)
                      .map((skill) => (
                        <span
                          key={
                            skill.id ||
                            `${item.id}-${skill.name}`
                          }
                        >
                          {skill.name}
                        </span>
                      ))}

                    {item.requiredSkills.length > 4 && (
                      <span>
                        +
                        {item.requiredSkills.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="research-card-actions">
                <Link
                  to={`/faculty/research/${item.id}/applicants`}
                  className="research-applicants-button"
                >
                  <i className="bi bi-people" />
                  Applicants
                </Link>

                <button
                  type="button"
                  className="research-edit-button"
                  onClick={() =>
                    openEditModal(item.id)
                  }
                  aria-label="Edit research post"
                  title="Edit research post"
                >
                  <i className="bi bi-pencil" />
                </button>

                <button
                  type="button"
                  className="research-delete-button"
                  onClick={() =>
                    remove(item.id)
                  }
                  aria-label="Delete research post"
                  title="Delete research post"
                >
                  <i className="bi bi-trash3" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <PostResearchModal
        show={showModal}
        researchId={editingId}
        onClose={closeModal}
        onSaved={handleSaved}
      />
    </div>
  );
}