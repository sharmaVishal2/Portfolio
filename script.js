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

  const makeVisual = (label, isAlt) => `
    <div class="screen-card${isAlt ? ' screen-alt' : ''}">
      <div class="screen-top"></div>
      <div class="screen-content"><div class="mini-title"></div><div class="mini-sub"></div><div class="mini-panels"><span></span><span></span></div></div>
    </div>
    <span class="sr-dialog-label">${label}</span>`;

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
          ${makeVisual(project.visuals[0], false)}
          ${makeVisual(project.visuals[1], true)}
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
