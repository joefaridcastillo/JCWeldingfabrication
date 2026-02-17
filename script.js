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
    formNote.textContent =
      "Thanks. Your request has been received. We will contact you shortly.";
    form.reset();
  });
}

const projectCards = [...document.querySelectorAll(".project-card")];
const galleryModal = document.getElementById("project-gallery");

if (projectCards.length && galleryModal) {
  const galleryTitle = document.getElementById("gallery-title");
  const galleryImage = document.getElementById("gallery-image");
  const galleryCaption = document.getElementById("gallery-caption");
  const galleryCounter = document.getElementById("gallery-counter");
  const prevButton = document.getElementById("gallery-prev");
  const nextButton = document.getElementById("gallery-next");
  const closeButtons = [
    ...galleryModal.querySelectorAll("[data-gallery-close]"),
  ];

  let currentImages = [];
  let currentCaptions = [];
  let currentTitle = "";
  let currentIndex = 0;

  const parseList = (value) =>
    (value || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);

  const renderGallery = () => {
    const total = currentImages.length;
    if (!total) return;

    const src = currentImages[currentIndex];
    const caption = currentCaptions[currentIndex] || "";

    galleryImage.src = src;
    galleryImage.alt = `${currentTitle} image ${currentIndex + 1}`;
    galleryCaption.textContent = caption;
    galleryCounter.textContent = `${currentIndex + 1} / ${total}`;
  };

  const openGallery = (card) => {
    currentTitle = card.dataset.galleryTitle || "Project Gallery";
    currentImages = parseList(card.dataset.galleryImages);
    currentCaptions = parseList(card.dataset.galleryCaptions);

    if (!currentImages.length) return;

    currentIndex = 0;
    galleryTitle.textContent = currentTitle;
    renderGallery();

    galleryModal.classList.add("is-open");
    galleryModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };

  const closeGallery = () => {
    galleryModal.classList.remove("is-open");
    galleryModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };

  const nextImage = () => {
    if (!currentImages.length) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    renderGallery();
  };

  const previousImage = () => {
    if (!currentImages.length) return;
    currentIndex =
      (currentIndex - 1 + currentImages.length) % currentImages.length;
    renderGallery();
  };

  projectCards.forEach((card) => {
    const openButton = card.querySelector(".project-open");
    if (!openButton) return;

    openButton.addEventListener("click", () => {
      openGallery(card);
    });
  });

  if (prevButton && nextButton) {
    prevButton.addEventListener("click", previousImage);
    nextButton.addEventListener("click", nextImage);
  }

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeGallery);
  });

  document.addEventListener("keydown", (event) => {
    if (!galleryModal.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeGallery();
      return;
    }

    if (event.key === "ArrowRight") {
      nextImage();
      return;
    }

    if (event.key === "ArrowLeft") {
      previousImage();
    }
  });
}
