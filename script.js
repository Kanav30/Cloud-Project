// ===== COUNTDOWN GATE =====
// Everything is locked behind a countdown until this moment. The offset
// (+05:30) pins it to Indian Standard Time regardless of the visitor's
// own device timezone — change or drop the offset if you want it tied
// to local time instead. See README for details.
const GATE_TARGET = new Date("2026-09-05T00:00:00+05:30");

const gate = document.getElementById("countdownGate");
const gateParams = new URLSearchParams(window.location.search);
const isPreview = gateParams.has("preview"); // add ?preview=1 to the URL to see past the gate early

function gateIsUnlocked() {
  return isPreview || Date.now() >= GATE_TARGET.getTime();
}

let gateInterval;
function unlockGate() {
  if (gate) {
    gate.classList.add("unlocked");
    gate.setAttribute("aria-hidden", "true");
  }
  document.body.classList.remove("gate-lock");
  if (gateInterval) clearInterval(gateInterval);
}

if (gate) {
  if (gateIsUnlocked()) {
    unlockGate();
  } else {
    document.body.classList.add("gate-lock");
    const cd = {
      days: document.getElementById("cdDays"),
      hours: document.getElementById("cdHours"),
      minutes: document.getElementById("cdMinutes"),
      seconds: document.getElementById("cdSeconds"),
    };
    const tick = () => {
      const diff = GATE_TARGET.getTime() - Date.now();
      if (diff <= 0) { unlockGate(); return; }
      const pad = n => String(n).padStart(2, "0");
      cd.days.textContent = pad(Math.floor(diff / 86400000));
      cd.hours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      cd.minutes.textContent = pad(Math.floor((diff % 3600000) / 60000));
      cd.seconds.textContent = pad(Math.floor((diff % 60000) / 1000));
    };
    tick();
    gateInterval = setInterval(tick, 1000);
  }
}

const loader = document.getElementById("loader");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), prefersReducedMotion ? 200 : 1500);
});

document.querySelectorAll("[data-scroll]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(btn.dataset.scroll)?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
});

// ===== Scroll-triggered reveals =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (prefersReducedMotion) {
        entry.target.style.opacity = "1";
      } else {
        entry.target.animate(
          [
            { opacity: 0, transform: "translateY(45px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          { duration: 900, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" }
        );
      }
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  ".memory-card, .collage-title, .photo-wall, .emotional-lines, .emotional h2, .emotional-photo, .finale-content"
).forEach(el => {
  el.style.opacity = "0";
  observer.observe(el);
});

// ===== Modals =====
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModals() {
  document.querySelectorAll(".modal.open").forEach(modal => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-modal]").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.modal));
});

document.querySelectorAll("[data-close]").forEach(el => {
  el.addEventListener("click", closeModals);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModals();
});

// ===== Parallax on the archive wall =====
window.addEventListener("scroll", () => {
  const wall = document.querySelector(".photo-wall");
  if (wall && !prefersReducedMotion) {
    const rect = wall.getBoundingClientRect();
    if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      wall.querySelectorAll(".wall-card").forEach((card, i) => {
        const amount = (progress - 0.5) * (i % 2 === 0 ? 12 : -12);
        card.style.translate = `0 ${amount}px`;
      });
    }
  }
}, { passive: true });

// ===== Scroll progress bar (top of page, Netflix-scrubber style) =====
const progressBar = document.getElementById("scrollProgress");
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + "%";
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// ===== Skip Intro — shows a beat after the hero loads, hides once you leave it =====
const skipIntro = document.getElementById("skipIntro");
const heroSection = document.getElementById("home");
if (skipIntro && heroSection) {
  let skipTimer = setTimeout(() => skipIntro.classList.add("show"), 2200);
  const heroObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      skipIntro.classList.remove("show");
      clearTimeout(skipTimer);
    }
  }, { threshold: 0.4 });
  heroObserver.observe(heroSection);
  skipIntro.addEventListener("click", () => skipIntro.classList.remove("show"));
}

// ===== Chapter rail — highlights current section, click to jump =====
const railButtons = document.querySelectorAll(".chapter-rail button");
if (railButtons.length) {
  const targets = Array.from(railButtons)
    .map(btn => document.querySelector(btn.dataset.target))
    .filter(Boolean);

  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const btn = document.querySelector(`.chapter-rail button[data-target="#${entry.target.id}"]`);
      if (!btn) return;
      if (entry.isIntersecting) {
        railButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      }
    });
  }, { threshold: 0.5 });

  targets.forEach(t => chapterObserver.observe(t));

  railButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(btn.dataset.target)?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });
}

// ===== Drop-in media loader =====
// Elements marked data-photo="assets/photos/whatever.jpg" or data-video="assets/videos/whatever.mp4"
// quietly check whether that file exists. If it does, it replaces the gradient placeholder —
// no code editing required, just add a file with the matching name.
function loadPhoto(el, src) {
  const img = new Image();
  img.onload = () => {
    el.innerHTML = "";
    el.style.backgroundImage = `url("${src}")`;
    el.style.backgroundSize = "contain";
    el.style.backgroundPosition = "center";
    el.style.backgroundRepeat = "no-repeat";
    el.classList.add("has-media");
  };
  img.src = src;
}

function loadVideo(el, src, onFail) {
  const video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.src = src;
  video.addEventListener("loadeddata", () => {
    el.innerHTML = "";
    el.appendChild(video);
    el.classList.add("has-media");
  }, { once: true });
  video.addEventListener("error", () => { if (onFail) onFail(); }, { once: true });
}

// ===== LAZY LOAD MEDIA =====
// This only loads photos/videos when the user is about to scroll to them
const mediaObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      
      // Load video if it exists, otherwise load photo
      if (el.dataset.video) {
        loadVideo(el, el.dataset.video, () => {
          if (el.dataset.photo) loadPhoto(el, el.dataset.photo);
        });
      } else if (el.dataset.photo) {
        loadPhoto(el, el.dataset.photo);
      }
      
      // Stop observing once loaded
      observer.unobserve(el);
    }
  });
}, { rootMargin: "400px" }); // Starts loading 400px before it enters the screen

// Watch all media elements
document.querySelectorAll("[data-video], [data-photo]").forEach(el => {
  mediaObserver.observe(el);
});


// ===== Fill-prompt auto-clear =====
// Once you've replaced "[FILL IN ..." text with your real copy, the dashed/italic
// placeholder styling removes itself automatically on next load.
document.querySelectorAll(".fill-prompt").forEach(el => {
  if (!/\[FILL IN/i.test(el.textContent)) {
    el.classList.remove("fill-prompt");
  }
});
