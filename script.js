document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const themeToggle = document.getElementById('themeToggle');
  const dialog = document.getElementById('projectDialog');
  const dialogContent = document.getElementById('dialogContent');
  const dialogClose = document.getElementById('dialogClose');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastTrigger = null;

  const renderIcons = () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
    }
  };

  renderIcons();

  const setThemeIcon = () => {
    if (!themeToggle) return;
    const isLight = body.classList.contains('theme-light');
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    themeToggle.innerHTML = `<i data-lucide="${isLight ? 'moon' : 'sun'}" aria-hidden="true"></i>`;
    renderIcons();
  };

  if (localStorage.getItem('site-theme') === 'light') {
    body.classList.add('theme-light');
  }
  setThemeIcon();

  themeToggle?.addEventListener('click', () => {
    const isLight = body.classList.toggle('theme-light');
    localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
    setThemeIcon();
  });

  const closeMenu = () => {
    mobileMenu?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open menu');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  document.querySelectorAll('.mobile-menu a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const selector = anchor.getAttribute('href');
      if (!selector || selector === '#') return;
      const target = document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      closeMenu();
      const navOffset = navbar?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navOffset + 1;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', selector);
    });
  });

  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const trackedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const updateNavigation = () => {
    navbar?.classList.toggle('is-scrolled', window.scrollY > 12);
    const marker = window.scrollY + (navbar?.offsetHeight || 0) + 42;
    let activeId = '';
    trackedSections.forEach((section) => {
      if (section.offsetTop <= marker) activeId = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });
  };

  window.addEventListener('scroll', updateNavigation, { passive: true });
  updateNavigation();

  const revealItems = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -24px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const countUp = (element) => {
    const target = Number(element.dataset.count || 0);
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const duration = 900;
    const start = performance.now();
    const update = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${prefix}${Math.round(target * eased).toLocaleString()}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const metrics = document.querySelectorAll('.metric-value[data-count]');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const metricObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.55 });
    metrics.forEach((metric) => metricObserver.observe(metric));
  }

  const projects = {
    smarthire: {
      eyebrow: 'Featured build / AI workflow',
      title: 'SmartHire',
      accent: 'AI Resume Driven Interview System',
      summary: 'An interview preparation product that uses a candidate resume as meaningful context. SmartHire combines parsing, tailored question generation, secure user sessions, and AI-assisted evaluation so practice feels more relevant than a generic question bank.',
      stack: ['Spring Boot', 'React', 'Groq API', 'JWT', 'PostgreSQL', 'LLM'],
      problem: 'Interview practice is often generic, disconnected from a candidate\'s actual experience, and provides little feedback on how an answer could improve.',
      solution: 'SmartHire ingests resume context, creates a role-aware practice flow, and returns structured feedback after each response. The experience keeps the user in a clear progression from upload to review.',
      architecture: ['React client workspace', 'Spring Boot application layer', 'JWT-secured REST API', 'PostgreSQL persistence', 'Groq LLM orchestration'],
      features: ['Resume parsing and skill extraction', 'Context-aware interview question generation', 'AI-assisted answer evaluation and scoring', 'JWT authentication with role-aware access', 'Actionable feedback loop for candidate improvement'],
      challenges: 'The key challenge was keeping LLM output useful and consistent. Prompt engineering and a structured evaluation flow were used to keep generated questions and feedback tied to the candidate context.',
      impact: 'A more personal interview-practice loop that turns resume context into concrete preparation steps, while demonstrating how AI features can live inside a conventional full-stack architecture.',
      github: 'https://github.com/sharmaVishal2/Smart-Hire-AI-driven-interview-prepation-',
      live: 'https://ai-hackfest-mlh.vercel.app/',
      visuals: ['Resume analysis', 'Interview workspace']
    },
    signlanguage: {
      eyebrow: 'Computer vision / Accessibility',
      title: 'Sign Language Detection',
      accent: 'Real-time gesture recognition',
      summary: 'A machine-learning exploration focused on recognizing sign-language gestures from prepared input data. The work centers on preprocessing, model comparison, and accuracy improvements for a more accessible interaction model.',
      stack: ['Python', 'CNN', 'ANN', 'NumPy', 'Pandas', 'Scikit-learn'],
      problem: 'Sign-language communication is often underserved by everyday digital interfaces, creating an opportunity for practical computer vision to help bridge interaction gaps.',
      solution: 'The system processes gesture data, tests neural-network approaches, and compares model behavior to improve recognition quality. Each stage emphasizes clean data preparation before model tuning.',
      architecture: ['Gesture input dataset', 'Preprocessing pipeline', 'CNN / ANN model experiments', 'Benchmarking and evaluation', 'Recognition output'],
      features: ['Gesture classification workflow', 'Data preprocessing and normalization', 'CNN and ANN model benchmarking', 'Accuracy-focused iteration', 'Real-time recognition direction'],
      challenges: 'Recognition quality depends heavily on input consistency. The work required careful preprocessing and comparative testing to identify where model performance could be improved.',
      impact: 'A hands-on example of applying deep learning to an accessibility-oriented problem, with an emphasis on disciplined experimentation rather than treating a model as a black box.',
      github: 'https://github.com/sharmaVishal2',
      live: '',
      visuals: ['Prepared gesture data', 'Recognition benchmark']
    },
    ecommerce: {
      eyebrow: 'Backend / Security',
      title: 'E-Commerce Backend',
      accent: 'Secure commerce API system',
      summary: 'A Spring Boot backend that brings together protected resources, role-based access, catalogue discovery, pagination, and a relational data model for a commerce use case.',
      stack: ['Spring Boot', 'OAuth2', 'JWT', 'PostgreSQL', 'Spring Security', 'REST APIs'],
      problem: 'Commerce systems need a backend that can protect user and admin capabilities while keeping products discoverable and the underlying data relationships understandable.',
      solution: 'The API applies Spring Security with OAuth2 and JWT, provides searchable and paginated product endpoints, and models users, carts, and orders with PostgreSQL.',
      architecture: ['Client application', 'Spring Boot REST controllers', 'Security / OAuth2 / JWT layer', 'Service and persistence layers', 'PostgreSQL relational model'],
      features: ['Role-based authentication and authorization', 'OAuth2 and JWT security workflow', 'Product search and pagination', 'RESTful product, cart, and order APIs', 'Relational database design for commerce entities'],
      challenges: 'The main design challenge was keeping authentication, business rules, and persistence concerns separate enough to remain understandable as the domain grew.',
      impact: 'A production-minded backend foundation that demonstrates secure API design, practical database modeling, and user-facing features such as search and pagination.',
      github: 'https://github.com/sharmaVishal2/E-Commerce-Application-by-Java-Spring-Boot',
      live: '',
      visuals: ['Catalogue endpoint', 'Order and access flow']
    }
  };

  const projectVisuals = {
    smarthire: `
      <div class="dialog-visual-img">
        <img src="assets/project/smarthire-banner.svg" alt="SmartHire interview workspace" loading="lazy" decoding="async">
        <span class="sr-dialog-label">Interview workspace &amp; AI feedback panel</span>
      </div>
      <div class="dialog-visual-img">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 200" fill="none" style="width:100%;border-radius:0.75rem;">
          <rect width="480" height="200" fill="#0a1220" rx="10"/>
          <rect x="16" y="16" width="448" height="28" rx="8" fill="rgba(88,168,243,0.08)" stroke="rgba(112,201,238,0.2)" stroke-width="1"/>
          <rect x="28" y="24" width="28" height="12" rx="6" fill="rgba(116,229,232,0.2)"/>
          <text x="42" y="34" text-anchor="middle" font-family="monospace" font-size="7" fill="#86e5e6">PDF</text>
          <text x="66" y="34" font-family="sans-serif" font-size="9" font-weight="600" fill="#e9f5ff">resume_vishal.pdf — analysis complete</text>
          <rect x="390" y="24" width="62" height="12" rx="6" fill="rgba(89,202,138,0.15)"/>
          <text x="421" y="34" text-anchor="middle" font-family="monospace" font-size="7" fill="#91ebc1">94% match</text>
          <text x="28" y="66" font-family="monospace" font-size="7" fill="#76e0e2" letter-spacing="1">EXTRACTED SKILLS</text>
          <rect x="28" y="74" width="58" height="16" rx="8" fill="rgba(91,173,255,0.14)" stroke="rgba(91,173,255,0.25)" stroke-width="1"/>
          <text x="57" y="86" text-anchor="middle" font-family="monospace" font-size="7" fill="#a4d7ff">Spring Boot</text>
          <rect x="94" y="74" width="34" height="16" rx="8" fill="rgba(91,173,255,0.14)" stroke="rgba(91,173,255,0.25)" stroke-width="1"/>
          <text x="111" y="86" text-anchor="middle" font-family="monospace" font-size="7" fill="#a4d7ff">JWT</text>
          <rect x="136" y="74" width="50" height="16" rx="8" fill="rgba(91,173,255,0.14)" stroke="rgba(91,173,255,0.25)" stroke-width="1"/>
          <text x="161" y="86" text-anchor="middle" font-family="monospace" font-size="7" fill="#a4d7ff">PostgreSQL</text>
          <rect x="194" y="74" width="38" height="16" rx="8" fill="rgba(155,131,255,0.15)" stroke="rgba(155,131,255,0.25)" stroke-width="1"/>
          <text x="213" y="86" text-anchor="middle" font-family="monospace" font-size="7" fill="#d5cdff">React</text>
          <rect x="240" y="74" width="42" height="16" rx="8" fill="rgba(155,131,255,0.15)" stroke="rgba(155,131,255,0.25)" stroke-width="1"/>
          <text x="261" y="86" text-anchor="middle" font-family="monospace" font-size="7" fill="#d5cdff">Groq AI</text>
          <text x="28" y="120" font-family="monospace" font-size="7" fill="#76e0e2" letter-spacing="1">GENERATED QUESTIONS</text>
          <rect x="28" y="128" width="424" height="20" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(168,193,229,0.1)" stroke-width="1"/>
          <text x="40" y="142" font-family="monospace" font-size="8" fill="#e9f5ff">Q1: Explain how JWT authentication works in Spring Security.</text>
          <rect x="28" y="154" width="424" height="20" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(168,193,229,0.1)" stroke-width="1"/>
          <text x="40" y="168" font-family="monospace" font-size="8" fill="#e9f5ff">Q2: How would you design a paginated product search API?</text>
          <rect x="28" y="178" width="424" height="14" rx="6" fill="rgba(255,255,255,0.02)"/>
          <text x="40" y="189" font-family="monospace" font-size="7" fill="#476180">Q3: loading...</text>
        </svg>
        <span class="sr-dialog-label">Resume parsing &amp; question generation</span>
      </div>`,
    signlanguage: `
      <div class="dialog-visual-img">
        <img src="assets/project/signlang-banner.svg" alt="Sign language detection system" loading="lazy" decoding="async">
        <span class="sr-dialog-label">Live gesture recognition &amp; model confidence</span>
      </div>
      <div class="dialog-visual-img">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 200" fill="none" style="width:100%;border-radius:0.75rem;">
          <rect width="480" height="200" fill="#080e1c" rx="10"/>
          <text x="20" y="28" font-family="monospace" font-size="7" fill="#76e0e2" letter-spacing="1">CONFUSION MATRIX (SAMPLE)</text>
          <rect x="20" y="36" width="200" height="150" rx="8" fill="#0d1727" stroke="rgba(168,193,229,0.1)" stroke-width="1"/>
          <text x="120" y="56" text-anchor="middle" font-family="monospace" font-size="7" fill="#476180">Predicted</text>
          <text x="30" y="100" font-family="monospace" font-size="7" fill="#476180" transform="rotate(-90 30 100)">Actual</text>
          <rect x="60" y="64" width="36" height="36" rx="4" fill="rgba(105,183,255,0.7)"/><text x="78" y="87" text-anchor="middle" font-family="monospace" font-size="9" fill="#fff">94</text>
          <rect x="100" y="64" width="36" height="36" rx="4" fill="rgba(105,183,255,0.08)"/><text x="118" y="87" text-anchor="middle" font-family="monospace" font-size="9" fill="#476180">3</text>
          <rect x="140" y="64" width="36" height="36" rx="4" fill="rgba(105,183,255,0.04)"/><text x="158" y="87" text-anchor="middle" font-family="monospace" font-size="9" fill="#476180">1</text>
          <rect x="60" y="104" width="36" height="36" rx="4" fill="rgba(105,183,255,0.06)"/><text x="78" y="127" text-anchor="middle" font-family="monospace" font-size="9" fill="#476180">2</text>
          <rect x="100" y="104" width="36" height="36" rx="4" fill="rgba(167,154,255,0.65)"/><text x="118" y="127" text-anchor="middle" font-family="monospace" font-size="9" fill="#fff">91</text>
          <rect x="140" y="104" width="36" height="36" rx="4" fill="rgba(105,183,255,0.05)"/><text x="158" y="127" text-anchor="middle" font-family="monospace" font-size="9" fill="#476180">4</text>
          <rect x="60" y="144" width="36" height="36" rx="4" fill="rgba(105,183,255,0.03)"/><text x="78" y="167" text-anchor="middle" font-family="monospace" font-size="9" fill="#476180">1</text>
          <rect x="100" y="144" width="36" height="36" rx="4" fill="rgba(105,183,255,0.04)"/><text x="118" y="167" text-anchor="middle" font-family="monospace" font-size="9" fill="#476180">2</text>
          <rect x="140" y="144" width="36" height="36" rx="4" fill="rgba(120,229,232,0.6)"/><text x="158" y="167" text-anchor="middle" font-family="monospace" font-size="9" fill="#fff">96</text>
          <text x="260" y="28" font-family="monospace" font-size="7" fill="#76e0e2" letter-spacing="1">MODEL COMPARISON</text>
          <text x="260" y="56" font-family="monospace" font-size="8" fill="#a5b1c5">CNN</text>
          <rect x="290" y="46" width="170" height="14" rx="7" fill="#1a2a40"/>
          <rect x="290" y="46" width="161" height="14" rx="7" fill="rgba(105,183,255,0.7)"/>
          <text x="464" y="57" font-family="monospace" font-size="7" fill="#91ebc1">94.7%</text>
          <text x="260" y="82" font-family="monospace" font-size="8" fill="#a5b1c5">ANN</text>
          <rect x="290" y="72" width="170" height="14" rx="7" fill="#1a2a40"/>
          <rect x="290" y="72" width="150" height="14" rx="7" fill="rgba(167,154,255,0.6)"/>
          <text x="464" y="83" font-family="monospace" font-size="7" fill="#d5cdff">88.2%</text>
          <text x="260" y="108" font-family="monospace" font-size="8" fill="#a5b1c5">SVM</text>
          <rect x="290" y="98" width="170" height="14" rx="7" fill="#1a2a40"/>
          <rect x="290" y="98" width="130" height="14" rx="7" fill="rgba(120,229,232,0.45)"/>
          <text x="464" y="109" font-family="monospace" font-size="7" fill="#78e5e8">76.4%</text>
          <rect x="260" y="124" width="200" height="60" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(168,193,229,0.08)" stroke-width="1"/>
          <text x="272" y="142" font-family="monospace" font-size="7" fill="#76e0e2" letter-spacing="1">DATASET SPLIT</text>
          <text x="272" y="158" font-family="monospace" font-size="8" fill="#a5b1c5">Train: 6,720  ·  Val: 840  ·  Test: 840</text>
          <text x="272" y="174" font-family="monospace" font-size="7" fill="#476180">80% / 10% / 10%  ·  26 ASL classes</text>
        </svg>
        <span class="sr-dialog-label">Confusion matrix &amp; model benchmarks</span>
      </div>`,
    ecommerce: `
      <div class="dialog-visual-img">
        <img src="assets/project/ecommerce-banner.svg" alt="E-Commerce backend API" loading="lazy" decoding="async">
        <span class="sr-dialog-label">REST API request &amp; response flow</span>
      </div>
      <div class="dialog-visual-img">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 200" fill="none" style="width:100%;border-radius:0.75rem;">
          <rect width="480" height="200" fill="#080e1c" rx="10"/>
          <text x="20" y="24" font-family="monospace" font-size="7" fill="#76e0e2" letter-spacing="1">DATABASE SCHEMA</text>
          <!-- users table -->
          <rect x="20" y="32" width="100" height="80" rx="6" fill="#0d1727" stroke="rgba(105,183,255,0.3)" stroke-width="1"/>
          <rect x="20" y="32" width="100" height="18" rx="6" fill="rgba(105,183,255,0.15)"/>
          <text x="70" y="45" text-anchor="middle" font-family="monospace" font-size="8" font-weight="700" fill="#a4d7ff">users</text>
          <text x="30" y="62" font-family="monospace" font-size="7" fill="#91ebc1">🔑 id</text>
          <text x="30" y="74" font-family="monospace" font-size="7" fill="#a5b1c5">name</text>
          <text x="30" y="86" font-family="monospace" font-size="7" fill="#a5b1c5">email</text>
          <text x="30" y="98" font-family="monospace" font-size="7" fill="#a5b1c5">role</text>
          <!-- products table -->
          <rect x="190" y="32" width="100" height="96" rx="6" fill="#0d1727" stroke="rgba(120,229,232,0.3)" stroke-width="1"/>
          <rect x="190" y="32" width="100" height="18" rx="6" fill="rgba(120,229,232,0.12)"/>
          <text x="240" y="45" text-anchor="middle" font-family="monospace" font-size="8" font-weight="700" fill="#78e5e8">products</text>
          <text x="200" y="62" font-family="monospace" font-size="7" fill="#91ebc1">🔑 id</text>
          <text x="200" y="74" font-family="monospace" font-size="7" fill="#a5b1c5">name</text>
          <text x="200" y="86" font-family="monospace" font-size="7" fill="#a5b1c5">price</text>
          <text x="200" y="98" font-family="monospace" font-size="7" fill="#a5b1c5">category</text>
          <text x="200" y="110" font-family="monospace" font-size="7" fill="#a5b1c5">stock</text>
          <!-- orders table -->
          <rect x="360" y="32" width="100" height="80" rx="6" fill="#0d1727" stroke="rgba(167,154,255,0.3)" stroke-width="1"/>
          <rect x="360" y="32" width="100" height="18" rx="6" fill="rgba(167,154,255,0.12)"/>
          <text x="410" y="45" text-anchor="middle" font-family="monospace" font-size="8" font-weight="700" fill="#d5cdff">orders</text>
          <text x="370" y="62" font-family="monospace" font-size="7" fill="#91ebc1">🔑 id</text>
          <text x="370" y="74" font-family="monospace" font-size="7" fill="#476180">🔗 user_id</text>
          <text x="370" y="86" font-family="monospace" font-size="7" fill="#a5b1c5">total</text>
          <text x="370" y="98" font-family="monospace" font-size="7" fill="#a5b1c5">status</text>
          <!-- relation lines -->
          <line x1="120" y1="72" x2="190" y2="72" stroke="#476180" stroke-width="1" stroke-dasharray="4 2"/>
          <line x1="290" y1="72" x2="360" y2="72" stroke="#476180" stroke-width="1" stroke-dasharray="4 2"/>
          <!-- endpoint list -->
          <text x="20" y="148" font-family="monospace" font-size="7" fill="#76e0e2" letter-spacing="1">KEY ENDPOINTS</text>
          <rect x="20" y="156" width="90" height="14" rx="7" fill="rgba(89,202,138,0.12)"/>
          <text x="65" y="167" text-anchor="middle" font-family="monospace" font-size="7" fill="#91ebc1">GET /products</text>
          <rect x="118" y="156" width="110" height="14" rx="7" fill="rgba(91,173,255,0.12)"/>
          <text x="173" y="167" text-anchor="middle" font-family="monospace" font-size="7" fill="#a4d7ff">POST /auth/register</text>
          <rect x="236" y="156" width="90" height="14" rx="7" fill="rgba(167,154,255,0.12)"/>
          <text x="281" y="167" text-anchor="middle" font-family="monospace" font-size="7" fill="#d5cdff">POST /orders</text>
          <rect x="334" y="156" width="126" height="14" rx="7" fill="rgba(232,176,92,0.12)"/>
          <text x="397" y="167" text-anchor="middle" font-family="monospace" font-size="7" fill="#e8b05c">DELETE /admin/product</text>
          <text x="20" y="190" font-family="monospace" font-size="7" fill="#476180">Spring Boot · Spring Security · OAuth2 · JWT · PostgreSQL · Hibernate</text>
        </svg>
        <span class="sr-dialog-label">Database schema &amp; API endpoints</span>
      </div>`
  };

  const openProject = (projectKey, trigger) => {
    const project = projects[projectKey];
    if (!project || !dialog || !dialogContent) return;
    lastTrigger = trigger;
    const links = [
      `<a class="button button-primary" href="${project.github}" target="_blank" rel="noopener">GitHub <i data-lucide="github" aria-hidden="true"></i></a>`,
      project.live ? `<a class="button button-secondary" href="${project.live}" target="_blank" rel="noopener">Live demo <i data-lucide="arrow-up-right" aria-hidden="true"></i></a>` : ''
    ].join('');
    const stack = project.stack.map((item) => `<span>${item}</span>`).join('');
    const features = project.features.map((feature) => `<li>${feature}</li>`).join('');
    const architecture = project.architecture.map((item) => `<span>${item}</span>`).join('');

    dialogContent.innerHTML = `
      <div class="dialog-body">
        <article class="dialog-content">
          <p class="project-overline">${project.eyebrow}</p>
          <h2 id="dialogTitle">${project.title} <span>${project.accent}</span></h2>
          <p class="dialog-summary">${project.summary}</p>
          <div class="tag-list">${stack}</div>
          <div class="dialog-links">${links}</div>
          <div class="dialog-sections">
            <section class="dialog-section"><h3>Problem</h3><p>${project.problem}</p></section>
            <section class="dialog-section"><h3>Solution</h3><p>${project.solution}</p></section>
            <section class="dialog-section"><h3>Architecture</h3><div class="architecture-flow">${architecture}</div></section>
            <section class="dialog-section"><h3>Key features</h3><ul>${features}</ul></section>
            <section class="dialog-section"><h3>Challenges</h3><p>${project.challenges}</p></section>
            <section class="dialog-section"><h3>Impact</h3><p>${project.impact}</p></section>
          </div>
        </article>
        <aside class="dialog-visual" aria-label="${project.title} interface snapshots">
          <p class="section-kicker">Screenshots / workflows</p>
          <h3>Product snapshots</h3>
          ${projectVisuals[projectKey] || ''}
          <p>Visual snapshots communicate the core workflow and system touchpoints behind this project.</p>
        </aside>
      </div>`;
    renderIcons();
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
    dialogClose?.focus();
  };

  const closeProject = () => {
    if (!dialog) return;
    if (dialog.open && typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    document.body.style.overflow = '';
    lastTrigger?.focus();
  };

  document.querySelectorAll('.project-open').forEach((button) => {
    button.addEventListener('click', () => openProject(button.dataset.project, button));
  });
  dialogClose?.addEventListener('click', closeProject);
  dialog?.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    const clickedBackdrop = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (clickedBackdrop) closeProject();
  });
  dialog?.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
