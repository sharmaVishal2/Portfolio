document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');
  const form = document.getElementById('contactForm');

  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (event) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        const offset = 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  const storedTheme = localStorage.getItem('site-theme');
  if (storedTheme === 'light') {
    body.classList.add('theme-light');
  }

  function updateThemeIcon() {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('theme-light')) {
      icon.className = 'fas fa-moon';
      themeToggle.setAttribute('aria-pressed', 'true');
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      icon.className = 'fas fa-sun';
      themeToggle.setAttribute('aria-pressed', 'false');
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('theme-light');
      const isLight = body.classList.contains('theme-light');
      localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
      updateThemeIcon();
    });
    updateThemeIcon();
  }

  const setActiveNav = () => {
    let current = '';
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 110) {
        current = section.id;
      }
    });
    navItems.forEach((item) => {
      item.classList.toggle('active', item.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const submit = form.querySelector('button[type="submit"]');
      if (!submit) return;
      submit.disabled = true;
      submit.textContent = 'Sending...';
      setTimeout(() => {
        submit.disabled = false;
        submit.textContent = 'Send Message';
        form.reset();
        alert('Message sent — thank you! I will reply soon.');
      }, 700);
    });
  }
});

