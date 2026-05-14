import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext, DragOverlay, closestCorners, pointerWithin,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { usePlanner } from '../context/PlannerContext';
import { useAuth } from '../context/AuthContext';
import Clipboard from '../components/Clipboard';
import TermColumn from '../components/TermColumn';
import CourseCard from '../components/CourseCard';
import CourseModal from '../components/CourseModal';
import CourseDetailPanel from '../components/CourseDetailPanel';
import { Button, Modal, Input } from '../components/UI';

export default function Planner() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    years, clipboard, loaded,
    addYear, removeYear, addTerm, removeTerm, renameTerm,
    addCourseToClipboard, moveCourseToTerm, moveCoursesToTerm, moveCourseToClipboard,
    editCourse, deleteCourse,
  } = usePlanner();

  const [activeCourse, setActiveCourse] = useState(null);
  const [dragOverClipboard, setDragOverClipboard] = useState(false);
  const [courseModal, setCourseModal] = useState({ open: false, course: null });
  const [detailPanel, setDetailPanel] = useState({ course: null, editMode: false });

  const openDetailPanel = (course, editMode = false) => setDetailPanel({ course, editMode });
  const closeDetailPanel = () => setDetailPanel({ course: null, editMode: false });
  const handlePanelSave = (courseId, updates) => {
    editCourse(courseId, updates);
    setDetailPanel(p => ({ ...p, course: { ...p.course, ...updates } }));
  };
  const [addTermModal, setAddTermModal] = useState({ open: false, yearId: null });
  const [customTermName, setCustomTermName] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggleSelect = (id) => setSelectedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const clearSelection = () => setSelectedIds(new Set());

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // ─── Drag ─────────────────────────────────────────────────────────────────

  const findCourse = (id) => {
    const inClip = clipboard.find(c => c.id === id);
    if (inClip) return inClip;
    for (const y of years) {
      for (const t of y.terms) {
        const found = t.courses.find(c => c.id === id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleDragStart = ({ active }) => {
    setActiveCourse(findCourse(active.id));
  };

  const handleDragOver = ({ over }) => {
    if (!over) { setDragOverClipboard(false); return; }
    const dest = over.id;
    setDragOverClipboard(dest === 'clipboard' || !!clipboard.find(c => c.id === dest));
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveCourse(null);
    setDragOverClipboard(false);
    if (!over) return;
    const courseId = active.id;
    const dest = over.id;
    const isMulti = selectedIds.has(courseId) && selectedIds.size > 1;

    if (dest === 'clipboard') {
      moveCourseToClipboard(courseId);
      if (isMulti) clearSelection();
      return;
    }

    if (typeof dest === 'string' && dest.startsWith('term:')) {
      const [, yearId, termId] = dest.split(':');
      if (isMulti) { moveCoursesToTerm([...selectedIds], yearId, termId); clearSelection(); }
      else moveCourseToTerm(courseId, yearId, termId);
      return;
    }

    // Dropped on another card - find its container
    for (const y of years) {
      for (const t of y.terms) {
        if (t.courses.find(c => c.id === dest)) {
          if (isMulti) { moveCoursesToTerm([...selectedIds], y.id, t.id); clearSelection(); }
          else moveCourseToTerm(courseId, y.id, t.id);
          return;
        }
      }
    }
    if (clipboard.find(c => c.id === dest)) {
      moveCourseToClipboard(courseId);
    }
  };

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const openAddCourse = () => setCourseModal({ open: true, course: null });
  const openEditCourse = (course) => setCourseModal({ open: true, course });
  const closeCourseModal = () => setCourseModal({ open: false, course: null });

  const handleSaveCourse = (data) => {
    if (courseModal.course) {
      editCourse(courseModal.course.id, data);
    } else {
      addCourseToClipboard(data);
    }
  };

  const handleAddTerm = () => {
    if (!customTermName.trim()) return;
    addTerm(addTermModal.yearId, customTermName.trim());
    setAddTermModal({ open: false, yearId: null });
    setCustomTermName('');
  };

  const TERM_SUGGESTIONS = user?.structure === 'quarter'
    ? ['Fall', 'Winter', 'Spring', 'Summer']
    : ['Fall', 'Spring', 'Summer'];

  if (!loaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading your planner…</div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={(args) => {
        const within = pointerWithin(args);
        return within.length > 0 ? within : closestCorners(args);
      }}
      onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

        {/* Sidebar */}
        <Clipboard
          courses={clipboard}
          onAddCourse={openAddCourse}
          onEditCourse={openEditCourse}
          onDeleteCourse={deleteCourse}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onClearSelection={clearSelection}
          isDragOver={dragOverClipboard}
          onExpandCourse={openDetailPanel}
        />

        {/* Main planner area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Topbar */}
          <div style={{
            padding: '14px 24px', borderBottom: '1px solid var(--border)',
            background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 34, height: 34, background: 'var(--accent)', borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="4" width="14" height="11" rx="1.5" stroke="white" strokeWidth="1.5"/>
                  <line x1="5.5" y1="2" x2="5.5" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="12.5" y1="2" x2="12.5" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="5" y1="9.5" x2="13" y2="9.5" stroke="white" strokeWidth="1.2"/>
                  <line x1="5" y1="12.5" x2="9" y2="12.5" stroke="white" strokeWidth="1.2"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>YourYear</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={logout}
                style={{
                  background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
                  borderRadius: '999px', padding: '8px 20px', fontSize: '14px', fontWeight: 500,
                }}
              >
                Log out
              </button>
              <button
                onClick={() => navigate('/profile')}
                style={{
                  background: '#1A1814', color: '#fff', border: 'none', cursor: 'pointer',
                  borderRadius: '50%', width: '36px', height: '36px', fontSize: '14px', fontWeight: 600,
                }}
                title="Profile"
              >
                {user?.name?.[0]?.toUpperCase() || '?'}
              </button>
            </div>
          </div>

          {/* Years scroll area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--surface)' }}>
            {years.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '60%', gap: '16px', color: 'var(--text-muted)',
              }}>
                <div style={{ fontSize: '40px' }}>📅</div>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>No years yet</div>
                <p style={{ fontSize: '14px', textAlign: 'center', maxWidth: '300px', lineHeight: 1.6 }}>
                  Click <strong>+ Add Year</strong> to start building your plan.
                </p>
                <Button onClick={addYear} style={{ borderRadius: '999px', padding: '12px 32px', fontSize: '15px' }}>+ Add Year</Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {years.map((year, yi) => (
                  <div key={year.id}>
                    {/* Year header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '34px', margin: 0 }}>
                          {user?.startYear ? String(user.startYear + yi) : year.label}
                        </h2>
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="var(--border)">
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.466 7.56A.5.5 0 0 1 6.5 14H6v-.5a.5.5 0 0 0-.5-.5H5v-.5a.5.5 0 0 0-.5-.5H4v-.5a.5.5 0 0 0-.5-.5H3v-.5a.5.5 0 0 0-.5-.5H2.5l-.761 2.284a.5.5 0 0 0 .62.62z"/>
                        </svg>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          Total Units: {year.terms.reduce((s, t) => s + t.courses.reduce((u, c) => u + (Number(c.units) || 0), 0), 0)}
                        </span>
                        <Button variant="ghost" size="sm" style={{ color: 'var(--danger)', padding: '4px 8px' }}
                          onClick={() => removeYear(year.id)}>
                          Remove year
                        </Button>
                      </div>
                    </div>

                    {/* Terms */}
                    <div style={{
                      background: 'var(--bg)', borderRadius: 'var(--radius-lg)',
                      padding: '20px', display: 'flex', gap: '16px',
                      overflowX: 'auto', paddingBottom: '20px',
                    }}>
                      {year.terms.map(term => (
                        <TermColumn
                          key={term.id}
                          yearId={year.id}
                          term={term}
                          onEditCourse={openEditCourse}
                          onDeleteCourse={deleteCourse}
                          onSendToClipboard={moveCourseToClipboard}
                          onRemoveTerm={removeTerm}
                          onRenameTerm={renameTerm}
                          onExpandCourse={openDetailPanel}
                        />
                      ))}
                      {year.terms.length === 0 && (
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0' }}>
                          No terms — click <strong>+ Term</strong> to add one.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                <Button onClick={addYear} style={{ borderRadius: '999px', padding: '12px 32px', fontSize: '15px' }}>
                  + Add Year
                </Button>
              </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeCourse ? (
          <div style={{ opacity: 0.9, transform: 'scale(1.02)', position: 'relative' }}>
            <CourseCard
              course={activeCourse}
              location="overlay"
              onEdit={() => {}} onDelete={() => {}} onSendToClipboard={() => {}}
            />
            {selectedIds.has(activeCourse.id) && selectedIds.size > 1 && (
              <div style={{
                position: 'absolute', top: -6, right: -6,
                background: 'var(--accent)', color: '#fff',
                borderRadius: '10px', fontSize: '11px', fontWeight: 700,
                padding: '1px 7px', minWidth: '18px', textAlign: 'center',
              }}>
                {selectedIds.size}
              </div>
            )}
          </div>
        ) : null}
      </DragOverlay>

      {/* Course detail panel */}
      {detailPanel.course && (
        <CourseDetailPanel
          course={detailPanel.course}
          initialEditMode={detailPanel.editMode}
          onClose={closeDetailPanel}
          onSave={handlePanelSave}
        />
      )}

      {/* Course modal */}
      <CourseModal
        open={courseModal.open}
        onClose={closeCourseModal}
        onSave={handleSaveCourse}
        initial={courseModal.course}
        title={courseModal.course ? 'Edit Course' : 'Add Course'}
      />

      {/* Add term modal */}
      <Modal open={addTermModal.open} onClose={() => setAddTermModal({ open: false, yearId: null })} title="Add Term" width={360}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {TERM_SUGGESTIONS.map(s => (
              <Button key={s} variant="secondary" size="sm"
                onClick={() => setCustomTermName(s)}
                style={{ borderColor: customTermName === s ? 'var(--accent)' : undefined }}>
                {s}
              </Button>
            ))}
          </div>
          <Input label="Term name" placeholder="e.g. Fall" value={customTermName}
            onChange={e => setCustomTermName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddTerm()} />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setAddTermModal({ open: false, yearId: null })}>Cancel</Button>
            <Button onClick={handleAddTerm}>Add</Button>
          </div>
        </div>
      </Modal>
    </DndContext>
  );
}
