const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
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

const inPageLinks = [...document.querySelectorAll('a[href^="#"]')].filter(
  (link) => (link.getAttribute("href") || "").length > 1
);

if (inPageLinks.length) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const getHeaderOffset = () => {
    const header = document.querySelector(".site-header");
    return header ? header.getBoundingClientRect().height + 10 : 0;
  };

  const animateScrollTo = (targetY) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = Math.min(1300, Math.max(700, Math.abs(distance) * 0.75));
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      const nextY = startY + distance * eased;

      window.scrollTo(0, nextY);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  inPageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      const targetId = href.slice(1);
      const target = targetId ? document.getElementById(targetId) : null;

      if (!target) return;

      event.preventDefault();

      const rawTargetY =
        target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
      const targetY = Math.max(0, rawTargetY);

      if (prefersReducedMotion) {
        window.scrollTo(0, targetY);
      } else {
        animateScrollTo(targetY);
      }

      if (history.pushState) {
        history.pushState(null, "", `#${targetId}`);
      } else {
        window.location.hash = targetId;
      }
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

const projectCards = [...document.querySelectorAll(".project-card")];
const galleryModal = document.getElementById("project-gallery");

if (projectCards.length && galleryModal) {
  const galleryTitle = document.getElementById("gallery-title");
  const galleryImage = document.getElementById("gallery-image");
  const galleryCaption = document.getElementById("gallery-caption");
  const galleryCounter = document.getElementById("gallery-counter");
  const prevButton = document.getElementById("gallery-prev");
  const nextButton = document.getElementById("gallery-next");
  const closeButtons = [...galleryModal.querySelectorAll("[data-gallery-close]")];

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

  const openGallery = (card, startIndex = 0) => {
    currentTitle = card.dataset.galleryTitle || "Project Gallery";
    currentImages = parseList(card.dataset.galleryImages);
    currentCaptions = parseList(card.dataset.galleryCaptions);

    if (!currentImages.length) return;

    currentIndex = Math.max(0, Math.min(startIndex, currentImages.length - 1));
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
    const thumbButtons = [...card.querySelectorAll(".project-thumb")];

    if (openButton) {
      openButton.addEventListener("click", () => {
        openGallery(card);
      });
    }

    thumbButtons.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const startIndex = Number(thumb.dataset.galleryTrigger || "0");
        openGallery(card, Number.isFinite(startIndex) ? startIndex : 0);
      });
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
