document.addEventListener("DOMContentLoaded", () => {
  // --- Progress bars (fix observer) ---
  const bars = document.querySelectorAll(".progress-bar span");
  const progressObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute("data-width") || "0%";
          bar.style.width = width;
          obs.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );
  bars.forEach((bar) => progressObserver.observe(bar));

  // --- Reveal animations for sections / cards / images ---
  const revealTargets = document.querySelectorAll(
    "section, .card, .presentation-texte, .presentation-detaillee-texte, #accueil img, .projet-details, .competence-card"
  );
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

  // --- Active nav link on scroll ---
  const navLinks = document.querySelectorAll(".navbar-list a");
  const sections = Array.from(navLinks)
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          navLinks.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === id)
          );
        }
      });
    },
    { threshold: 0.55 }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  // --- Smooth scroll on click + mark active ---
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        navLinks.forEach((a) => a.classList.remove("active"));
        link.classList.add("active");
      }
    });
  });

  // --- Hamburger for mobile ---
  const hamburger = document.querySelector(".hamburger");
  const navList = document.querySelector(".navbar-list");
  if (hamburger && navList) {
    hamburger.addEventListener("click", () => navList.classList.toggle("open"));
    navLinks.forEach((a) =>
      a.addEventListener("click", () => navList.classList.remove("open"))
    );
  }

  // --- Sticky header on scroll (ajoute/supprime la classe .sticky) ---
  const header = document.querySelector("header");
  if (header) {
    const checkSticky = () => {
      const threshold = 20; // px, quand scrolled > threshold on active sticky
      if (window.scrollY > threshold) {
        if (!header.classList.contains("sticky"))
          header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    };
    // initial check + écouteur
    checkSticky();
    window.addEventListener("scroll", checkSticky, { passive: true });
  }

  // --- Form validation ---
  const form =
    document.querySelector("#contact form") || document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // remove old errors
      form.querySelectorAll(".error-message").forEach((n) => n.remove());
      form.querySelectorAll(".success-message").forEach((n) => n.remove());

      let valid = true;
      const fields = [
        { selector: "#prenom", name: "Prénom", min: 1 },
        { selector: "#nom", name: "Nom", min: 1 },
        { selector: "#sujet", name: "Sujet", min: 1 },
        { selector: "#message", name: "Message", min: 10 },
      ];

      fields.forEach((f) => {
        const el = form.querySelector(f.selector);
        if (!el) return;
        const value = String(el.value || "").trim();
        if (value.length < f.min) {
          valid = false;
          el.classList.add("error");
          el.setAttribute("aria-invalid", "true");
          const msg = document.createElement("div");
          msg.className = "error-message";
          msg.textContent =
            f.min > 1
              ? `${f.name} doit contenir au moins ${f.min} caractères.`
              : `${f.name} est requis.`;
          el.parentNode.appendChild(msg);
        } else {
          el.classList.remove("error");
          el.removeAttribute("aria-invalid");
        }
      });

      if (valid) {
        const success = document.createElement("div");
        success.className = "success-message";
        success.textContent =
          "Message envoyé ! Merci, je vous répondrai bientôt.";
        form.appendChild(success);
        form.reset();
        setTimeout(() => success.remove(), 4500);
      }
    });
  }

    // --- Back to top button ---
    const backToTopButton = document.getElementById("back-to-top");
    if (backToTopButton) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
          backToTopButton.classList.add("show");
        } else {
          backToTopButton.classList.remove("show");
        }
      });

      backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
});