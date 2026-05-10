(async function () {
  const ctaNav = document.querySelector("[data-project-slide-ctas]");
  if (!ctaNav) return;

  const storageKey = `projectSlideCtasDismissed:${window.location.pathname}`;
  const threshold = Number.parseFloat(ctaNav.dataset.scrollThreshold || "0.85");
  let ticking = false;

  function normalizeProjectPath(href) {
    return new URL(href, window.location.origin).pathname.replace(/\/$/, "");
  }

  function projectTitleFromCard(card) {
    const title = card.querySelector(".project-title")?.textContent.trim();
    const fallback = card.querySelector("img")?.alt.trim();
    return title || fallback || "Portfolio Project";
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[char]);
  }

  async function getProjectOrder() {
    const response = await fetch("/", { credentials: "same-origin" });
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    return Array.from(doc.querySelectorAll("#portfolio .project-card[href]"))
      .map((card) => ({
        href: new URL(card.getAttribute("href"), window.location.origin).pathname + "#top-nav",
        path: normalizeProjectPath(card.getAttribute("href")),
        title: projectTitleFromCard(card)
      }))
      .filter((project) => project.path.includes("/assets/projects/"));
  }

  function createCta(project, direction) {
    const label = direction === "prev" ? "Previous Project" : "Next Project";

    return `
      <section class="project-slide-cta project-slide-cta--${direction}" aria-label="${label}">
        <a class="project-slide-cta__link" href="${project.href}">
          <span class="project-slide-cta__kicker">${label}</span>
          <span class="project-slide-cta__title">${escapeHtml(project.title)}</span>
          <span class="project-slide-cta__hint">View project</span>
        </a>
        <button class="project-slide-cta__dismiss" type="button" data-project-slide-ctas-dismiss aria-label="Dismiss project navigation">&times;</button>
      </section>
    `;
  }

  function hideForSession() {
    sessionStorage.setItem(storageKey, "true");
    ctaNav.classList.remove("is-visible");
    ctaNav.classList.add("is-dismissed");
  }

  function updateVisibility() {
    ticking = false;
    if (sessionStorage.getItem(storageKey) === "true") return;

    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollDepth = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    ctaNav.classList.toggle("is-visible", scrollDepth >= threshold);
  }

  function requestVisibilityUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateVisibility);
  }

  if (sessionStorage.getItem(storageKey) === "true") {
    ctaNav.classList.add("is-dismissed");
    return;
  }

  try {
    const projects = await getProjectOrder();
    const currentPath = normalizeProjectPath(window.location.href);
    const currentIndex = projects.findIndex((project) => project.path === currentPath);

    if (currentIndex === -1 || projects.length < 2) {
      ctaNav.remove();
      return;
    }

    const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];
    const nextProject = projects[(currentIndex + 1) % projects.length];
    ctaNav.innerHTML = createCta(prevProject, "prev") + createCta(nextProject, "next");

    ctaNav.querySelectorAll("[data-project-slide-ctas-dismiss]").forEach((button) => {
      button.addEventListener("click", hideForSession);
    });

    window.addEventListener("scroll", requestVisibilityUpdate, { passive: true });
    window.addEventListener("resize", requestVisibilityUpdate);
    updateVisibility();
  } catch (error) {
    ctaNav.remove();
  }
})();
