const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path, options = {}) {
  const headers = {
    ...options.headers,
  }

  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Unable to complete request.')
  }

  return data
}

export const api = {
  jobs: () => request('/jobs'),
  job: id => request(`/jobs/${id}`),
  contact: payload => request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
  register: payload => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: payload => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),
  applications: payload => request('/applications', { method: 'POST', body: JSON.stringify(payload) }),
  application: id => request(`/applications/${id}`),
  myApplications: () => request('/applications/mine'),
  adminApplications: () => request('/applications'),
  updateApplication: (id, status) => request(`/applications/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  dashboard: () => request('/dashboard'),
  adminJobs: () => request('/jobs/all'),
  createJob: payload => request('/jobs', { method: 'POST', body: JSON.stringify(payload) }),
  updateJob: (id, payload) => request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteJob: id => request(`/jobs/${id}`, { method: 'DELETE' }),
  inquiries: () => request('/contact'),
  updateInquiry: (id, status) => request(`/contact/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  employees: () => request('/employees'),
}
