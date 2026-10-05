import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CareersPage, JobPage, ApplicationPage, AuthPage, CandidateDashboard, NotFound } from './pages'
import { ArrowUpRight, Menu, X, Globe2, Users, Code2, BrainCircuit, ChevronRight, Mail, MoveRight } from 'lucide-react'
import { api } from './api'
import './index.css'
import { AdminDashboard } from './AdminDashboard'

const navItems = [['About','about'],['Services','services'],['Technology','technology'],['Future','future'],['Careers','careers'],['Contact','contact']]
const reveal = 'reveal'

function Globe() {
  const points = [[42,35],[58,43],[69,29],[32,57],[75,61],[49,70]]
  return <div className="globe-wrap" aria-label="Abstract global network visualization">
    <div className="globe-halo" />
    <div className="globe">
      <div className="globe-lines horizontal one" /><div className="globe-lines horizontal two" /><div className="globe-lines horizontal three" />
      <div className="globe-lines vertical one" /><div className="globe-lines vertical two" /><div className="globe-lines vertical three" />
      <svg className="globe-arcs" viewBox="0 0 500 500" aria-hidden="true"><path d="M150 290 Q250 80 365 225"/><path d="M105 230 Q235 430 390 180"/><path d="M190 130 Q260 290 405 300"/></svg>
      {points.map(([left, top], i) => <span key={i} className="node" style={{left:`${left}%`,top:`${top}%`,animationDelay:`${i * .45}s`}} />)}
    </div>
    <div className="globe-caption"><span className="live-dot" /> GLOBAL NETWORK <span>06.24° N / 73.02° E</span></div>
  </div>
}

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="header"><a href="#home" className="brand" onClick={() => setOpen(false)}><span className="brand-mark">K</span><span>KYK <b>TECHNOLOGIES</b></span></a><nav className={open ? 'nav open' : 'nav'}>{navItems.map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}<a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>Partner With KYK <ArrowUpRight size={15}/></a></nav><button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button></header>
}

function SectionLabel({children}) { return <p className="section-label"><span />{children}</p> }
function Button({children, secondary=false, href='#contact'}) { return <a className={secondary ? 'button secondary' : 'button'} href={href}>{children}<ArrowUpRight size={16}/></a> }
function DomainCard({icon:Icon, eyebrow, title, children, index}) { return <article className={`${reveal} domain-card`} style={{transitionDelay:`${index * 100}ms`}}><div className="card-top"><Icon size={22}/><span>0{index + 1}</span></div><p className="mini-label">{eyebrow}</p><h3>{title}</h3><p>{children}</p><a href="#services" className="card-link">Explore domain <ChevronRight size={15}/></a></article> }
function NetworkStrip() { return <div className="network-strip"><div className="network-line"/><div className="network-points"><span/><span/><span/><span/><span/></div><div className="network-label">TALENT / OPPORTUNITY / CONNECTION</div></div> }

function App() {
  const [jobs, setJobs] = useState([])
  const [contact, setContact] = useState({ name: '', email: '', company: '', message: '' })
  const [contactState, setContactState] = useState({ loading: false, message: '' })
  useEffect(() => { api.jobs().then(({ jobs }) => setJobs(jobs)).catch(() => setJobs([])) }, [])
  useEffect(() => { const obs = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')), {threshold:.12}); document.querySelectorAll('.reveal').forEach(el => obs.observe(el)); return () => obs.disconnect() }, [])
  const submitContact = async event => { event.preventDefault(); setContactState({ loading: true, message: '' }); try { const result = await api.contact(contact); setContactState({ loading: false, message: result.message }); setContact({ name: '', email: '', company: '', message: '' }) } catch (error) { setContactState({ loading: false, message: error.message }) } }
  return <div className="site"><Header/><main>
    <section className="hero" id="home"><div className="hero-grid"><div className="hero-copy"><SectionLabel>KEY TO YOUR KOGNITIO</SectionLabel><h1>Technology<br/><em>with intent.</em></h1><p className="hero-lead">Global talent, digital technology and artificial intelligence — connected by a long-term vision.</p><div className="hero-actions"><Button href="#services">Explore our services</Button><Button secondary href="#about">Discover KYK</Button></div><div className="hero-meta"><span>01 — 04</span><span>Knowledge. Yield. Kognitio.</span></div></div><Globe/></div><div className="scroll-note"><span>Scroll to explore</span><i /></div></section>

    <section className="section glance" id="services"><div className="section-head"><div><SectionLabel>KYK AT A GLANCE</SectionLabel><h2>Three worlds.<br/><em>One direction.</em></h2></div><p className="section-intro">We connect people, build digital solutions and explore the evolving frontier of intelligent systems.</p></div><div className="domains"><DomainCard icon={Users} eyebrow="PEOPLE" title="Global Recruitment" index={0}>Connecting organizations with skilled professionals across domestic and international markets.</DomainCard><DomainCard icon={Code2} eyebrow="TECHNOLOGY" title="Software & Web Development" index={1}>Designing and developing modern software, websites, applications and digital platforms.</DomainCard><DomainCard icon={BrainCircuit} eyebrow="INTELLIGENCE" title="AI · AGI · ASI" index={2}>Exploring practical solutions and long-term possibilities across the intelligence spectrum.</DomainCard></div></section>

    <section className="section split-section recruitment" id="about"><div className="split-visual"><div className="coordinate">GLOBAL PRESENCE / 001</div><NetworkStrip/><div className="ring ring-a"/><div className="ring ring-b"/><div className="visual-word">PEOPLE</div></div><div className="split-copy"><SectionLabel>01 — PEOPLE</SectionLabel><h2>Connecting talent<br/><em>with opportunity.</em></h2><p>KYK provides recruitment and talent solutions that connect organizations with skilled professionals across domestic and international markets.</p><div className="tag-list">{['IT Recruitment','Non-IT Recruitment','Global Talent Acquisition','Contract Staffing','Executive Recruitment','Workforce Solutions'].map(x => <span key={x}>{x}</span>)}</div><p className="pull-quote">Right talent. Right opportunity.<br/><em>Right connection.</em></p></div></section>

    <section className="section development" id="technology"><div className="section-head"><div><SectionLabel>02 — TECHNOLOGY</SectionLabel><h2>Build what moves<br/><em>business forward.</em></h2></div><p className="section-intro">Digital products designed around real business requirements, from first idea to continuous improvement.</p></div><div className="process"><div className="process-track"/><div className="process-step active"><b>01</b><span>Idea</span><small>Understand the opportunity</small></div>{['Design','Develop','Deploy','Improve'].map((x,i) => <div className="process-step" key={x}><b>0{i+2}</b><span>{x}</span><small>{['Shape the experience','Make it real','Launch with confidence','Keep it moving'][i]}</small></div>)}</div><div className="capability-grid">{[['Software Development','Custom software · Enterprise applications · SaaS platforms'],['Web Development','Corporate websites · Web apps · Customer portals'],['Applications','Mobile · Android · iOS · Cross-platform'],['Technology Solutions','APIs · Cloud · Integration · Automation']].map(([title,text]) => <div className="capability" key={title}><h3>{title}</h3><p>{text}</p><MoveRight size={17}/></div>)}</div></section>

    <section className="section intelligence" id="future"><div className="center-head"><SectionLabel>03 — INTELLIGENCE</SectionLabel><h2>Building toward the<br/><em>next generation.</em></h2><p>Artificial intelligence is transforming the world today. KYK is building knowledge, research capabilities and practical solutions around what comes next.</p></div><div className="intelligence-layers">{[['AI','Artificial Intelligence','Generative AI · AI agents · Machine learning · Intelligent automation'],['AGI','Artificial General Intelligence','Reasoning systems · Autonomous learning · Multi-domain intelligence'],['ASI','Artificial Superintelligence','Advanced reasoning · Safety and alignment · Human-machine collaboration']].map(([short,title,text],i) => <div className={`intel-card intel-${i}`} key={short}><span className="intel-number">0{i+1}</span><h3>{short}</h3><p>{title}</p><small>{text}</small><div className="intel-line"/></div>)}</div><div className="progression">AI <span>→</span> AGI <span>→</span> ASI <i>long-term exploration</i></div></section>

    <section className="section constellation"><div className="constellation-copy"><SectionLabel>BEYOND INTELLIGENCE</SectionLabel><h2>Exploring what<br/><em>comes next.</em></h2><p>Our long-term technology vision extends beyond today’s AI landscape. We don’t wait for the future to arrive. We study it, build toward it and prepare for it.</p><Button href="#contact">Start a conversation</Button></div><div className="constellation-visual">{['AGI','Quantum AI','Robotics','ASI','Advanced Computing','Cognitive Systems','Autonomous Systems','Human–AI Interfaces'].map((x,i) => <span className={`const-node n${i}`} key={x}>{x}</span>)}<div className="const-core">KYK<span>future systems</span></div><svg viewBox="0 0 600 450" aria-hidden="true"><path d="M300 225 L88 92 M300 225 L492 74 M300 225 L525 274 M300 225 L84 346 M300 225 L182 410 M300 225 L430 408 M300 225 L54 215 M300 225 L545 160"/></svg></div></section>

    <section className="section journey"><div className="center-head"><SectionLabel>THE KYK JOURNEY</SectionLabel><h2>Knowledge <em>→</em> Technology <em>→</em> Intelligence</h2></div><div className="journey-grid">{[['TODAY','Global Recruitment','Software & Web Development','AI Solutions'],['TOMORROW','Generative AI','AI Agents','Intelligent Automation','Advanced AI Systems'],['FUTURE','AGI','ASI','Quantum Computing','Next-Generation Intelligence']].map(([title,...items],i) => <div className="journey-col" key={title}><span>0{i+1}</span><h3>{title}</h3>{items.map(item => <p key={item}>{item}<ChevronRight size={14}/></p>)}</div>)}</div></section>

    <section className="section about-section"><SectionLabel>WHO WE ARE</SectionLabel><div className="about-grid"><h2>We are learning.<br/>We are building.<br/><em>We are evolving.</em></h2><div><p>Technology should create opportunity, intelligence and progress.</p><p>We began by connecting people with professional opportunities and are expanding our capabilities into software, web development and artificial intelligence. Our long-term vision is much larger.</p><a className="text-link" href="#contact">More about KYK <ArrowUpRight size={15}/></a></div></div></section>

    <section className="quote-section"><p className="section-label"><span/>OUR VISION</p><blockquote>“To build a globally recognized technology organization that connects talent, technology and intelligence to create the future.”</blockquote></section>

    <section className="section values" id="careers"><div className="section-head"><div><SectionLabel>WHAT GUIDES US</SectionLabel><h2>Principles that<br/><em>move us forward.</em></h2></div><p className="section-intro">We prepare today for tomorrow’s technology — with responsibility, curiosity and intent.</p></div><div className="values-grid">{[['Knowledge','We continuously learn, research and improve.'],['Innovation','We challenge existing ways of solving problems.'],['Integrity','We build relationships through responsibility and trust.'],['Execution','Ideas matter only when they become reality.'],['Future Thinking','We prepare today for tomorrow’s technology.']].map(([x,y],i) => <div key={x}><span>0{i+1}</span><h3>{x}</h3><p>{y}</p></div>)}</div>{jobs.length > 0 && <div className="live-jobs"><SectionLabel>OPEN POSITIONS</SectionLabel><div className="job-list">{jobs.map(job => <article className="job-card" key={job.id}><div><span>{job.department || 'KYK Technologies'} · {job.location || 'Global'}</span><h3>{job.title}</h3><p>{job.description}</p></div><a className="card-link" href={`/careers/${job.id}`}>View role <ArrowUpRight size={15}/></a></article>)}</div></div>}</section>

    <section className="cta" id="contact"><div className="cta-orb"/><SectionLabel>LET’S BUILD TOGETHER</SectionLabel><h2>Build what<br/><em>comes next.</em></h2><p>Whether you need exceptional talent, digital technology or a partner exploring the future of intelligent systems — KYK is ready to build with you.</p><form className="contact-form" onSubmit={submitContact}><input required aria-label="Name" placeholder="Your name" value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })}/><input required type="email" aria-label="Email" placeholder="Work email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })}/><input aria-label="Company" placeholder="Company" value={contact.company} onChange={e => setContact({ ...contact, company: e.target.value })}/><textarea required aria-label="Message" placeholder="How can we help?" value={contact.message} onChange={e => setContact({ ...contact, message: e.target.value })}/><button className="button" disabled={contactState.loading}>{contactState.loading ? 'Sending…' : 'Send inquiry'} <ArrowUpRight size={16}/></button>{contactState.message && <p className="form-message" role="status">{contactState.message}</p>}</form></section>
  </main><footer><div className="footer-brand"><a className="brand" href="#home"><span className="brand-mark">K</span><span>KYK <b>TECHNOLOGIES</b></span></a><p>Key to Your Kognitio</p></div><div className="footer-links">{navItems.map(([x,id]) => <a key={id} href={`#${id}`}>{x}</a>)}</div><div className="footer-social"><a href="mailto:hello@kyktechnologies.com" aria-label="Email"><Mail size={17}/></a><a href="#home" aria-label="Global presence"><Globe2 size={17}/></a></div><div className="footer-bottom"><span>Global Recruitment · Software & Web Development · AI · AGI · ASI</span><span>© 2026 KYK Technologies. All rights reserved.</span></div></footer></div>
}

function RouterApp() { return <Routes>
  <Route path="/" element={<App />} />
  <Route path="/careers" element={<CareersPage />} />
  <Route path="/careers/:id" element={<JobPage />} />
  <Route path="/careers/:id/apply" element={<ApplicationPage />} />
  <Route path="/login" element={<AuthPage />} />
  <Route path="/register" element={<AuthPage mode="register" />} />
  <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
  <Route path="*" element={<NotFound />} /></Routes> }


createRoot(document.getElementById('root')).render(<BrowserRouter><RouterApp /></BrowserRouter>)
