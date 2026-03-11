import './HomePage.css';

const TICKER_ITEMS = [
  'Post Tasks',
  'Hire Top Freelancers',
  'Track Milestones',
  'Secure Payments',
  'Client Reviews',
  'Freelancer Profiles',
  'Admin Oversight',
  'JWT Security',
  'Real-time Status',
  'Post Tasks',
  'Hire Top Freelancers',
  'Track Milestones',
  'Secure Payments',
  'Client Reviews',
  'Freelancer Profiles',
  'Admin Oversight',
  'JWT Security',
  'Real-time Status',
];

const STEPS = [
  {
    icon: '✦',
    title: 'Post a Task',
    desc: 'Clients define scope, budget, required skills, deadlines, and difficulty level to attract the right talent.',
  },
  {
    icon: '◉',
    title: 'Assign Freelancers',
    desc: 'Browse profiles, review stats, and assign the best-fit freelancers to specific milestones.',
  },
  {
    icon: '▲',
    title: 'Hit Milestones',
    desc: 'Freelancers submit work per milestone. Clients review, approve, or request revisions.',
  },
  {
    icon: '◆',
    title: 'Get Paid',
    desc: 'Payments are processed automatically upon milestone approval, securely and transparently.',
  },
];

const ROLES = [
  {
    badge: 'client',
    icon: '◰',
    title: 'For Clients',
    desc: 'Post projects, define milestones, manage deadlines, and pay only for approved work.',
    features: ['Create & manage tasks', 'Assign freelancers', 'Approve/reject submissions', 'Dashboard & analytics', 'Spending overview'],
  },
  {
    badge: 'freelancer',
    icon: '◱',
    title: 'For Freelancers',
    desc: 'Browse assigned tasks, hit milestones, build your profile, and grow your reputation.',
    features: ['View assigned tasks', 'Submit milestone work', 'Performance stats', 'Profile management', 'Earnings tracker'],
  },
  {
    badge: 'admin',
    icon: '◲',
    title: 'For Admins',
    desc: 'Oversee the entire platform — users, tasks, payments, analytics, and audit logs.',
    features: ['System analytics', 'User management', 'Suspend accounts', 'Task oversight', 'Audit logs'],
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── NAV ── */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          TaskPlatform <span>BETA</span>
        </a>
        <ul className="nav-links">
          <li><a href="#how-it-works">How it Works</a></li>
          <li><a href="#roles">Roles</a></li>
          <li><a href="#features">Features</a></li>
        </ul>
        <div className="nav-cta">
          <a href="/login" className="btn">Log In</a>
          <a href="/register" className="btn btn-fill">Get Started</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <div>
            <div className="hero-tag">Freelance Platform — v1.0</div>
            <h1 className="hero-h1">
              Work gets<br />
              <em>done</em> here,<br />
              <span className="outline-text">not promised.</span>
            </h1>
            <p className="hero-sub">
              TaskPlatform connects ambitious clients with skilled freelancers.
              Post tasks, track milestones, review work, and release payments
              — all in one place.
            </p>
            <div className="hero-actions">
              <a href="/register?role=client" className="btn btn-accent">
                Post a Task ↗
              </a>
              <a href="/register?role=freelancer" className="btn">
                Find Work →
              </a>
            </div>
            <p className="hero-note">No commission until milestone approval. Cancel anytime.</p>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">4.2K+</div>
              <div className="stat-label">Active Tasks</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">18K+</div>
              <div className="stat-label">Freelancers</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">$3.1M</div>
              <div className="stat-label">Paid Out</div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card-top">
            <div className="role-badge client">● Client View</div>
            <div>
              <div className="card-heading">Post. Assign.<br />Approve.</div>
              <p className="card-desc">
                Define your project in minutes. Break it into milestones,
                assign freelancers, and only pay when you're satisfied.
              </p>
              <a href="/register?role=client" className="card-link">Start as a Client</a>
            </div>
          </div>
          <div className="hero-card-bottom">
            <div className="role-badge freelancer">● Freelancer View</div>
            <div>
              <div className="card-heading">Browse. Build.<br />Get paid.</div>
              <p className="card-desc">
                Showcase your skills, hit milestones on time, and
                build a reputation that earns you better projects.
              </p>
              <a href="/register?role=freelancer" className="card-link">Join as a Freelancer</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-inner">
          {TICKER_ITEMS.map((item, i) => (
            <span className="ticker-item" key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="how-it-works">
        <div className="section-header">
          <span className="section-num">01 / How It Works</span>
          <h2 className="section-title">Four steps to <em>shipped.</em></h2>
        </div>
        <div className="steps-grid">
          {STEPS.map((step, i) => (
            <div className="step" key={i}>
              <div className="step-number">0{i + 1}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROLES ── */}
      <section className="roles-section" id="roles">
        <div className="section-header">
          <span className="section-num">02 / Roles</span>
          <h2 className="section-title">Built for <em>everyone</em> on the chain.</h2>
        </div>
        <div className="roles-grid">
          {ROLES.map((role, i) => (
            <div className="role-card" key={i}>
              <div className="role-icon">{role.icon}</div>
              <span className={`role-badge ${role.badge}`}>
                {role.badge.charAt(0).toUpperCase() + role.badge.slice(1)}
              </span>
              <h3 style={{ marginTop: '1.25rem' }}>{role.title}</h3>
              <p>{role.desc}</p>
              <ul className="role-features">
                {role.features.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES BENTO ── */}
      <section className="section" id="features">
        <div className="section-header">
          <span className="section-num">03 / Features</span>
          <h2 className="section-title">Everything <em>wired in.</em></h2>
        </div>
        <div className="bento-grid">
          <div className="bento-cell bento-wide">
            <div className="bento-tag">🔐 Security</div>
            <h3>JWT-Secured Everything</h3>
            <p>
              Every API request is verified with a signed JSON Web Token.
              Role-based access ensures clients, freelancers, and admins
              only see what they're supposed to.
            </p>
          </div>
          <div className="bento-cell bento-narrow" style={{ borderRight: 'none' }}>
            <div className="bento-number bento-accent">3</div>
            <h3>User Roles</h3>
            <p>Client, Freelancer, and Admin — each with tailored dashboards and permissions.</p>
          </div>

          <div className="bento-cell bento-third bento-last-row">
            <div className="bento-tag">📋 Milestones</div>
            <h3>Granular Control</h3>
            <p>Break any project into milestones with individual freelancer assignments and budgets.</p>
          </div>
          <div className="bento-cell bento-third bento-last-row">
            <div className="bento-number bento-blue">∞</div>
            <h3>Revision Cycles</h3>
            <p>Approve or reject submissions per milestone. Request revisions until the work is exactly right.</p>
          </div>
          <div className="bento-cell bento-third bento-last-row" style={{ borderRight: 'none' }}>
            <div className="bento-tag">📊 Admin Panel</div>
            <h3>Full Platform Oversight</h3>
            <p>Audit logs, user suspension, payment management, and system-wide analytics — all in one panel.</p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-text">
          <h2>
            Stop planning.<br />
            Start <em>shipping.</em>
          </h2>
          <p>
            Join thousands of clients and freelancers who use TaskPlatform
            to get real work done, milestone by milestone.
          </p>
        </div>
        <div className="cta-actions">
          <a href="/register?role=client" className="btn btn-accent" style={{ fontSize: '0.85rem', padding: '0.9rem 2rem' }}>
            Post Your First Task ↗
          </a>
          <a href="/register?role=freelancer" className="btn btn-fill" style={{ fontSize: '0.85rem', padding: '0.9rem 2rem' }}>
            Join as Freelancer →
          </a>
          <a href="/admin/login" className="btn" style={{ fontSize: '0.75rem' }}>
            Admin Access ↗
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-brand">
          <a href="/" className="nav-logo">
            TaskPlatform <span>BETA</span>
          </a>
          <p className="footer-tagline">
            Connecting clients and freelancers through structured, milestone-based work.
          </p>
        </div>
        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><a href="/register?role=client">Post a Task</a></li>
            <li><a href="/register?role=freelancer">Find Work</a></li>
            <li><a href="/how-it-works">How It Works</a></li>
            <li><a href="/pricing">Pricing</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/privacy">Privacy</a></li>
            <li><a href="/terms">Terms</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-bottom">
          <p>© 2025 TaskPlatform</p>
          <p style={{ marginTop: '0.4rem' }}>Built with Spring Boot + React</p>
        </div>
      </footer>
    </>
  );
}