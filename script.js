document.addEventListener('DOMContentLoaded', () => {
    // Menu toggle (mobile)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    }

    // Close mobile menu on nav link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => navLinks && navLinks.classList.remove('open'));
    });

    // Smooth scroll for anchor links
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

    // Theme toggle with persistence
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const stored = localStorage.getItem('site-theme');
    if (stored === 'light') {
        body.classList.remove('theme-dark');
        body.classList.add('theme-light');
    }

    function updateThemeIcon() {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('theme-light')) { icon.className = 'fas fa-moon'; themeToggle.setAttribute('aria-pressed', 'true'); }
        else { icon.className = 'fas fa-sun'; themeToggle.setAttribute('aria-pressed', 'false'); }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = body.classList.toggle('theme-light');
            if (isLight) body.classList.remove('theme-dark'); else body.classList.add('theme-dark');
            localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
            updateThemeIcon();
        });
        updateThemeIcon();
    }

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
        });
        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === '#' + current);
        });
    });

    // Contact form: simple client-side UX (user can wire to backend/email service later)
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submit = form.querySelector('button[type="submit"]');
            submit.disabled = true; submit.textContent = 'Sending...';
            setTimeout(() => {
                submit.disabled = false; submit.textContent = 'Send Message'; form.reset();
                // Minimal success feedback; replace with modal or inline message if desired
                alert('Message sent — thank you! I will reply soon.');
            }, 700);
        });
    }
});
            current = section.getAttribute('id');
