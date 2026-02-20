const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const quoteForm = document.querySelector(".quote-form");
const formNote = document.querySelector(".form-note");
const yearNode = document.querySelector("#year");

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
