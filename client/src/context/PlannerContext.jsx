import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getPlanner, savePlanner } from '../utils/api';
import { useAuth } from './AuthContext';
import { v4 as uuid } from 'uuid';

const PlannerContext = createContext(null);

const TERM_NAMES = {
  semester: ['Fall', 'Spring'],
  quarter: ['Fall', 'Winter', 'Spring'],
};

export function PlannerProvider({ children }) {
  const { user } = useAuth();
  const [years, setYears] = useState([]);
  const [clipboard, setClipboard] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    getPlanner(user.id).then(data => {
      setYears(data.years || []);
      setClipboard(data.clipboard || []);
      setLoaded(true);
    });
  }, [user]);

  const persist = useCallback((nextYears, nextClipboard) => {
    if (!user) return;
    savePlanner(user.id, { years: nextYears, clipboard: nextClipboard });
  }, [user]);

  // ─── Years ────────────────────────────────────────────────────────────────

  const addYear = () => {
    const structure = user?.structure || 'semester';
    const termNames = TERM_NAMES[structure];
    const yearNum = years.length + 1;
    const label = `Year ${yearNum}`;
    const terms = termNames.map(name => ({ id: uuid(), name, courses: [] }));
    const newYear = { id: uuid(), label, terms };
    const next = [...years, newYear];
    setYears(next);
    persist(next, clipboard);
  };

  const removeYear = (yearId) => {
    // Move all courses in that year back to clipboard
    const year = years.find(y => y.id === yearId);
    const freed = year ? year.terms.flatMap(t => t.courses) : [];
    const nextClipboard = [...clipboard, ...freed];
    const next = years.filter(y => y.id !== yearId);
    setYears(next);
    setClipboard(nextClipboard);
    persist(next, nextClipboard);
  };

  const addTerm = (yearId, termName) => {
    const next = years.map(y =>
      y.id === yearId
        ? { ...y, terms: [...y.terms, { id: uuid(), name: termName, courses: [] }] }
        : y
    );
    setYears(next);
    persist(next, clipboard);
  };

  const removeTerm = (yearId, termId) => {
    const year = years.find(y => y.id === yearId);
    const term = year?.terms.find(t => t.id === termId);
    const freed = term?.courses || [];
    const nextClipboard = [...clipboard, ...freed];
    const next = years.map(y =>
      y.id === yearId
        ? { ...y, terms: y.terms.filter(t => t.id !== termId) }
        : y
    );
    setYears(next);
    setClipboard(nextClipboard);
    persist(next, nextClipboard);
  };

  // ─── Courses ──────────────────────────────────────────────────────────────

  const addCourseToClipboard = (course) => {
    const newCourse = { ...course, id: uuid() };
    const nextClipboard = [...clipboard, newCourse];
    setClipboard(nextClipboard);
    persist(years, nextClipboard);
    return newCourse;
  };

  const removeCourseFromClipboard = (courseId) => {
    const nextClipboard = clipboard.filter(c => c.id !== courseId);
    setClipboard(nextClipboard);
    persist(years, nextClipboard);
  };

  const moveCourseToTerm = (courseId, yearId, termId) => {
    // Find course (could be in clipboard or another term)
    let course = clipboard.find(c => c.id === courseId);
    let nextClipboard = clipboard;

    if (course) {
      nextClipboard = clipboard.filter(c => c.id !== courseId);
    } else {
      // Search terms
      for (const year of years) {
        for (const term of year.terms) {
          const found = term.courses.find(c => c.id === courseId);
          if (found) { course = found; break; }
        }
      }
    }

    if (!course) return;

    const next = years.map(y =>
      y.id === yearId
        ? {
            ...y,
            terms: y.terms.map(t =>
              t.id === termId
                ? { ...t, courses: [...t.courses.filter(c => c.id !== courseId), course] }
                : { ...t, courses: t.courses.filter(c => c.id !== courseId) }
            )
          }
        : {
            ...y,
            terms: y.terms.map(t => ({ ...t, courses: t.courses.filter(c => c.id !== courseId) }))
          }
    );

    setYears(next);
    setClipboard(nextClipboard);
    persist(next, nextClipboard);
  };

  const moveCourseToClipboard = (courseId) => {
    let course = null;
    const next = years.map(y => ({
      ...y,
      terms: y.terms.map(t => {
        const found = t.courses.find(c => c.id === courseId);
        if (found) course = found;
        return { ...t, courses: t.courses.filter(c => c.id !== courseId) };
      })
    }));
    if (!course) return;
    const nextClipboard = [...clipboard, course];
    setYears(next);
    setClipboard(nextClipboard);
    persist(next, nextClipboard);
  };

  const editCourse = (courseId, updates) => {
    const nextClipboard = clipboard.map(c => c.id === courseId ? { ...c, ...updates } : c);
    const next = years.map(y => ({
      ...y,
      terms: y.terms.map(t => ({
        ...t,
        courses: t.courses.map(c => c.id === courseId ? { ...c, ...updates } : c)
      }))
    }));
    setYears(next);
    setClipboard(nextClipboard);
    persist(next, nextClipboard);
  };

  const deleteCourse = (courseId) => {
    const nextClipboard = clipboard.filter(c => c.id !== courseId);
    const next = years.map(y => ({
      ...y,
      terms: y.terms.map(t => ({ ...t, courses: t.courses.filter(c => c.id !== courseId) }))
    }));
    setYears(next);
    setClipboard(nextClipboard);
    persist(next, nextClipboard);
  };

  const addCoursesToClipboard = (courses) => {
    const newCourses = courses.map(c => ({ ...c, id: uuid() }));
    const nextClipboard = [...clipboard, ...newCourses];
    setClipboard(nextClipboard);
    persist(years, nextClipboard);
  };

  return (
    <PlannerContext.Provider value={{
      years, clipboard, loaded,
      addYear, removeYear, addTerm, removeTerm,
      addCourseToClipboard, removeCourseFromClipboard,
      moveCourseToTerm, moveCourseToClipboard,
      editCourse, deleteCourse, addCoursesToClipboard,
      TERM_NAMES,
    }}>
      {children}
    </PlannerContext.Provider>
  );
}

export const usePlanner = () => useContext(PlannerContext);
