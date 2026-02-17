const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const form = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");
const yearSlot = document.getElementById("year");

if (yearSlot) {
  yearSlot.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    const clickedInsideNav = nav.contains(event.target);
    const clickedMenuButton = menuToggle.contains(event.target);
    if (!clickedInsideNav && !clickedMenuButton) {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");
if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

const sections = [...document.querySelectorAll("main section[id]")];
if (sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeId = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${activeId}`
          );
        });
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

if (form && formNote) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.textContent = "Thanks. Your request has been received. We will contact you shortly.";
    form.reset();
  });
}
