const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const root = document.getElementById("projectRoot");
const projects = window.PORTFOLIO_PROJECTS || {};

function setTheme() {
  const isLight = body.classList.contains("theme-light");
  themeToggle?.setAttribute("aria-pressed", String(isLight));
  themeToggle?.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  if (themeToggle) themeToggle.textContent = isLight ? "◐" : "☀";
}

function list(items, className = "") {
  return `<ul class="${className}">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function renderProject(project) {
  document.title = `${project.title} Case Study | Vishal Sharma`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute("content", project.subtitle);

  root.innerHTML = `
    <header class="case-hero">
      <div class="container case-hero-grid">
        <div class="case-hero-copy">
          <a class="text-link back-link" href="index.html#projects">← Back to projects</a>
          <p class="section-kicker">${project.eyebrow}</p>
          <h1>${project.title}</h1>
          <p>${project.subtitle}</p>
          <div class="case-actions">
            <a class="button button-primary" href="${project.github}" target="_blank" rel="noopener">GitHub</a>
            ${project.live ? `<a class="button button-secondary" href="${project.live}" target="_blank" rel="noopener">Live Demo</a>` : ""}
          </div>
        </div>
        <div class="case-visual">
          <img src="${project.image}" alt="${project.title} project interface preview" width="960" height="620" decoding="async" fetchpriority="high" />
        </div>
      </div>
    </header>

    <section class="section case-section">
      <div class="container case-grid">
        <aside class="case-sidebar">
          <p class="section-kicker">Tech stack</p>
          <div class="tag-list">${project.stack.map((item) => `<span>${item}</span>`).join("")}</div>
        </aside>
        <div class="case-content">
          <section>
            <p class="section-kicker">Overview</p>
            <h2>What it does</h2>
            <p>${project.overview}</p>
          </section>
          ${project.problem ? `<section><p class="section-kicker">Problem</p><h2>The user pain</h2><p>${project.problem}</p></section>` : ""}
          ${project.solution ? `<section><p class="section-kicker">Solution</p><h2>How the product solves it</h2><p>${project.solution}</p></section>` : ""}
        </div>
      </div>
    </section>

    <section class="section case-section case-band">
      <div class="container">
        <div class="section-heading">
          <div>
            <p class="section-kicker">Architecture</p>
            <h2>System shape and core flow.</h2>
          </div>
          <p>Each layer is described in recruiter-friendly language while still showing backend depth.</p>
        </div>
        <div class="architecture-map">${project.architecture.map((item, index) => `<div><span>${String(index + 1).padStart(2, "0")}</span><strong>${item}</strong></div>`).join("")}</div>
      </div>
    </section>

    <section class="section case-section">
      <div class="container case-two-column">
        <section>
          <p class="section-kicker">Features</p>
          <h2>What users can do</h2>
          ${list(project.features, "case-list")}
        </section>
        ${project.screenshots?.length ? `<section>
          <p class="section-kicker">Screenshots</p>
          <h2>Product moments</h2>
          <div class="screenshot-grid">${project.screenshots.map((shot) => `<div><img src="${project.image}" alt="${project.title} - ${shot}" loading="lazy" decoding="async" /><span>${shot}</span></div>`).join("")}</div>
        </section>` : ""}
      </div>
    </section>

    ${(project.challenges || project.future) ? `<section class="section case-section">
      <div class="container case-two-column">
        ${project.challenges ? `<section>
          <p class="section-kicker">Challenges</p>
          <h2>Engineering tradeoffs</h2>
          <p>${project.challenges}</p>
        </section>` : ""}
        ${project.future ? `<section>
          <p class="section-kicker">Future improvements</p>
          <h2>How I would extend it</h2>
          ${list(project.future, "case-list")}
        </section>` : ""}
      </div>
    </section>` : ""}

    <section class="section case-next">
      <div class="container">
        <p class="section-kicker">Next</p>
        <h2>Explore more latest-resume projects.</h2>
        <div class="case-next-grid">
          ${Object.values(projects).filter((item) => item.id !== project.id).map((item) => `<a href="project.html?project=${item.id}"><strong>${item.title}</strong><span>${item.eyebrow}</span></a>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderMissing() {
  root.innerHTML = `
    <section class="section case-missing">
      <div class="container">
        <p class="section-kicker">Project not found</p>
        <h1>Choose a case study</h1>
        <p>The requested project does not exist in the latest portfolio data.</p>
        <div class="case-next-grid">
          ${Object.values(projects).map((item) => `<a href="project.html?project=${item.id}"><strong>${item.title}</strong><span>${item.eyebrow}</span></a>`).join("")}
        </div>
      </div>
    </section>
  `;
}

if (localStorage.getItem("site-theme") === "light") body.classList.add("theme-light");
setTheme();

themeToggle?.addEventListener("click", () => {
  const isLight = body.classList.toggle("theme-light");
  localStorage.setItem("site-theme", isLight ? "light" : "dark");
  setTheme();
});

const key = new URLSearchParams(window.location.search).get("project") || "rate-limiter";
if (projects[key]) renderProject(projects[key]);
else renderMissing();

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
