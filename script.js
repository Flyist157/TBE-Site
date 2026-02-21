const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const quoteForm = document.querySelector(".quote-form");
const formNote = document.querySelector(".form-note");
const yearNode = document.querySelector("#year");
const scenes = Array.from(document.querySelectorAll("[data-parallax-scene]"));
const revealBlocks = Array.from(document.querySelectorAll(".reveal"));
const sectionAnchors = Array.from(document.querySelectorAll(".section-anchor[id]"));
const navLinks = nav
  ? Array.from(nav.querySelectorAll("a[href^='#']")).filter((link) =>
      sectionAnchors.some((section) => `#${section.id}` === link.getAttribute("href"))
    )
  : [];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

if (toggle && header) {
  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (nav && header) {
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("open");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

if (quoteForm && formNote) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const name = (formData.get("name") || "").toString().trim();
    const greeting = name ? `Thank you, ${name.split(" ")[0]}!` : "Thank you!";

    formNote.textContent = `${greeting} Your request has been received. Our team will contact you shortly.`;
    quoteForm.reset();
  });
}

if (revealBlocks.length) {
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.2 }
    );

    revealBlocks.forEach((block) => revealObserver.observe(block));
  } else {
    revealBlocks.forEach((block) => block.classList.add("is-visible"));
  }
}

const setActiveNavLink = () => {
  if (!navLinks.length || !sectionAnchors.length) {
    return;
  }

  let currentId = sectionAnchors[0].id;
  let nearestDistance = Number.POSITIVE_INFINITY;

  sectionAnchors.forEach((section) => {
    const distance = Math.abs(section.getBoundingClientRect().top - 140);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("is-active", isActive);
  });
};

if (scenes.length || navLinks.length) {
  let isTicking = false;

  const updateMotion = () => {
    setActiveNavLink();

    if (!prefersReducedMotion && scenes.length) {
      const viewportHeight = window.innerHeight || 1;

      scenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const centerOffset = (rect.top + rect.height * 0.5 - viewportHeight * 0.5) / viewportHeight;
        const imageShift = Math.max(-72, Math.min(72, centerOffset * -68));
        const textShift = Math.max(-28, Math.min(28, centerOffset * -24));

        scene.style.setProperty("--parallax-shift", `${imageShift.toFixed(2)}px`);
        scene.style.setProperty("--text-shift", `${textShift.toFixed(2)}px`);
      });
    }

    isTicking = false;
  };

  const requestMotionUpdate = () => {
    if (isTicking) {
      return;
    }

    isTicking = true;
    window.requestAnimationFrame(updateMotion);
  };

  updateMotion();
  window.addEventListener("scroll", requestMotionUpdate, { passive: true });
  window.addEventListener("resize", requestMotionUpdate);
}
