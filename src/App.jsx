import { useEffect, useMemo, useState } from 'react'
import LiquidEther from './components/LiquidEther'
import data from './data'
import workedProjects from './workedProjects'

const {
  profile,
  stats,
  introHighlights,
  services,
  expertiseBars,
  expertiseCards,
  skills,
  softSkills,
  experience,
  projects,
  education,
  certifications,
  contact
} = data

function App() {
  const [path, setPath] = useState(() => window.location.pathname || '/')
  const [projectSearch, setProjectSearch] = useState('')
  const isWorkedProjectsPage = path.startsWith('/worked-projects')

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/')
      window.scrollTo(0, 0)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const elements = document.querySelectorAll('[data-reveal]')

    if (reduceMotion.matches) {
      elements.forEach((el) => el.classList.add('in'))
      return () => {}
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16 }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [path, projectSearch])

  const filteredWorkedProjects = useMemo(() => {
    const searchTerm = projectSearch.trim().toLowerCase()
    if (!searchTerm) return workedProjects

    return workedProjects.filter((project) => {
      return (
        project.domain.toLowerCase().includes(searchTerm) ||
        project.addedOn.toLowerCase().includes(searchTerm)
      )
    })
  }, [projectSearch])

  const navigate = (nextPath) => (event) => {
    if (event) event.preventDefault()
    if (window.location.pathname === nextPath) return
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo(0, 0)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  if (isWorkedProjectsPage) {
    return (
      <div className="page">
        <div className="bg-glow glow-one" />
        <div className="bg-glow glow-two" />
        <div className="noise" />

        <header className="nav-wrap">
          <div className="container nav">
            <a className="logo" href="/" onClick={navigate('/')}>
              PD
            </a>
            <nav className="nav-links">
              <a href="/" onClick={navigate('/')}>
                Home
              </a>
              <a href="/worked-projects" onClick={navigate('/worked-projects')}>
                Worked Projects
              </a>
            </nav>
            <div className="nav-cta">
              <a className="button ghost" href={contact.resumeUrl}>
                Download CV
              </a>
            </div>
          </div>
        </header>

        <main className="worked-main">
          <section className="section worked-section">
            <div className="container">
              <div className="section-head" data-reveal>
                <span className="section-tag">Portfolio Archive</span>
                <h2>All Worked Projects</h2>
                <p>
                  Complete project archive from your delivered domains. Add future entries in
                  <code> src/workedProjects.js</code>.
                </p>
              </div>

              <div className="worked-toolbar" data-reveal style={{ '--delay': '0.08s' }}>
                <input
                  type="text"
                  placeholder="Search by domain or date"
                  value={projectSearch}
                  onChange={(event) => setProjectSearch(event.target.value)}
                />
                <div className="worked-count">
                  <strong>{filteredWorkedProjects.length}</strong>
                  <span>Projects</span>
                </div>
              </div>

              <div className="worked-grid">
                {filteredWorkedProjects.map((project, index) => (
                  <article
                    key={project.id}
                    className="worked-card"
                    data-reveal
                    style={{ '--delay': `${0.04 + (index % 8) * 0.03}s` }}
                  >
                    <div className="worked-card-top">
                      <a href={`https://${project.domain}`} target="_blank" rel="noreferrer">
                        {project.domain}
                      </a>
                      <span className="worked-type">{project.type}</span>
                    </div>
                    <p>Configured: {project.addedOn}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="bg-glow glow-one" />
      <div className="bg-glow glow-two" />
      <div className="noise" />

      <header className="nav-wrap">
        <div className="container nav">
          <a className="logo" href="#top">
            PD
          </a>
          <nav className="nav-links">
            <a href="#expertise">Expertise</a>
            <a href="#projects">Projects</a>
            <a href="/worked-projects" onClick={navigate('/worked-projects')}>
              Worked Projects
            </a>
            <a href="#journey">Journey</a>
            <a href="#education">Education</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="nav-cta">
            <a className="button ghost" href={contact.resumeUrl}>
              Download CV
            </a>
          </div>
        </div>
      </header>

      <main>
        <section id="top" className="hero">
          <LiquidEther
            className="hero-liquid"
            colors={['#ff6b1a', '#ffb08a', '#ffe1d2']}
            style={{ position: 'absolute', inset: 0 }}
            cursorSize={120}
            resolution={0.55}
            autoIntensity={2.4}
            autoSpeed={0.55}
          />
          <div className="container hero-grid">
            <div className="hero-content" data-reveal>
              <span className="pill">Hello, I am</span>
              <h1>
                {profile.name}
                <span>{profile.role}</span>
              </h1>
              <p className="lead">{profile.summary}</p>
              <div className="hero-actions">
                <a className="button" href="#contact">
                  Hire Me
                </a>
                <a className="button ghost" href={contact.resumeUrl}>
                  View Resume
                </a>
              </div>
              <div className="hero-meta">
                <span>{profile.location}</span>
                <span>{contact.email}</span>
              </div>
              <div className="hero-stats">
                {stats.map((item, index) => (
                  <div
                    key={item.label}
                    className="stat-card"
                    data-reveal
                    style={{ '--delay': `${0.1 + index * 0.08}s` }}
                  >
                    <strong>{item.value}</strong>
                    <p>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual" data-reveal style={{ '--delay': '0.2s' }}>
              <div className="photo-card">
                <img src="/profile.jpg" alt="Priyabrata Dutta" />
                <div className="photo-badge">
                  <span>10+</span>
                  <p>Years in IT</p>
                </div>
              </div>
              <div className="info-card">
                <h3>Focus Areas</h3>
                <ul>
                  {introHighlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="icon-row">
                  <span>React</span>
                  <span>Node</span>
                  <span>AWS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="expertise" className="section alt">
          <div className="container">
            <div className="section-head center" data-reveal>
              <span className="section-tag">Expertise</span>
              <h2>My Expertise</h2>
              <p>Balanced skills across frontend, backend, cloud, and delivery leadership.</p>
            </div>
            <div className="expertise-grid">
              <div className="expertise-bars" data-reveal>
                {expertiseBars.map((item) => (
                  <div key={item.label} className="bar-row">
                    <div className="bar-meta">
                      <span>{item.label}</span>
                      <strong>{item.value}%</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="expertise-cards" data-reveal style={{ '--delay': '0.15s' }}>
                {expertiseCards.map((card) => (
                  <div key={card.title} className="card compact">
                    <h3>{card.title}</h3>
                    <ul>
                      {card.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="container">
            <div className="section-head" data-reveal>
              <span className="section-tag">Tools</span>
              <h2>Technology Stack</h2>
              <p>Modern tools and platforms used across full stack delivery.</p>
            </div>
            <div className="skills-grid">
              {skills.map((group, index) => (
                <div
                  key={group.title}
                  className="card"
                  data-reveal
                  style={{ '--delay': `${0.1 + index * 0.08}s` }}
                >
                  <h3>{group.title}</h3>
                  <div className="tag-row">
                    {group.items.map((item) => (
                      <span key={item} className="tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="soft-skills" data-reveal style={{ '--delay': '0.2s' }}>
              <h3>Core Strengths</h3>
              <div className="tag-row">
                {softSkills.map((item) => (
                  <span key={item} className="tag soft">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section alt">
          <div className="container">
            <div className="section-head" data-reveal>
              <span className="section-tag">Portfolio</span>
              <h2>Featured Projects</h2>
              <p>Selected projects highlighting product delivery and performance focus.</p>
              <a className="button ghost worked-link" href="/worked-projects" onClick={navigate('/worked-projects')}>
                View All Worked Projects
              </a>
            </div>
            <div className="project-grid">
              {projects.map((project, index) => (
                <article
                  key={project.title}
                  className="project-card"
                  data-reveal
                  style={{ '--delay': `${0.1 + index * 0.08}s` }}
                >
                  <div className="project-thumb">
                    <img src={project.image} alt={project.title} loading="lazy" />
                  </div>
                  <div className="project-body">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="tag-row">
                      {project.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="service-grid" data-reveal style={{ '--delay': '0.2s' }}>
              {services.map((service) => (
                <div key={service.title} className="card">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
            <div className="stats-strip" data-reveal style={{ '--delay': '0.25s' }}>
              {stats.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="journey" className="section">
          <div className="container">
            <div className="section-head center" data-reveal>
              <span className="section-tag">Journey</span>
              <h2>Professional Journey</h2>
              <p>Leadership and delivery across product, media, and education.</p>
            </div>
            <div className="timeline">
              {experience.map((role, index) => (
                <article
                  key={role.company}
                  className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                  data-reveal
                  style={{ '--delay': `${0.1 + index * 0.08}s` }}
                >
                  <div className="timeline-card">
                    <div className="timeline-header">
                      <div>
                        <h3>{role.role}</h3>
                        <p className="meta">
                          {role.company} | {role.location}
                        </p>
                      </div>
                      <span className="period">{role.period}</span>
                    </div>
                    <ul className="bullet-list">
                      {role.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="section alt">
          <div className="container">
            <div className="section-head center" data-reveal>
              <span className="section-tag">Education</span>
              <h2>Academic Background</h2>
              <p>Academic foundation and ongoing certifications.</p>
            </div>
            <div className="education-grid">
              <div className="card" data-reveal>
                <h3>Education</h3>
                <ul className="bullet-list">
                  {education.map((item) => (
                    <li key={item.degree}>
                      <strong>{item.degree}</strong>
                      <span>
                        {item.institution} | {item.period}
                      </span>
                      <p>{item.details}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card" data-reveal style={{ '--delay': '0.15s' }}>
                <h3>Certifications</h3>
                <ul className="bullet-list">
                  {certifications.map((item) => (
                    <li key={item.name}>
                      <strong>{item.name}</strong>
                      <span>
                        {item.issuer} | {item.year}
                      </span>
                      {item.detail ? <p>{item.detail}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <div className="section-head center" data-reveal>
              <span className="section-tag">Contact</span>
              <h2>Lets Work Together</h2>
              <p>Available for full stack development, leadership, and product engineering engagements.</p>
            </div>
            <div className="contact-grid" data-reveal style={{ '--delay': '0.1s' }}>
              <div className="contact-info">
                <h3>Get in touch</h3>
                <p>
                  I am open to new opportunities, consulting, and long-term product collaborations. Share
                  your goals and we will build the right plan.
                </p>
                <div className="contact-list">
                  <div className="contact-line">
                    <span>E-Mail :</span>
                    <strong>{contact.email}</strong>
                  </div>
                  <div className="contact-line">
                    <span>Phone :</span>
                    <strong>{contact.phone}</strong>
                  </div>
                  <div className="contact-line">
                    <span>Location :</span>
                    <strong>{contact.location}</strong>
                  </div>
                </div>
                <a className="button" href={contact.resumeUrl}>
                  Download CV
                </a>
              </div>
              <form className="contact-form" onSubmit={handleSubmit}>
                <label>
                  Full Name
                  <input type="text" placeholder="Your name" required />
                </label>
                <label>
                  Email Address
                  <input type="email" placeholder="you@example.com" required />
                </label>
                <label>
                  Subject
                  <input type="text" placeholder="Project inquiry" required />
                </label>
                <label>
                  Message
                  <textarea rows="5" placeholder="Tell me about your project" required />
                </label>
                <button className="button" type="submit">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>Priyabrata Dutta | Full Stack Developer</p>
        </div>
      </footer>
    </div>
  )
}

export default App
