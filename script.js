/* ============================================================
   CONFIGURACIÓN — La invitación se edita aquí.
   ============================================================ */
const CONFIG = {
  name: "María Fernanda",                              // Nombre de la quinceañera

  // Fecha de la fiesta (formato ISO: AAAA-MM-DDTHH:MM:SS) para la cuenta regresiva.
  countdownDate: "2026-12-05T19:00:00",

  // Textos mostrados en pantalla.
  eventDay: "5 de diciembre de 2026",
  eventTime: "19:00 hrs",
  venue: "Salón de Fiestas La Quinta Real",
  address: "Av. de los Sauces #123, Col. Centro, Cuernavaca, Mor.",

  // Enlace de Google Maps (abre en el botón "Ver ubicación").
  mapsUrl: "https://maps.google.com/?q=Salón+de+Fiestas+La+Quinta+Real",

  // Fotografías de la galería (dentro de assets/images/).
  galleryImages: [
    "assets/images/gallery-1.jpg",
    "assets/images/gallery-2.jpg",
    "assets/images/gallery-3.jpg",
    "assets/images/gallery-4.jpg",
    "assets/images/gallery-5.jpg",
    "assets/images/gallery-6.jpg"
  ],

  // Música de fondo (dentro de assets/audio/). Nunca suena sola.
  musicSrc: "assets/audio/music.mp3",

  // URL del Web App de Google Apps Script (ver instrucciones).
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxrR1Hy0knG1ULFfC03nvlRVZwqI5v3NsCTdVSlaAmBuVx41v0SZ6doaLT8eqQ9Mvh5/exec"
};

/* ============================================================
   Llenar textos dinámicos
   ============================================================ */
document.getElementById("coverName").textContent = CONFIG.name;
document.getElementById("coverDate").textContent = CONFIG.eventDay;
document.getElementById("eventDayInline").textContent = CONFIG.eventDay;
document.getElementById("inviteName").textContent = CONFIG.name;
document.getElementById("inviteSignature").textContent = CONFIG.name;
document.getElementById("footerName").textContent = CONFIG.name;
document.getElementById("eventDay").textContent = CONFIG.eventDay;
document.getElementById("eventTime").textContent = CONFIG.eventTime;
document.getElementById("venue").textContent = CONFIG.venue;
document.getElementById("address").textContent = CONFIG.address;
document.getElementById("venueBtn").href = CONFIG.mapsUrl;

document.title = "Mis XV | " + CONFIG.name;

/* ============================================================
   Cuenta regresiva
   ============================================================ */
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("mins");
const secsEl = document.getElementById("secs");

function updateCountdown() {
  const diff = Math.max(0, new Date(CONFIG.countdownDate).getTime() - Date.now());
  const pad = (n) => String(n).padStart(2, "0");

  daysEl.textContent = pad(Math.floor(diff / 86400000));
  hoursEl.textContent = pad(Math.floor((diff % 86400000) / 3600000));
  minsEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
  secsEl.textContent = pad(Math.floor((diff % 60000) / 1000));
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ============================================================
   Animaciones al hacer scroll (fade in / slide up)
   ============================================================ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => {
  if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + "ms";
  observer.observe(el);
});

/* ============================================================
   Parallax ligero en la portada
   ============================================================ */
const parallaxEls = document.querySelectorAll("[data-parallax]");
let ticking = false;

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      parallaxEls.forEach((el) => {
        el.style.transform = "translate3d(0," + (y * parseFloat(el.dataset.parallax)) + "px,0)";
      });
      ticking = false;
    });
    ticking = true;
  }
}
window.addEventListener("scroll", onScroll, { passive: true });

/* ============================================================
   Galería + lightbox
   ============================================================ */
const grid = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
let currentIndex = 0;

CONFIG.galleryImages.forEach((src, i) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.dataset.index = i;
  btn.className = "group relative aspect-square overflow-hidden rounded-2xl border border-gold/20 shadow-sm";
  btn.innerHTML = '<img src="' + src + '" alt="Fotografía" loading="lazy" class="h-full w-full object-cover transition duration-500 group-hover:scale-105">';
  btn.addEventListener("click", openLightbox);
  grid.appendChild(btn);
});

function openLightbox(e) {
  currentIndex = Number(e.currentTarget.dataset.index);
  showLightboxImage();
  lightbox.classList.remove("hidden");
  lightbox.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function showLightboxImage() {
  lightboxImg.src = CONFIG.galleryImages[currentIndex];
}

function closeLightbox() {
  lightbox.classList.add("hidden");
  lightbox.classList.remove("flex");
  document.body.style.overflow = "";
}

document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
document.getElementById("lightboxPrev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + CONFIG.galleryImages.length) % CONFIG.galleryImages.length;
  showLightboxImage();
});
document.getElementById("lightboxNext").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % CONFIG.galleryImages.length;
  showLightboxImage();
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (lightbox.classList.contains("hidden")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") document.getElementById("lightboxPrev").click();
  if (e.key === "ArrowRight") document.getElementById("lightboxNext").click();
});

/* ============================================================
   Música de fondo (solo al hacer clic en el botón)
   ============================================================ */
const musicBtn = document.getElementById("musicBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const audio = new Audio(CONFIG.musicSrc);
audio.loop = true;

musicBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().then(() => {
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
    }).catch(() => {
      alert("No se pudo reproducir el audio.");
    });
  } else {
    audio.pause();
    pauseIcon.classList.add("hidden");
    playIcon.classList.remove("hidden");
  }
});

/* ============================================================
   Formulario de confirmación de asistencia
   ============================================================ */
const form = document.getElementById("rsvpForm");
const submitBtn = document.getElementById("submitBtn");
const statusBox = document.getElementById("rsvpStatus");
const successBox = document.getElementById("rsvpSuccess");
const errorBox = document.getElementById("rsvpError");
const guestsWrap = document.getElementById("guestsWrap");
let submitting = false;

document.querySelectorAll('input[name="asistencia"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    guestsWrap.classList.toggle("hidden", radio.value === "No");
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (submitting) return;

  const nombre = document.getElementById("rsvpName").value.trim();
  const asistencia = form.querySelector('input[name="asistencia"]:checked');
  const acompanantes = document.getElementById("rsvpGuests").value;
  const nombresAcompanantes = document.getElementById("rsvpNames").value.trim();
  const comentario = document.getElementById("rsvpComment").value.trim();

  if (!nombre || !asistencia) return;

  submitting = true;
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";
  statusBox.classList.add("hidden");
  successBox.classList.add("hidden");
  errorBox.classList.add("hidden");

  const data = {
    nombre,
    asistencia: asistencia.value,
    acompanantes: Number(acompanantes),
    nombresAcompanantes,
    comentario
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
      signal: controller.signal
    });
    clearTimeout(timeout);

    const result = await res.json();

    if (result.ok) {
      form.reset();
      guestsWrap.classList.remove("hidden");
      statusBox.classList.remove("hidden");
      successBox.classList.remove("hidden");
    } else {
      throw new Error(result.mensaje || "Error desconocido");
    }
  } catch (err) {
    statusBox.classList.remove("hidden");
    errorBox.classList.remove("hidden");
  } finally {
    submitting = false;
    submitBtn.disabled = false;
    submitBtn.textContent = "Confirmar";
  }
});