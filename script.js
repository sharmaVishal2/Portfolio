const body = document.body;
const navbar = document.querySelector(".navbar");
const mobileMenu = document.getElementById("mobileMenu");
const menuToggle = document.querySelector(".menu-toggle");
const themeToggle = document.getElementById("themeToggle");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function renderIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
  }
}

function setTheme() {
  const isLight = body.classList.contains("theme-light");
  themeToggle?.setAttribute("aria-pressed", String(isLight));
  themeToggle?.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  if (themeToggle) themeToggle.textContent = isLight ? "◐" : "☀";
}

function closeMenu() {
  mobileMenu?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open menu");
}

function hydrateProjectDialogs() {
  const dialog = document.getElementById("projectDialog");
  const dialogContent = document.getElementById("dialogContent");
  const dialogClose = document.getElementById("dialogClose");
  if (!dialog || !dialogContent) return;

  const projects = window.PORTFOLIO_PROJECTS || {};

  function list(items) {
    return `<ul class="dialog-section-list">${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
  }

  function renderDialog(project) {
    dialogContent.innerHTML = `
      <div class="dialog-body">
        <div class="dialog-content">
          <div class="project-overline">
            <span class="section-kicker">${project.eyebrow}</span>
            ${project.live ? '<span class="live-pulse"><i></i> Live</span>' : ''}
          </div>
          <h2 id="dialogTitle">${project.title}</h2>
          <p class="dialog-summary">${project.subtitle}</p>
          <div class="dialog-links">
            <a href="${project.github}" target="_blank" rel="noopener" class="button button-secondary"><i data-lucide="github" aria-hidden="true"></i> GitHub</a>
            ${project.live ? `<a href="${project.live}" target="_blank" rel="noopener" class="button button-primary"><i data-lucide="globe" aria-hidden="true"></i> Live Demo</a>` : ""}
          </div>
          <div class="dialog-sections">
            <div class="dialog-section">
              <h3>Overview</h3>
              <p>${project.overview}</p>
            </div>
            ${project.problem ? `<div class="dialog-section"><h3>Problem</h3><p>${project.problem}</p></div>` : ""}
            ${project.solution ? `<div class="dialog-section"><h3>Solution</h3><p>${project.solution}</p></div>` : ""}
            <div class="dialog-section">
              <h3>Architecture</h3>
              <div class="architecture-flow">${project.architecture.map(a => `<span>${a}</span>`).join("")}</div>
            </div>
            <div class="dialog-section">
              <h3>Features</h3>
              ${list(project.features)}
            </div>
            ${project.challenges ? `<div class="dialog-section"><h3>Challenges</h3><p>${project.challenges}</p></div>` : ""}
            ${project.future ? `<div class="dialog-section"><h3>Future improvements</h3>${list(project.future)}</div>` : ""}
          </div>
        </div>
        <div class="dialog-visual">
          <div class="tag-list">${project.stack.map(s => `<span>${s}</span>`).join("")}</div>
          <div class="dialog-visual-img">
            <img src="${project.image}" alt="${project.title} preview" loading="lazy" decoding="async" />
          </div>
          <p>Tech stack and architecture for ${project.title}.</p>
        </div>
      </div>
    `;
    renderIcons();
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".project-open");
    if (!btn) return;
    const key = btn.dataset.project;
    const project = projects[key];
    if (!project) return;
    renderDialog(project);
    dialog.showModal();
    document.body.style.overflow = "hidden";
  });

  function closeDialog() {
    dialog.close();
    document.body.style.overflow = "";
  }

  dialogClose?.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) closeDialog();
  });

  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
  });
}

function hydrateNavigation() {
  const navLinks = [...document.querySelectorAll(".desktop-nav a")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const updateNavigation = () => {
    navbar?.classList.toggle("is-scrolled", window.scrollY > 12);
    const marker = window.scrollY + (navbar?.offsetHeight || 0) + 42;
    let activeId = "";
    sections.forEach((section) => {
      if (section.offsetTop <= marker) activeId = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
    });
  };

  window.addEventListener("scroll", updateNavigation, { passive: true });
  updateNavigation();
}

function hydrateRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const parents = new Map();
    revealItems.forEach((el) => {
      const parent = el.parentElement;
      if (!parents.has(parent)) parents.set(parent, []);
      parents.get(parent).push(el);
    });
    parents.forEach((siblings) => {
      siblings.forEach((el, index) => {
        if (!el.style.getPropertyValue("--delay")) {
          el.style.setProperty("--delay", `${index * 70}ms`);
        }
      });
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -32px 0px" });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
}

function hydrateMetrics() {
  const metrics = document.querySelectorAll(".metric-value[data-count]");
  const countUp = (element) => {
    const target = Number(element.dataset.count || 0);
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";
    const duration = 900;
    const start = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${prefix}${Math.round(target * eased).toLocaleString()}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.55 });

    metrics.forEach((metric) => observer.observe(metric));
  } else {
    metrics.forEach((metric) => {
      const prefix = metric.dataset.prefix || "";
      const suffix = metric.dataset.suffix || "";
      metric.textContent = `${prefix}${Number(metric.dataset.count || 0).toLocaleString()}${suffix}`;
    });
  }
}

async function hydrateGitHub() {
  const commitList = document.getElementById("commitList");
  const stats = document.getElementById("githubStats");
  if (!commitList && !stats) return;

  try {
    const response = await fetch("https://api.github.com/users/sharmaVishal2/events/public", {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error("GitHub API unavailable");
    const events = await response.json();
    const commits = events
      .filter((event) => event.type === "PushEvent")
      .flatMap((event) => (event.payload?.commits || []).map((commit) => ({
        repo: event.repo?.name?.replace("sharmaVishal2/", "") || "repository",
        message: commit.message,
        url: `https://github.com/${event.repo?.name}/commit/${commit.sha}`
      })))
      .slice(0, 3);

    if (commitList && commits.length) {
      commitList.innerHTML = commits
        .map((commit) => `<li><a href="${commit.url}" target="_blank" rel="noopener"><strong>${commit.repo}</strong><span>${commit.message}</span></a></li>`)
        .join("");
    } else if (commitList) {
      commitList.innerHTML = "<li>Recent public commits will appear here when GitHub returns activity.</li>";
    }

    if (stats) {
      const publicRepos = new Set(events.map((event) => event.repo?.name).filter(Boolean)).size;
      stats.innerHTML = `<span>${publicRepos || "Active"} public repos touched recently</span><span>Java backend focus</span><span>AI product builds</span>`;
    }
  } catch (error) {
    if (commitList) {
      commitList.innerHTML = "<li>GitHub activity is available from the profile link when the API is rate limited.</li>";
    }
  }
}

if (localStorage.getItem("site-theme") === "light") body.classList.add("theme-light");
setTheme();
renderIcons();

themeToggle?.addEventListener("click", () => {
  const isLight = body.classList.toggle("theme-light");
  localStorage.setItem("site-theme", isLight ? "light" : "dark");
  setTheme();
});

menuToggle?.addEventListener("click", () => {
  const isOpen = mobileMenu?.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

document.querySelectorAll(".mobile-menu a").forEach((link) => link.addEventListener("click", closeMenu));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const section = document.querySelector(targetId);
    if (!section) return;
    event.preventDefault();
    closeMenu();
    const top = section.getBoundingClientRect().top + window.scrollY - (navbar?.offsetHeight || 0) + 1;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    history.replaceState(null, "", targetId);
  });
});

hydrateNavigation();
hydrateRevealAnimations();
hydrateMetrics();
hydrateGitHub();
hydrateProjectDialogs();

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
