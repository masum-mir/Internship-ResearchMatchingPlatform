import { enumLabel } from '../utils/format.js';

const CATEGORIES = ['LANGUAGE', 'FRAMEWORK', 'TOOL', 'DATABASE'];

export default function SkillRequestEditor({ value = [], onChange }) {
  const add = () => onChange([...(value || []), { name: '', category: 'TOOL' }]);
  const update = (index, patch) =>
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  const remove = (index) => onChange(value.filter((_, i) => i !== index));

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <label className="form-label mb-0">Required skills</label>
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={add}>
          <i className="bi bi-plus-lg me-1" /> Add skill
        </button>
      </div>

      {value.length === 0 && (
        <div className="form-text mb-2">No skill requirement added yet.</div>
      )}

      <div className="required-skill-editor">
        {value.map((skill, index) => (
          <div className="required-skill-row" key={index}>
            <input
              className="form-control"
              placeholder="Skill name"
              value={skill.name || ''}
              onChange={(e) => update(index, { name: e.target.value })}
            />
            <select
              className="form-select"
              value={skill.category || 'TOOL'}
              onChange={(e) => update(index, { category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option value={c} key={c}>{enumLabel(c)}</option>
              ))}
            </select>
            <button
              type="button"
              className="icon-button text-danger"
              onClick={() => remove(index)}
              aria-label="Remove skill"
            >
              <i className="bi bi-trash" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
