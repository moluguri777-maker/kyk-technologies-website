import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from './api'

const Shell = ({ children }) => (
  <div className="site">
    <header className="header">
      <a className="brand" href="/">
        <span className="brand-mark">K</span>
        <span>
          KYK <b>TECHNOLOGIES</b>
        </span>
      </a>

      <nav className="nav">
        <a href="/">Home</a>
        <a href="/careers">Careers</a>
      </nav>
    </header>

    <main className="page-shell">{children}</main>
  </div>
)

const State = ({ loading, error, children }) =>
  loading ? (
    <p className="status">Loading...</p>
  ) : error ? (
    <p className="status error">{error}</p>
  ) : (
    children
  )

const emptyJob = {
  title: '',
  department: '',
  location: '',
  employment_type: '',
  experience: '',
  salary: '',
  description: '',
  responsibilities: '',
  requirements: '',
  skills: '',
  status: 'draft'
}

export function AdminDashboard() {
  const [state, setState] = useState({
    loading: true,
    error: '',
    dashboard: null,
    jobs: [],
    applications: [],
    inquiries: []
  })

  const [status, setStatus] = useState('')

  const [jobForm, setJobForm] = useState(emptyJob)

  const [jobFormOpen, setJobFormOpen] = useState(false)

  const [editingJobId, setEditingJobId] = useState(null)

  const [savingJob, setSavingJob] = useState(false)

  const navigate = useNavigate()

  const load = () =>
    Promise.all([
      api.dashboard(),
      api.adminJobs(),
      api.adminApplications(),
      api.inquiries()
    ])
      .then(
        ([
          dashboard,
          jobs,
          applications,
          inquiries
        ]) =>
          setState({
            loading: false,
            error: '',
            dashboard,
            jobs: jobs.jobs || [],
            applications:
              applications.applications || [],
            inquiries:
              inquiries.inquiries || []
          })
      )
      .catch(e =>
        setState(s => ({
          ...s,
          loading: false,
          error: e.message
        }))
      )

  useEffect(() => {
    load()
  }, [])

  const update = async (id, value) => {
    try {
      await api.updateApplication(id, value)

      setStatus('Application updated.')

      await load()
    } catch (e) {
      setStatus(e.message)
    }
  }

  const openCreateJob = () => {
    setEditingJobId(null)
    setJobForm(emptyJob)
    setJobFormOpen(true)
    setStatus('')
  }

  const openEditJob = job => {
    setEditingJobId(job.id)

    setJobForm({
      title: job.title || '',
      department: job.department || '',
      location: job.location || '',
      employment_type: job.employment_type || '',
      experience: job.experience || '',
      salary: job.salary || '',
      description: job.description || '',
      responsibilities: job.responsibilities || '',
      requirements: job.requirements || '',
      skills: job.skills || '',
      status: job.status || 'draft'
    })

    setJobFormOpen(true)
    setStatus('')
  }

  const closeJobForm = () => {
    setJobFormOpen(false)
    setEditingJobId(null)
    setJobForm(emptyJob)
  }

  const handleJobChange = event => {
    const { name, value } = event.target

    setJobForm(form => ({
      ...form,
      [name]: value
    }))
  }

  const saveJob = async event => {
    event.preventDefault()

    setSavingJob(true)
    setStatus('')

    try {
      if (editingJobId) {
        await api.updateJob(editingJobId, jobForm)
        setStatus('Job updated successfully.')
      } else {
        await api.createJob(jobForm)
        setStatus('Job created successfully.')
      }

      closeJobForm()
      await load()
    } catch (e) {
      setStatus(e.message)
    } finally {
      setSavingJob(false)
    }
  }

  const changeJobStatus = async (job, nextStatus) => {
    try {
      await api.updateJob(job.id, {
        ...job,
        status: nextStatus
      })

      setStatus(
        nextStatus === 'closed'
          ? 'Job closed successfully.'
          : nextStatus === 'open'
            ? 'Job opened successfully.'
            : 'Job status updated.'
      )

      await load()
    } catch (e) {
      setStatus(e.message)
    }
  }

  const logout = async () => {
    await api.logout()
    navigate('/login')
  }

  return (
    <Shell>
      <section className="page-content dashboard">
        <State
          loading={state.loading}
          error={state.error}
        >
          <div className="dashboard-head">
            <div>
              <p className="section-label">
                <span />
                ADMIN DASHBOARD
              </p>

              <h1>
                Operations overview.
              </h1>
            </div>

            <button
              className="button secondary"
              onClick={logout}
            >
              Log out
            </button>
          </div>

          <div className="stats-grid">
            {[
              [
                'Open jobs',
                state.dashboard?.jobs
              ],
              [
                'Applications',
                state.dashboard?.applications
              ],
              [
                'Contacts',
                state.dashboard?.contacts
              ],
              [
                'Employees',
                state.dashboard?.employees
              ]
            ].map(([x, y]) => (
              <div className="stat" key={x}>
                <span>{x}</span>
                <strong>{y ?? 0}</strong>
              </div>
            ))}
          </div>

          {/* JOB MANAGEMENT */}

          <div className="section-heading-row">
            <h2>Job Management</h2>

            <button
              className="button"
              onClick={openCreateJob}
            >
              + Add New Job
            </button>
          </div>

          {jobFormOpen && (
            <form
              className="application-form"
              onSubmit={saveJob}
            >
              <h3>
                {editingJobId
                  ? 'Edit Job'
                  : 'Create New Job'}
              </h3>

              <label className="field">
                <span>Job title</span>
                <input
                  name="title"
                  required
                  value={jobForm.title}
                  onChange={handleJobChange}
                />
              </label>

              <label className="field">
                <span>Department</span>
                <input
                  name="department"
                  value={jobForm.department}
                  onChange={handleJobChange}
                />
              </label>

              <label className="field">
                <span>Location</span>
                <input
                  name="location"
                  value={jobForm.location}
                  onChange={handleJobChange}
                />
              </label>

              <label className="field">
                <span>Employment type</span>
                <input
                  name="employment_type"
                  value={jobForm.employment_type}
                  placeholder="Full-time"
                  onChange={handleJobChange}
                />
              </label>

              <label className="field">
                <span>Experience</span>
                <input
                  name="experience"
                  value={jobForm.experience}
                  placeholder="0–2 years"
                  onChange={handleJobChange}
                />
              </label>

              <label className="field">
                <span>Salary</span>
                <input
                  name="salary"
                  value={jobForm.salary}
                  placeholder="Optional"
                  onChange={handleJobChange}
                />
              </label>

              <label className="field">
                <span>Description</span>
                <textarea
                  name="description"
                  rows="5"
                  value={jobForm.description}
                  onChange={handleJobChange}
                />
              </label>

              <label className="field">
                <span>Responsibilities</span>
                <textarea
                  name="responsibilities"
                  rows="5"
                  value={jobForm.responsibilities}
                  onChange={handleJobChange}
                />
              </label>

              <label className="field">
                <span>Requirements</span>
                <textarea
                  name="requirements"
                  rows="5"
                  value={jobForm.requirements}
                  onChange={handleJobChange}
                />
              </label>

              <label className="field">
                <span>Skills</span>
                <textarea
                  name="skills"
                  rows="4"
                  value={jobForm.skills}
                  onChange={handleJobChange}
                />
              </label>

              <label className="field">
                <span>Status</span>

                <select
                  name="status"
                  value={jobForm.status}
                  onChange={handleJobChange}
                >
                  <option value="draft">
                    Draft
                  </option>

                  <option value="open">
                    Open
                  </option>

                  <option value="closed">
                    Closed
                  </option>
                </select>
              </label>

              <div className="auth-choice">
                <button
                  type="submit"
                  className="button"
                  disabled={savingJob}
                >
                  {savingJob
                    ? 'Saving...'
                    : editingJobId
                      ? 'Update Job'
                      : 'Create Job'}
                </button>

                <button
                  type="button"
                  className="button secondary"
                  onClick={closeJobForm}
                  disabled={savingJob}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="job-list">
            {state.jobs.length ? (
              state.jobs.map(job => (
                <article
                  className="job-card"
                  key={job.id}
                >
                  <div>
                    <span>
                      {job.department ||
                        'KYK Technologies'}{' '}
                      ·{' '}
                      {job.location || 'Global'}{' '}
                      ·{' '}
                      {job.employment_type ||
                        'Opportunity'}
                    </span>

                    <h3>{job.title}</h3>

                    <p>
                      {job.description ||
                        'No description provided.'}
                    </p>

                    <span className="status-pill">
                      {job.status}
                    </span>
                  </div>

                  <div className="auth-choice">
                    <button
                      className="button secondary"
                      onClick={() =>
                        openEditJob(job)
                      }
                    >
                      Edit
                    </button>

                    {job.status === 'open' ? (
                      <button
                        className="button secondary"
                        onClick={() =>
                          changeJobStatus(
                            job,
                            'closed'
                          )
                        }
                      >
                        Close Job
                      </button>
                    ) : (
                      <button
                        className="button"
                        onClick={() =>
                          changeJobStatus(
                            job,
                            'open'
                          )
                        }
                      >
                        {job.status === 'draft'
                          ? 'Publish'
                          : 'Reopen'}
                      </button>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <p className="status">
                No jobs have been created yet.
              </p>
            )}
          </div>

          {/* APPLICATIONS */}

          <h2>Applications</h2>

          <div className="job-list">
            {state.applications.length ? (
              state.applications.map(a => (
                <article
                  className="job-card"
                  key={a.id}
                >
                  <div>
                    <h3>{a.job_title}</h3>

                    <p>
                      {a.name} · {a.email}
                    </p>
                  </div>

                  <select
                    value={a.status}
                    onChange={e =>
                      update(
                        a.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="submitted">
                      submitted
                    </option>

                    <option value="reviewing">
                      reviewing
                    </option>

                    <option value="shortlisted">
                      shortlisted
                    </option>

                    <option value="rejected">
                      rejected
                    </option>

                    <option value="selected">
                      selected
                    </option>
                  </select>
                </article>
              ))
            ) : (
              <p className="status">
                No applications yet.
              </p>
            )}
          </div>

          {/* CONTACT INQUIRIES */}

          <h2>Contact inquiries</h2>

          <div className="job-list">
            {state.inquiries.length ? (
              state.inquiries.map(i => (
                <article
                  className="job-card"
                  key={i.id}
                >
                  <div>
                    <h3>
                      {i.name} · {i.email}
                    </h3>

                    <p>{i.message}</p>
                  </div>

                  <span className="status-pill">
                    {i.status}
                  </span>
                </article>
              ))
            ) : (
              <p className="status">
                No contact inquiries yet.
              </p>
            )}
          </div>

          {status && (
            <p className="status">
              {status}
            </p>
          )}
        </State>
      </section>
    </Shell>
  )
}