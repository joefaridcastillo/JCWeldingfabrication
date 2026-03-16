// Replace this value with your real GA4 Measurement ID, for example: G-1ABCDEF234
const GA_MEASUREMENT_ID = "G-08112XF6D8";

(() => {
  const placeholderId = "G-XXXXXXXXXX";
  const validIdPattern = /^G-[A-Z0-9]+$/i;
  const hasValidId =
    validIdPattern.test(GA_MEASUREMENT_ID) && GA_MEASUREMENT_ID !== placeholderId;

  if (!hasValidId) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.gtag = gtag;

  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(gtagScript);

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
  });

  const eventContext = {
    page_path: window.location.pathname,
    page_title: document.title,
  };

  const trackEvent = (eventName, params = {}) => {
    gtag("event", eventName, {
      ...eventContext,
      ...params,
    });
  };

  const sanitizeText = (value) =>
    (value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120);

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;

    const href = (link.getAttribute("href") || "").trim();
    if (!href) return;

    const linkText = sanitizeText(link.textContent);
    const normalizedHref = href.toLowerCase();

    if (href.startsWith("tel:")) {
      trackEvent("phone_click", {
        link_text: linkText,
        link_url: href,
      });
      return;
    }

    if (normalizedHref.includes("wa.me") || normalizedHref.includes("whatsapp")) {
      trackEvent("whatsapp_click", {
        link_text: linkText,
        link_url: href,
      });
      return;
    }

    if (href === "#contact") {
      trackEvent("contact_section_click", {
        link_text: linkText || "Contact CTA",
      });
    }
  });

  const contactForm = document.querySelector('form[name="contact"]');
  if (contactForm) {
    contactForm.addEventListener("submit", () => {
      trackEvent("contact_form_submit_attempt", {
        form_name: "contact",
      });
    });
  }

  if (window.location.pathname.endsWith("/thank-you.html") || window.location.pathname === "/thank-you.html") {
    trackEvent("generate_lead", {
      method: "website_contact_form",
    });
  }

  window.jcTrackEvent = trackEvent;
})();
