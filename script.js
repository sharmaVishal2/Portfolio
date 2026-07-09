document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks && navLinks.classList.remove('open'));
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
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
      localStorage.setItem('site-theme', body.classList.contains('theme-light') ? 'light' : 'dark');
      updateThemeIcon();
    });
    updateThemeIcon();
  }

  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 110) {
        current = section.id;
      }
    });
    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === '#' + current);
    });
  });

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submit = form.querySelector('button[type="submit"]');
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

