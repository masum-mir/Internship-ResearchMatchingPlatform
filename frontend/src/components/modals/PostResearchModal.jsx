import {
  useEffect,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import { researchApi } from '../../api/researchApi.js';
import { apiMessage } from '../../api/axiosClient.js';
import '../../css/MyResearch.css';

const CATEGORIES = [
  'LANGUAGE',
  'FRAMEWORK',
  'TOOL',
  'DATABASE'
];

const EMPTY_SKILL = {
  name: '',
  category: 'LANGUAGE'
};

function createEmptyForm() {
  return {
    topic: '',
    researchArea: '',
    description: '',
    minCgpa: '',
    duration: '',
    availablePositions: '',
    applicationDeadline: '',
    departments: '',
    skills: [{ ...EMPTY_SKILL }],
    status: ''
  };
}

function toDateTimeLocal(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 16);
  }

  const pad = (number) =>
    String(number).padStart(2, '0');

  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    'T',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes())
  ].join('');
}

export default function PostResearchModal({
  show,
  researchId = null,
  onClose,
  onSaved,
  onCreated
}) {
  const [form, setForm] = useState(
    createEmptyForm
  );

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [notice, setNotice] = useState({
    type: '',
    message: ''
  });

  const editing = Boolean(researchId);

  useEffect(() => {
    if (!show) return;

    let active = true;

    const prepareModal = async () => {
      setNotice({
        type: '',
        message: ''
      });

      if (!researchId) {
        setForm(createEmptyForm());
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response =
          await researchApi.getById(
            researchId
          );

        const item =
          response?.data ?? response;

        if (!active) return;

        setForm({
          topic: item?.topic || '',
          researchArea:
            item?.researchArea || '',
          description:
            item?.description || '',
          minCgpa:
            item?.minCgpa ?? '',
          duration:
            item?.duration || '',
          availablePositions:
            item?.availablePositions ?? '',
          applicationDeadline:
            toDateTimeLocal(
              item?.applicationDeadline
            ),
          departments: (
            item?.targetDepartments || []
          ).join(', '),
          skills:
            item?.requiredSkills?.length
              ? item.requiredSkills.map(
                  (skill) => ({
                    name: skill.name || '',
                    category:
                      skill.category ||
                      'LANGUAGE'
                  })
                )
              : [{ ...EMPTY_SKILL }],
          status: item?.status || ''
        });
      } catch (error) {
        if (!active) return;

        setNotice({
          type: 'danger',
          message: apiMessage(error)
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    prepareModal();

    return () => {
      active = false;
    };
  }, [show, researchId]);

  useEffect(() => {
    if (!show) return undefined;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    const handleEscape = (event) => {
      if (
        event.key === 'Escape' &&
        !saving
      ) {
        onClose();
      }
    };

    window.addEventListener(
      'keydown',
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [show, saving, onClose]);

  if (!show) return null;

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const updateSkill = (
    index,
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      skills: current.skills.map(
        (skill, skillIndex) =>
          skillIndex === index
            ? {
                ...skill,
                [field]: value
              }
            : skill
      )
    }));
  };

  const addSkill = () => {
    setForm((current) => ({
      ...current,
      skills: [
        ...current.skills,
        { ...EMPTY_SKILL }
      ]
    }));
  };

  const removeSkill = (index) => {
    setForm((current) => {
      if (current.skills.length === 1) {
        return current;
      }

      return {
        ...current,
        skills: current.skills.filter(
          (_, skillIndex) =>
            skillIndex !== index
        )
      };
    });
  };

  const handleClose = () => {
    if (saving) return;

    setNotice({
      type: '',
      message: ''
    });

    setForm(createEmptyForm());
    onClose();
  };

  const submit = async (event) => {
    event.preventDefault();

    setNotice({
      type: '',
      message: ''
    });

    const topic = form.topic.trim();

    if (!topic) {
      setNotice({
        type: 'danger',
        message:
          'Research topic is required.'
      });

      return;
    }

    if (
      form.minCgpa !== '' &&
      (
        Number(form.minCgpa) < 0 ||
        Number(form.minCgpa) > 4
      )
    ) {
      setNotice({
        type: 'danger',
        message:
          'Minimum CGPA must be between 0 and 4.'
      });

      return;
    }

    if (
      form.availablePositions !== '' &&
      Number(form.availablePositions) < 1
    ) {
      setNotice({
        type: 'danger',
        message:
          'Available positions must be at least 1.'
      });

      return;
    }

    const targetDepartments = [
      ...new Set(
        form.departments
          .split(',')
          .map((department) =>
            department.trim()
          )
          .filter(Boolean)
      )
    ];

    const requiredSkills =
      form.skills
        .map((skill) => ({
          name: skill.name.trim(),
          category: skill.category
        }))
        .filter((skill) => skill.name);

    const body = {
      topic,
      researchArea:
        form.researchArea.trim() || null,
      description:
        form.description.trim() || null,
      minCgpa:
        form.minCgpa === ''
          ? null
          : Number(form.minCgpa),
      duration:
        form.duration.trim() || null,
      availablePositions:
        form.availablePositions === ''
          ? null
          : Number(
              form.availablePositions
            ),
      applicationDeadline:
        form.applicationDeadline || null,
      targetDepartments,
      requiredSkills
    };

    if (editing && form.status) {
      body.status = form.status;
    }

    setSaving(true);

    try {
      const response = editing
        ? await researchApi.update(
            researchId,
            body
          )
        : await researchApi.create(body);

      const savedResearch =
        response?.data ?? response;

      if (
        !editing &&
        typeof onCreated === 'function'
      ) {
        onCreated(savedResearch);
      }

      if (
        typeof onSaved === 'function'
      ) {
        await onSaved(savedResearch);
      }

      /*
       * Notify other pages only when the parent is not
       * already handling the saved result directly.
       */
      if (
        !editing &&
        typeof onSaved !== 'function'
      ) {
        window.dispatchEvent(
          new CustomEvent(
            'research-created',
            {
              detail: savedResearch
            }
          )
        );
      }

      setForm(createEmptyForm());
      onClose();
    } catch (error) {
      setNotice({
        type: 'danger',
        message: apiMessage(error)
      });
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div
      className="research-modal-backdrop"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !saving
        ) {
          handleClose();
        }
      }}
    >
      <div
        className="research-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-research-modal-title"
      >
        <div className="research-modal-header">
          <div>
            <span className="research-modal-label">
              Research opportunity
            </span>

            <h2 id="post-research-modal-title">
              {editing
                ? 'Edit research post'
                : 'Create research post'}
            </h2>

            <p>
              {editing
                ? 'Update this research opportunity.'
                : 'Create a research opportunity for eligible students.'}
            </p>
          </div>

          <button
            type="button"
            className="research-modal-close"
            onClick={handleClose}
            disabled={saving}
            aria-label="Close modal"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="research-modal-body">
          {notice.message && (
            <div
              className={`alert alert-${notice.type} alert-dismissible`}
              role="alert"
            >
              <i className="bi bi-exclamation-circle me-2" />

              {notice.message}

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() =>
                  setNotice({
                    type: '',
                    message: ''
                  })
                }
              />
            </div>
          )}

          {loading ? (
            <div className="research-modal-loader">
              <span className="spinner-border text-primary" />
              <p>
                Loading research information...
              </p>
            </div>
          ) : (
            <form
              id="post-research-form"
              onSubmit={submit}
            >
              <section className="research-form-section">
                <div className="research-form-section-heading">
                  <span>
                    <i className="bi bi-journal-text" />
                  </span>

                  <div>
                    <h3>Basic information</h3>
                    <p>
                      Describe the research opportunity.
                    </p>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">
                      Research topic
                      <span className="text-danger ms-1">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      required
                      maxLength={255}
                      placeholder="For example: AI-based Medical Image Analysis"
                      value={form.topic}
                      onChange={(event) =>
                        updateForm(
                          'topic',
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="col-md-7">
                    <label className="form-label">
                      Research area
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      maxLength={255}
                      placeholder="For example: Artificial Intelligence"
                      value={form.researchArea}
                      onChange={(event) =>
                        updateForm(
                          'researchArea',
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="col-md-5">
                    <label className="form-label">
                      Duration
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="For example: 6 months"
                      value={form.duration}
                      onChange={(event) =>
                        updateForm(
                          'duration',
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">
                      Description
                    </label>

                    <textarea
                      className="form-control"
                      rows={5}
                      placeholder="Explain the research problem, responsibilities and outcomes."
                      value={form.description}
                      onChange={(event) =>
                        updateForm(
                          'description',
                          event.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </section>

              <section className="research-form-section">
                <div className="research-form-section-heading">
                  <span>
                    <i className="bi bi-person-check" />
                  </span>

                  <div>
                    <h3>Eligibility</h3>
                    <p>
                      Define the student requirements.
                    </p>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">
                      Minimum CGPA
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      className="form-control"
                      placeholder="3.00"
                      value={form.minCgpa}
                      onChange={(event) =>
                        updateForm(
                          'minCgpa',
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      Available positions
                    </label>

                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      placeholder="1"
                      value={
                        form.availablePositions
                      }
                      onChange={(event) =>
                        updateForm(
                          'availablePositions',
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      Application deadline
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      value={
                        form.applicationDeadline
                      }
                      onChange={(event) =>
                        updateForm(
                          'applicationDeadline',
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">
                      Target departments
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="CSE, EEE, ICE"
                      value={form.departments}
                      onChange={(event) =>
                        updateForm(
                          'departments',
                          event.target.value
                        )
                      }
                    />

                    <small className="research-form-help">
                      Separate multiple departments with commas.
                    </small>
                  </div>
                </div>
              </section>

              <section className="research-form-section">
                <div className="research-form-section-heading">
                  <span>
                    <i className="bi bi-tools" />
                  </span>

                  <div>
                    <h3>Required skills</h3>
                    <p>
                      Add the technical skills students should have.
                    </p>
                  </div>
                </div>

                <div className="research-skill-form-list">
                  {form.skills.map(
                    (skill, index) => (
                      <div
                        className="research-skill-form-row"
                        key={index}
                      >
                        <div className="research-skill-number">
                          {index + 1}
                        </div>

                        <div className="research-skill-name">
                          <label className="form-label">
                            Skill
                          </label>

                          <input
                            type="text"
                            className="form-control"
                            placeholder="For example: Python"
                            value={skill.name}
                            onChange={(event) =>
                              updateSkill(
                                index,
                                'name',
                                event.target.value
                              )
                            }
                          />
                        </div>

                        <div className="research-skill-category">
                          <label className="form-label">
                            Category
                          </label>

                          <select
                            className="form-select"
                            value={skill.category}
                            onChange={(event) =>
                              updateSkill(
                                index,
                                'category',
                                event.target.value
                              )
                            }
                          >
                            {CATEGORIES.map(
                              (category) => (
                                <option
                                  key={category}
                                  value={category}
                                >
                                  {category}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        <button
                          type="button"
                          className="research-skill-remove"
                          onClick={() =>
                            removeSkill(index)
                          }
                          disabled={
                            form.skills.length === 1
                          }
                          aria-label="Remove skill"
                          title="Remove skill"
                        >
                          <i className="bi bi-trash3" />
                        </button>
                      </div>
                    )
                  )}
                </div>

                <button
                  type="button"
                  className="research-add-skill"
                  onClick={addSkill}
                >
                  <i className="bi bi-plus-lg" />
                  Add another skill
                </button>
              </section>
            </form>
          )}
        </div>

        {!loading && (
          <div className="research-modal-footer">
            <button
              type="button"
              className="btn btn-light rounded-pill px-4"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              form="post-research-form"
              className="btn btn-primary rounded-pill px-4"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {editing
                    ? 'Saving...'
                    : 'Posting...'}
                </>
              ) : (
                <>
                  <i
                    className={`bi ${
                      editing
                        ? 'bi-check-lg'
                        : 'bi-send'
                    } me-2`}
                  />

                  {editing
                    ? 'Update research'
                    : 'Post research'}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}