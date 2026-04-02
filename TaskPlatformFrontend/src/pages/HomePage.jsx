import { useState, useEffect, useRef } from "react";
import "./HomePage.css";

const NAV_LINKS = [
  { label: "Features",   href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Roles",      href: "#roles" },
  { label: "Reviews",    href: "#reviews" },
];

const STATS = [
  { value: "12K+",  label: "Active Projects" },
  { value: "98%",   label: "Client Satisfaction" },
  { value: "$4.2M", label: "Paid to Freelancers" },
  { value: "340+",  label: "Skills Available" },
];

const FEATURES = [
  { icon: "⌘", tag: "01", title: "Smart Task Matching",  desc: "AI-powered system connects your project with the most qualified freelancers instantly." },
  { icon: "◎", tag: "02", title: "Milestone Payments",   desc: "Break work into stages. Pay only when each milestone is completed and approved." },
  { icon: "⊞", tag: "03", title: "Real-Time Tracking",   desc: "Monitor every submission, approval, and payment from one unified dashboard." },
  { icon: "✦", tag: "04", title: "Verified Freelancers", desc: "Every freelancer is reviewed, rated, and skill-tested before joining." },
  { icon: "⌗", tag: "05", title: "Secure Contracts",     desc: "JWT-secured endpoints and encrypted transactions protect every agreement." },
  { icon: "⊛", tag: "06", title: "Admin Oversight",      desc: "Full audit logs and analytics give admins total platform visibility." },
];

const STEPS = [
  { num: "01", title: "Post a Task",       desc: "Define scope, budget, required skills, and deadlines in minutes." },
  { num: "02", title: "Pick a Freelancer", desc: "Browse verified profiles and assign milestones with one click." },
  { num: "03", title: "Track Progress",    desc: "Approve or reject work per milestone — full oversight, zero guesswork." },
  { num: "04", title: "Release Payment",   desc: "Funds released automatically upon your milestone approval." },
];

const TESTIMONIALS = [
  { quote: "OutSource changed how we ship. Every milestone is crystal clear, payments are instant.",        author: "Priya M.",  role: "Product Lead, Fintech Startup", av: "PM" },
  { quote: "As a freelancer, I finally have clarity on what I'm building and exactly when I get paid.",        author: "Daniel O.", role: "Full-Stack Developer",           av: "DO" },
  { quote: "The admin panel gives me insight into every corner of the platform. Absolutely unmatched.",        author: "Sara K.",   role: "Platform Administrator",          av: "SK" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.3);
  const num = parseInt(target.replace(/\D/g, ""));
  const suffix = target.replace(/[\d]/g, "");
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1600, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * num));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, num]);
  return <span ref={ref} className="stat-value">{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const [scrolled, setScrolled]       = useState(false);
  const [activeTesti, setActiveTesti] = useState(0);
  const [heroRef,  heroInView]        = useInView(0.1);
  const [featRef,  featInView]        = useInView(0.1);
  const [stepsRef, stepsInView]       = useInView(0.1);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTesti(p => (p + 1) % TESTIMONIALS.length), 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hp-root">

      <nav className={`hp-nav ${scrolled ? "hp-nav--stuck" : ""}`}>
        <div className="hp-nav-inner">
          <a href="/" className="hp-logo">
            <span className="hp-logo-mark">⬡</span>
            OutSource
          </a>
          <div className="hp-nav-links">
            {NAV_LINKS.map(l => <a key={l.label} href={l.href} className="hp-nav-link">{l.label}</a>)}
          </div>
          <div className="hp-nav-cta">
            <a href="/login" className="hp-btn-ghost">Log in</a>
            <a href="/register" className="hp-btn-solid">Get started →</a>
          </div>
        </div>
      </nav>

      <section className={`hp-hero ${heroInView ? "is-visible" : ""}`} ref={heroRef}>
        <div className="hp-hero-dots" />

        <div className="hp-hero-inner">
          <div className="hp-hero-left">
            <div className="hp-badge">
              <span className="hp-pulse" />
              Public beta · 12,000+ teams
            </div>

            <h1 className="hp-h1">
              Work, tracked.<br />
              <em>Results, delivered.</em>
            </h1>

            <p className="hp-hero-p">
              OutSource connects clients and freelancers through milestone-driven
              contracts, transparent payments, and real-time oversight.
              No chaos. Just progress.
            </p>

            <div className="hp-hero-btns">
              <a href="/register" className="hp-btn-solid hp-btn-lg">Start for free →</a>
              <a href="#how-it-works" className="hp-btn-outline hp-btn-lg">How it works</a>
            </div>

            <div className="hp-social-proof">
              <div className="hp-avatars">
                {["AK","JR","NP","LM","RT"].map(x => <div key={x} className="hp-av">{x}</div>)}
              </div>
              <span>Trusted by 3,000+ companies worldwide</span>
            </div>
          </div>

          <div className="hp-hero-right">
            <div className="hp-dash">
              <div className="hp-dash-top">
                <div className="hp-wm-dots"><span/><span/><span/></div>
                <span className="hp-dash-label">Active Tasks</span>
                <span className="hp-live-badge">● Live</span>
              </div>
              <div className="hp-task-rows">
                {[
                  { name: "Mobile App Redesign", pct: 74, clr: "#f97316" },
                  { name: "API Integration",      pct: 50, clr: "#6366f1" },
                  { name: "Brand Identity Kit",   pct: 90, clr: "#16a34a" },
                ].map(t => (
                  <div className="hp-task-row" key={t.name}>
                    <div className="hp-task-meta">
                      <span>{t.name}</span>
                      <span className="hp-pct">{t.pct}%</span>
                    </div>
                    <div className="hp-track">
                      <div className="hp-fill" style={{ width: `${t.pct}%`, background: t.clr }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="hp-dash-chips">
                <span className="hp-chip hp-chip-green">✓ 3 milestones approved</span>
                <span className="hp-chip hp-chip-amber">2 pending review</span>
              </div>
            </div>

            <div className="hp-notif hp-notif-a">
              <div className="hp-notif-ico" style={{ background: "#dcfce7", color: "#16a34a" }}>✓</div>
              <div>
                <div className="hp-notif-t">Payment Released</div>
                <div className="hp-notif-s">$1,200 · Milestone 2</div>
              </div>
            </div>

            <div className="hp-notif hp-notif-b">
              <div className="hp-notif-ico" style={{ background: "#fef9c3", color: "#b45309" }}>!</div>
              <div>
                <div className="hp-notif-t">New Submission</div>
                <div className="hp-notif-s">Awaiting your review</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-stats">
        <div className="hp-stats-row">
          {STATS.map(s => (
            <div className="hp-stat" key={s.label}>
              <AnimatedCounter target={s.value} />
              <span className="hp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className={`hp-features ${featInView ? "is-visible" : ""}`} ref={featRef}>
        <div className="hp-wrap">
          <div className="hp-sect-head">
            <div className="hp-tag">Platform Features</div>
            <h2 className="hp-h2">Everything a modern<br />workflow demands.</h2>
            <p className="hp-sect-p">Built for the way teams actually operate — not how we wish they did.</p>
          </div>
          <div className="hp-feat-grid">
            {FEATURES.map((f, i) => (
              <div className="hp-feat-card" key={f.title} style={{ animationDelay: `${i * 65}ms` }}>
                <div className="hp-feat-row">
                  <span className="hp-feat-icon">{f.icon}</span>
                  <span className="hp-feat-num">{f.tag}</span>
                </div>
                <h3 className="hp-feat-h">{f.title}</h3>
                <p className="hp-feat-p">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className={`hp-steps ${stepsInView ? "is-visible" : ""}`} ref={stepsRef}>
        <div className="hp-wrap">
          <div className="hp-tag hp-tag-inv">How It Works</div>
          <h2 className="hp-h2 hp-h2-inv">Four steps to done.</h2>
          <div className="hp-steps-grid">
            {STEPS.map((s, i) => (
              <div className="hp-step" key={s.num} style={{ animationDelay: `${i * 90}ms` }}>
                <div className="hp-step-n">{s.num}</div>
                <h3 className="hp-step-h">{s.title}</h3>
                <p className="hp-step-p">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="hp-roles">
        <div className="hp-wrap">
          <div className="hp-tag">Built for Everyone</div>
          <h2 className="hp-h2">One platform,<br />three perspectives.</h2>
          <div className="hp-roles-grid">
            {[
              { role: "Client",     clr: "#ea580c", bg: "#fff7ed", brd: "#fed7aa", icon: "◈", pts: ["Post tasks with milestones","Assign and manage freelancers","Approve work & release payments"] },
              { role: "Freelancer", clr: "#4f46e5", bg: "#eef2ff", brd: "#c7d2fe", icon: "◉", pts: ["Browse assigned tasks","Submit milestone work","Track earnings & performance"] },
              { role: "Admin",      clr: "#0284c7", bg: "#f0f9ff", brd: "#bae6fd", icon: "⊛", pts: ["System-wide analytics","Manage & suspend users","Full audit log access"] },
            ].map(r => (
              <div className="hp-role-card" key={r.role}
                style={{ "--rc": r.clr, "--rbg": r.bg, "--rbrd": r.brd }}>
                <div className="hp-role-icon">{r.icon}</div>
                <div className="hp-role-name">{r.role}</div>
                <ul className="hp-role-ul">
                  {r.pts.map(p => <li key={p}><span className="hp-role-bullet">→</span>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="hp-testi">
        <div className="hp-wrap">
          <div className="hp-tag">What People Say</div>
          <h2 className="hp-h2">Heard from the field.</h2>
          <div className="hp-testi-stage">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.author} className={`hp-tc ${i === activeTesti ? "is-active" : ""}`}>
                <p className="hp-tc-q">"{t.quote}"</p>
                <div className="hp-tc-who">
                  <div className="hp-tc-av">{t.av}</div>
                  <div>
                    <div className="hp-tc-name">{t.author}</div>
                    <div className="hp-tc-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hp-testi-nav">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} className={`hp-tdot ${i === activeTesti ? "is-on" : ""}`}
                onClick={() => setActiveTesti(i)} />
            ))}
          </div>
        </div>
      </section>

      <section className="hp-cta">
        <div className="hp-cta-box">
          <div className="hp-cta-stripe" />
          <h2 className="hp-cta-h">
            Ready to build<br /><em>without the friction?</em>
          </h2>
          <p className="hp-cta-p">Join thousands of clients and freelancers already shipping on OutSource.</p>
          <div className="hp-cta-btns">
            <a href="/register" className="hp-btn-solid hp-btn-lg">Create free account →</a>
            <a href="/login" className="hp-btn-outline hp-btn-lg">Sign in instead</a>
          </div>
        </div>
      </section>

      <footer className="hp-footer">
        <div className="hp-footer-top">
          <div className="hp-footer-brand">
            <a href="/" className="hp-logo">
              <span className="hp-logo-mark">⬡</span>
              OutSource
            </a>
            <p className="hp-footer-tag">Work, managed without the noise.</p>
          </div>
          <div className="hp-footer-cols">
            {[
              { h: "Navigate", ls: [
                { label: "Features",    href: "#features" },
                { label: "How It Works",href: "#how-it-works" },
                { label: "Roles",       href: "#roles" },
                { label: "Reviews",     href: "#reviews" },
              ]},
              { h: "Account", ls: [
                { label: "Sign In",     href: "/login" },
                { label: "Register",    href: "/register" },
                { label: "Dashboard",   href: "/dashboard" },
              ]},
            ].map(c => (
              <div className="hp-fcol" key={c.h}>
                <div className="hp-fcol-h">{c.h}</div>
                {c.ls.map(l => <a key={l.label} href={l.href} className="hp-flink">{l.label}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="hp-footer-bot">
          <span>© 2025 OutSource. All rights reserved.</span>
          <span>Built with precision.</span>
        </div>
      </footer>
    </div>
  );
}