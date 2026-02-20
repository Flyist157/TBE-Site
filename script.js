const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const quoteForm = document.querySelector(".quote-form");
const formNote = document.querySelector(".form-note");
const yearNode = document.querySelector("#year");
const lightbox = document.querySelector("#photo-lightbox");
const photoTriggers = document.querySelectorAll(".photo-trigger");
const lightboxImage = lightbox ? lightbox.querySelector(".lightbox-image") : null;
const lightboxCaption = lightbox ? lightbox.querySelector(".lightbox-caption") : null;
const lightboxClose = lightbox ? lightbox.querySelector("[data-lightbox-close]") : null;

let lastFocusedTrigger = null;

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

const closeLightbox = () => {
  if (!lightbox || !lightboxImage || !lightboxCaption || lightbox.hasAttribute("hidden")) {
    return;
  }

  lightbox.setAttribute("hidden", "");
  lightboxImage.src = "";
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
  document.body.classList.remove("lightbox-open");

  if (lastFocusedTrigger instanceof HTMLElement) {
    lastFocusedTrigger.focus();
    lastFocusedTrigger = null;
  }
};

if (photoTriggers.length && lightbox && lightboxImage && lightboxCaption && lightboxClose) {
  photoTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const filePath = trigger.getAttribute("data-full");

      if (!filePath) {
        return;
      }

      const previewImage = trigger.querySelector("img");
      const caption = trigger.getAttribute("data-caption") || previewImage?.alt || "";

      lightboxImage.src = filePath;
      lightboxImage.alt = previewImage?.alt || "Expanded project photo";
      lightboxCaption.textContent = caption;
      lightbox.removeAttribute("hidden");
      document.body.classList.add("lightbox-open");
      lastFocusedTrigger = trigger;
      lightboxClose.focus();
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightboxClose.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}
