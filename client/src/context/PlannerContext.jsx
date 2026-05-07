import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getPlanner, savePlanner } from '../utils/api';
import { useAuth } from './AuthContext';
import { v4 as uuid } from 'uuid';

const PlannerContext = createContext(null);

const GRADE_POINTS = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0,
};

const TERM_NAMES = {
  semester: ['Fall', 'Spring', 'Summer'],
  quarter: ['Fall', 'Winter', 'Spring', 'Summer'],
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

  const restructureYears = useCallback((newStructure) => {
    const newTermNames = TERM_NAMES[newStructure];
    const freed = [];
    const next = years.map(year => {
      year.terms.forEach(t => {
        if (!newTermNames.includes(t.name)) freed.push(...t.courses);
      });
      const existingByName = Object.fromEntries(year.terms.map(t => [t.name, t]));
      const terms = newTermNames.map(name => existingByName[name] || { id: uuid(), name, courses: [] });
      return { ...year, terms };
    });
    const nextClipboard = [...clipboard, ...freed];
    setYears(next);
    setClipboard(nextClipboard);
    persist(next, nextClipboard);
  }, [years, clipboard, persist]);

  const addYear = () => {
    const structure = user?.structure || 'semester';
    const termNames = TERM_NAMES[structure];
    const yearNum = years.length + 1;
    const label = user?.startYear ? String(user.startYear + years.length) : `Year ${yearNum}`;
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

  const moveCoursesToTerm = useCallback((courseIds, yearId, termId) => {
    const idSet = new Set(courseIds);
    const toMove = [];

    const nextClipboard = clipboard.filter(c => {
      if (idSet.has(c.id)) { toMove.push(c); return false; }
      return true;
    });

    let nextYears = years.map(y => ({
      ...y,
      terms: y.terms.map(t => ({
        ...t,
        courses: t.courses.filter(c => {
          if (idSet.has(c.id)) { toMove.push(c); return false; }
          return true;
        }),
      })),
    }));

    nextYears = nextYears.map(y =>
      y.id === yearId
        ? { ...y, terms: y.terms.map(t => t.id === termId ? { ...t, courses: [...t.courses, ...toMove] } : t) }
        : y
    );

    setYears(nextYears);
    setClipboard(nextClipboard);
    persist(nextYears, nextClipboard);
  }, [years, clipboard, persist]);

  const renameTerm = (yearId, termId, name) => {
    const next = years.map(y =>
      y.id === yearId
        ? { ...y, terms: y.terms.map(t => t.id === termId ? { ...t, name } : t) }
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

  const gpa = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    for (const year of years) {
      for (const term of year.terms) {
        for (const course of term.courses) {
          if (course.units && course.grade && course.grade in GRADE_POINTS) {
            totalPoints += course.units * GRADE_POINTS[course.grade];
            totalCredits += course.units;
          }
        }
      }
    }
    if (totalCredits === 0) return null;
    return (totalPoints / totalCredits).toFixed(2);
  }, [years]);

  return (
    <PlannerContext.Provider value={{
      years, clipboard, loaded, gpa,
      addYear, removeYear, addTerm, removeTerm,
      moveCoursesToTerm, renameTerm,
      addCourseToClipboard, removeCourseFromClipboard,
      moveCourseToTerm, moveCourseToClipboard,
      editCourse, deleteCourse, addCoursesToClipboard,
      restructureYears,
      TERM_NAMES,
    }}>
      {children}
    </PlannerContext.Provider>
  );
}

export const usePlanner = () => useContext(PlannerContext);
