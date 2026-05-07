const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getToken() {
  return localStorage.getItem('yy_token');
}

async function authFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const msg = await res.json();
    throw new Error(msg.message || 'Request failed');
  }
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function getUniversities() {
  return authFetch('/api/universities');
}

export async function register({ name, email, password, structure, university, startYear, minor }) {
  const data = await authFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, structure, university, startYear, minor }),
  });
  localStorage.setItem('yy_token', data.token);
  localStorage.setItem('yy_user', JSON.stringify(data.user));
  return data;
}

export async function login({ email, password }) {
  const data = await authFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('yy_token', data.token);
  localStorage.setItem('yy_user', JSON.stringify(data.user));
  return data;
}

export async function logout() {
  localStorage.removeItem('yy_token');
  localStorage.removeItem('yy_user');
}

export function getStoredAuth() {
  const token = getToken();
  const user = JSON.parse(localStorage.getItem('yy_user') || 'null');
  return { token, user };
}

export async function updateProfile(userId, updates) {
  const user = await authFetch(`/api/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  localStorage.setItem('yy_user', JSON.stringify(user));
  return user;
}

// ─── Planner ──────────────────────────────────────────────────────────────────

export async function getPlanner(userId) {
  return authFetch(`/api/planner/${userId}`);
}

export async function savePlanner(userId, plannerData) {
  return authFetch(`/api/planner/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(plannerData),
  });
}