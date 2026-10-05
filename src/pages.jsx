import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { api } from './api'

const Shell = ({ children }) => (
  <div className="site">
    <header className="header">
      <Link className="brand" to="/">
        <span className="brand-mark">K</span>
        <span>
          KYK <b>TECHNOLOGIES</b>
        </span>
      </Link>

      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/careers">Careers</Link>
        <Link to="/login">Admin Login</Link>
      </nav>
    </header>

    <main className="page-shell">{children}</main>
  </div>
)

const State = ({ loading, error, children }) =>
  loading ? (
    <p className="status">Loading...</p>
  ) : error ? (
    <p className="status error">
      {error === 'Failed to fetch'
        ? 'Openings are temporarily unavailable. Please check the backend connection.'
        : error}
    </p>
  ) : (
    children
  )

const Field = ({ label, ...props }) => (
  <label className="field">
    <span>{label}</span>
    <input {...props} />
  </label>
)

export function CareersPage() {
  const [state, setState] = useState({
    loading: true,
    error: '',
    jobs: []
  })

  useEffect(() => {
    api.jobs()
      .then(data =>
        setState({
          loading: false,
          error: '',
          jobs: data.jobs || []
        })
      )
      .catch(e =>
        setState({
          loading: false,
          error: e.message,
          jobs: []
        })
      )
  }, [])

  return (
    <Shell>
      <section className="page-hero">
        <p className="section-label">
          <span />CAREERS
        </p>

        <h1>
          Find your next<br />
          <em>direction.</em>
        </h1>

        <p>
          Join a team connecting talent, technology and intelligence.
        </p>
      </section>

      <section className="page-content">
        <State
          loading={state.loading}
          error={state.error}
        >
          {state.jobs.length === 0 ? (
            <p className="status">No current openings.</p>
          ) : (
            <div className="job-list">
              {state.jobs.map(job => (
                <article className="job-card" key={job.id}>
                  <div>
                    <span>
                      {job.department || 'KYK Technologies'} ·{' '}
                      {job.location || 'Global'} ·{' '}
                      {job.employment_type || 'Opportunity'}
                    </span>

                    <h3>{job.title}</h3>

                    <p>
                      {job.description ||
                        'Help us build what comes next.'}
                    </p>
                  </div>

                  <Link
                    className="button"
                    to={`/careers/${job.id}`}
                  >
                    View role
                  </Link>
                </article>
              ))}
            </div>
          )}
        </State>
      </section>
    </Shell>
  )
}

export function JobPage() {
  const { id } = useParams()

  const [state, setState] = useState({
    loading: true,
    error: '',
    job: null
  })

  useEffect(() => {
    api.job(id)
      .then(data =>
        setState({
          loading: false,
          error: '',
          job: data.job
        })
      )
      .catch(e =>
        setState({
          loading: false,
          error: e.message,
          job: null
        })
      )
  }, [id])

  return (
    <Shell>
      <section className="page-content job-detail">
        <Link className="text-link" to="/careers">
          ← All openings
        </Link>

        <State
          loading={state.loading}
          error={state.error}
        >
          {state.job && (
            <>
              <p className="section-label">
                <span />
                {state.job.department || 'OPPORTUNITY'}
              </p>

              <h1>{state.job.title}</h1>

              <div className="job-meta">
                {[
                  state.job.location,
                  state.job.employment_type,
                  state.job.experience,
                  state.job.salary
                ]
                  .filter(Boolean)
                  .map(x => (
                    <span key={x}>{x}</span>
                  ))}
              </div>

              <p className="job-copy">
                {state.job.description}
              </p>

              <Detail
                title="Responsibilities"
                value={state.job.responsibilities}
              />

              <Detail
                title="Requirements"
                value={state.job.requirements}
              />

              <Detail
                title="Skills"
                value={state.job.skills}
              />

              <Link
                className="button"
                to={`/careers/${id}/apply`}
              >
                Apply now
              </Link>
            </>
          )}
        </State>
      </section>
    </Shell>
  )
}

const Detail = ({ title, value }) =>
  value ? (
    <div className="detail-block">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  ) : null

export function ApplicationPage() {
  const { id } = useParams()

  const [job, setJob] = useState(null)
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  const [form, setForm] = useState({
    job_id: id,
    name: '',
    email: '',
    phone: '',
    resume_url: '',
    cover_letter: ''
  })

  const [state, setState] = useState({
    loading: true,
    submitting: false,
    message: '',
    error: ''
  })

  useEffect(() => {
    Promise.all([
      api.job(id),
      api.me().catch(() => null)
    ])
      .then(([x, me]) => {
        setJob(x.job)
        setUser(me?.user || null)

        if (me?.user) {
          setForm(form => ({
            ...form,
            name: me.user.name || '',
            email: me.user.email || '',
            phone: me.user.phone || ''
          }))
        }

        setAuthChecked(true)

        setState(s => ({
          ...s,
          loading: false
        }))
      })
      .catch(e =>
        setState({
          loading: false,
          submitting: false,
          message: '',
          error: e.message
        })
      )
  }, [id])

  const submit = async e => {
    e.preventDefault()

    setState(s => ({
      ...s,
      submitting: true,
      error: '',
      message: ''
    }))

    try {
      const result = await api.applications(form)

      setState(s => ({
        ...s,
        submitting: false,
        message: result.message
      }))
    } catch (e) {
      setState(s => ({
        ...s,
        submitting: false,
        error: e.message
      }))
    }
  }

  if (authChecked && !user) {
    return (
      <Shell>
        <section className="page-content form-page">
          <Link
            className="text-link"
            to={`/careers/${id}`}
          >
            ← Back to role
          </Link>

          <p className="section-label">
            <span />
            APPLICATION
          </p>

          <h1>
            Ready to make<br />
            <em>your move?</em>
          </h1>

          <p className="form-note">
            Create a candidate account or log in to continue
            with this application. We'll bring you right back
            here.
          </p>

          <div className="auth-choice">
            <Link
              className="button"
              to="/login"
              state={{
                from: `/careers/${id}/apply`
              }}
            >
              Already have an account? Log in
            </Link>

            <Link
              className="button secondary"
              to="/register"
              state={{
                from: `/careers/${id}/apply`
              }}
            >
              New to KYK? Create an account
            </Link>
          </div>
        </section>
      </Shell>
    )
  }

  return (
    <Shell>
      <section className="page-content form-page">
        <Link
          className="text-link"
          to={`/careers/${id}`}
        >
          ← Back to role
        </Link>

        <h1>
          Apply{job ? `: ${job.title}` : ''}
        </h1>

        <p className="form-note">
          Resume upload storage is not configured yet. Add a
          resume URL if you have one; the field is intentionally
          transparent rather than pretending a file was stored.
        </p>

        <form
          className="application-form"
          onSubmit={submit}
        >
          <Field
            label="Full name"
            required
            value={form.name}
            onChange={e =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
          />

          <Field
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={e =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />

          <Field
            label="Phone"
            value={form.phone}
            onChange={e =>
              setForm({
                ...form,
                phone: e.target.value
              })
            }
          />

          <Field
            label="Resume URL (optional)"
            type="url"
            value={form.resume_url}
            onChange={e =>
              setForm({
                ...form,
                resume_url: e.target.value
              })
            }
          />

          <label className="field">
            <span>Cover letter</span>

            <textarea
              rows="7"
              value={form.cover_letter}
              onChange={e =>
                setForm({
                  ...form,
                  cover_letter: e.target.value
                })
              }
            />
          </label>

<button
  className="button"
  disabled={state.submitting}
>
  {state.submitting
    ? 'Submitting...'
    : 'Submit application'}
</button>

{state.message && (
  <>
    <p className="status" role="status">
      {state.message}
    </p>

    <Link
      className="button secondary"
      to="/candidate/dashboard"
    >
      View My Applications
    </Link>
  </>
)}

{state.error && (
  <p className="status error" role="alert">
    {state.error}
  </p>
)}
        </form>
      </section>
    </Shell>
  )
}

export function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })

  const [error, setError] = useState('')

  const submit = async e => {
    e.preventDefault()
    setError('')

    try {
      const result =
        mode === 'login'
          ? await api.login(form)
          : await api.register(form)

      navigate(
        location.state?.from ||
          (result.user.role === 'admin'
            ? '/admin/dashboard'
            : '/candidate/dashboard'),
        {
          replace: true
        }
      )
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <Shell>
      <section className="page-content form-page">
        <p className="section-label">
          <span />
          {mode === 'login'
            ? 'WELCOME BACK'
            : 'JOIN KYK'}
        </p>

        <h1>
          {mode === 'login'
            ? 'Candidate login.'
            : 'Create your account.'}
        </h1>

        <form
          className="application-form"
          onSubmit={submit}
        >
          {mode === 'register' && (
            <Field
              label="Full name"
              required
              value={form.name}
              onChange={e =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
            />
          )}

          <Field
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={e =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />

          {mode === 'register' && (
            <Field
              label="Phone"
              value={form.phone}
              onChange={e =>
                setForm({
                  ...form,
                  phone: e.target.value
                })
              }
            />
          )}

          <Field
            label="Password"
            type="password"
            minLength="8"
            required
            value={form.password}
            onChange={e =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
          />

          <button
            className="button"
            type="submit"
          >
            {mode === 'login'
              ? 'Log in'
              : 'Register'}
          </button>

          {error && (
            <p className="status error" role="alert">
              {error}
            </p>
          )}
        </form>

        <p className="form-note">
          <Link
            to={
              mode === 'login'
                ? '/register'
                : '/login'
            }
            state={location.state}
          >
            {mode === 'login'
              ? 'Create a candidate account'
              : 'Already have an account? Log in'}
          </Link>
        </p>
      </section>
    </Shell>
  )
}

export function CandidateDashboard() {
  const [state, setState] = useState({
    loading: true,
    error: '',
    user: null,
    applications: []
  })

  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.me(),
      api.myApplications()
    ])
      .then(([me, apps]) =>
        setState({
          loading: false,
          error: '',
          user: me.user,
          applications: apps.applications || []
        })
      )
      .catch(e => {
        if (
          e.message.includes('Authentication') ||
          e.message.includes('authentication') ||
          e.message.includes('expired')
        ) {
          navigate('/login', {
            replace: true,
            state: {
              from: '/candidate/dashboard'
            }
          })
        }

        setState(s => ({
          ...s,
          loading: false,
          error: e.message
        }))
      })
  }, [])

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
          <p className="section-label">
            <span />
            CANDIDATE DASHBOARD
          </p>

          <h1>
            Hello, {state.user?.name}.
          </h1>

          <button
            className="button secondary"
            onClick={logout}
          >
            Log out
          </button>

          <h2>Your applications</h2>

          {state.applications.length ? (
            <div className="job-list">
              {state.applications.map(a => (
                <article
                  className="job-card"
                  key={a.id}
                >
                  <div>
                    <h3>{a.job_title}</h3>

                    <p>
                      {new Date(
                        a.created_at
                      ).toLocaleDateString()}{' '}
                      · {a.email}
                    </p>
                  </div>

                  <span className="status-pill">
                    {a.status}
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <p className="status">
              No applications yet.
            </p>
          )}
        </State>
      </section>
    </Shell>
  )
}

export function NotFound() {
  return (
    <Shell>
      <section className="page-content">
        <h1>Page not found.</h1>

        <Link
          className="button"
          to="/"
        >
          Return home
        </Link>
      </section>
    </Shell>
  )
}