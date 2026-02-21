const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const quoteForm = document.querySelector(".quote-form");
const formNote = document.querySelector(".form-note");
const yearNode = document.querySelector("#year");
const parallaxBands = Array.from(document.querySelectorAll("[data-parallax-band]"));
const revealBlocks = Array.from(document.querySelectorAll("[data-reveal]"));

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

if (parallaxBands.length) {
  let isTicking = false;

  const updateParallax = () => {
    const viewportHeight = window.innerHeight || 1;

    parallaxBands.forEach((band) => {
      const rect = band.getBoundingClientRect();
      const centerOffset = (rect.top + rect.height * 0.5 - viewportHeight * 0.5) / viewportHeight;
      const imageShift = Math.max(-48, Math.min(48, centerOffset * -52));
      const textShift = Math.max(-26, Math.min(26, centerOffset * -30));

      band.style.setProperty("--image-shift", `${imageShift.toFixed(2)}px`);
      band.style.setProperty("--text-shift", `${textShift.toFixed(2)}px`);
    });

    isTicking = false;
  };

  const requestParallaxUpdate = () => {
    if (isTicking) {
      return;
    }

    isTicking = true;
    window.requestAnimationFrame(updateParallax);
  };

  updateParallax();
  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestParallaxUpdate);
}
