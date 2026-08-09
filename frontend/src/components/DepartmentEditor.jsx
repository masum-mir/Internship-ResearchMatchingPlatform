import { useState } from 'react';

export default function DepartmentEditor({ value = [], onChange, label = 'Target departments' }) {
  const [text, setText] = useState('');

  const add = () => {
    const v = text.trim();
    if (!v) return;
    if (!value.some((x) => x.toLowerCase() === v.toLowerCase())) onChange([...value, v]);
    setText('');
  };

  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="d-flex gap-2">
        <input
          className="form-control"
          placeholder="e.g. CSE"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" className="btn btn-outline-primary" onClick={add}>Add</button>
      </div>
      <div className="d-flex flex-wrap gap-2 mt-2">
        {value.map((d) => (
          <span className="target-chip" key={d}>
            {d}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== d))}>
              <i className="bi bi-x" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
