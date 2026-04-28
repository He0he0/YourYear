import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Select } from './UI';

const EMPTY = { code: '', title: '', units: '', description: '', prerequisites: '', notes: '', grade: '' };

export default function CourseModal({ open, onClose, onSave, initial = null, title = 'Add Course' }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) setForm(initial ? { ...EMPTY, ...initial } : EMPTY);
    setErrors({});
  }, [open, initial]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = 'Required';
    if (!form.title.trim()) e.title = 'Required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, units: form.units ? Number(form.units) : null });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input label="Course Code *" placeholder="e.g. CS 101" value={form.code}
            onChange={e => set('code', e.target.value)} error={errors.code} />
          <Input label="Units" placeholder="e.g. 4" type="number" value={form.units}
            onChange={e => set('units', e.target.value)} />
        </div>
        <Input label="Course Title *" placeholder="e.g. Introduction to CS" value={form.title}
          onChange={e => set('title', e.target.value)} error={errors.title} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>Description</label>
          <textarea
            placeholder="Brief description of the course..."
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={3}
            style={{
              width: '100%', padding: '10px 12px', resize: 'vertical',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)',
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>
        <Input label="Prerequisites" placeholder="e.g. CS 50, MATH 101" value={form.prerequisites}
          onChange={e => set('prerequisites', e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Select label="Grade" value={form.grade} onChange={e => set('grade', e.target.value)}>
            <option value="">—</option>
            {['A+','A','A-','B+','B','B-','C+','C','C-','D','F','P','NP','IP'].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </Select>
          <Input label="Notes" placeholder="Any notes..." value={form.notes}
            onChange={e => set('notes', e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Course</Button>
        </div>
      </div>
    </Modal>
  );
}
