/* ==========================
   Portfolio Interactions
   ========================== */

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Mobile nav
  const navToggle = $(".nav-toggle");
  const nav = $(".nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      navToggle.innerHTML = open
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu when clicking a link (mobile)
    $$(".nav a").forEach((a) =>
      a.addEventListener("click", () => {
        if (nav.classList.contains("open")) {
          nav.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
          navToggle.setAttribute("aria-label", "Open menu");
          navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
      })
    );
  }

  // Back to top button
  const toTop = $(".to-top");
  if (toTop) {
    const onScroll = () => {
      const show = window.scrollY > 520;
      toTop.classList.toggle("show", show);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Scroll reveal
  const revealEls = $$(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => io.observe(el));
  }

  // SVG placeholders for requested fixed-size “renders”
  function makePlaceholderDataUri(w, h, label) {
    const safeLabel = (label || `${w} × ${h}`).replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="rgba(255,83,173,0.75)"/>
            <stop offset="1" stop-color="rgba(0,255,196,0.55)"/>
          </linearGradient>
          <pattern id="p" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="rgba(255,255,255,0.05)"/>
        <rect width="100%" height="100%" fill="url(#p)"/>
        <rect x="12" y="12" width="${w - 24}" height="${h - 24}" rx="22" fill="url(#g)" opacity="0.12" />
        <g font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" fill="rgba(255,255,255,0.78)">
          <text x="50%" y="48%" text-anchor="middle" font-size="18" font-weight="700">${safeLabel}</text>
          <text x="50%" y="58%" text-anchor="middle" font-size="12" font-weight="600" fill="rgba(255,255,255,0.62)">${w} × ${h}</text>
        </g>
      </svg>
    `.trim();

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  $$("img[data-ph='true']").forEach((img) => {
    const w = Number(img.dataset.w || 300);
    const h = Number(img.dataset.h || 200);
    const label = img.dataset.label || `${w} × ${h}`;
    img.src = makePlaceholderDataUri(w, h, label);
  });

  // Typewriter effect (index hero)
  const typeEl = $("#typewriter");
  if (typeEl) {
    const words = ["student", "designer", "developer", "creator", "grade 10 rep"];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typingSpeed = 70;
    const deletingSpeed = 45;
    const pauseAfterWord = 900;
    const pauseBeforeDelete = 650;

    function tick() {
      const word = words[wordIndex];

      if (!deleting) {
        charIndex++;
        typeEl.textContent = word.slice(0, charIndex);

        if (charIndex === word.length) {
          deleting = true;
          setTimeout(tick, pauseBeforeDelete);
          return;
        }
        setTimeout(tick, typingSpeed);
      } else {
        charIndex--;
        typeEl.textContent = word.slice(0, Math.max(0, charIndex));

        if (charIndex <= 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(tick, pauseAfterWord);
          return;
        }
        setTimeout(tick, deletingSpeed);
      }
    }

    tick();
  }

  // Modal (projects “View details”)
  const modal = $("#modal");
  const modalTitle = $("#modalTitle");
  const modalBody = $("#modalBody");
  let lastFocus = null;

  function openModal(title, body) {
    if (!modal) return;

    lastFocus = document.activeElement;

    modalTitle.textContent = title || "Details";
    modalBody.textContent = body || "";

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";

    // Focus first close button for accessibility
    const closeBtn = $(".modal-x", modal);
    closeBtn && closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";

    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  $$("[data-modal='true']").forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal(btn.dataset.title, btn.dataset.body);
    });
  });

  if (modal) {
    modal.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.dataset && target.dataset.close === "true") closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }
})();