// ==================== CITIES CONFIGURATION ====================
const CITIES = {
  maceio: {
    id: "maceio",
    name: "Maceió",
    label: "MACEIÓ",
    state: "AL",
    dateText: "28 de Fevereiro",
    targetDate: "2027-02-28T06:00:00-03:00",
    kitImg: "assets/maceio/CAMISA_MACEIO.png",
    dateImg: "assets/maceio/DOBRA_DATA.png",
    distances: ["5KM", "10KM", "15KM"],
    location: "Praia de Pajuçara / Ponta Verde — Maceió, AL",
    time: "06h00 (Largada)",
    urlGeral: "https://eventos.fluasports.com/corrida-do-novo-circuito-2027-maceio",
    urlColaborador: "https://eventos.fluasports.com/corrida-do-novo-circuito-2027-maceio-colaborador",
    regulamentoUrl: "#regulamento"
  },
  recife: {
    id: "recife",
    name: "Recife",
    label: "RECIFE",
    state: "PE",
    dateText: "31 de Janeiro",
    targetDate: "2027-01-31T06:00:00-03:00",
    kitImg: "assets/recife/CAMISA_RECIFE.png",
    dateImg: "assets/recife/DOBRA_DATA.png",
    distances: ["5KM", "10KM", "15KM"],
    location: "Cais da Alfândega / Marco Zero — Recife, PE",
    time: "06h00 (Largada)",
    urlGeral: "https://eventos.fluasports.com/corrida-do-novo-circuito-2027-recife",
    urlColaborador: "https://eventos.fluasports.com/corrida-do-novo-circuito-2027-recife-colaborador",
    regulamentoUrl: "#regulamento"
  },
  joaoPessoa: {
    id: "joaoPessoa",
    name: "João Pessoa",
    label: "JOÃO PESSOA",
    state: "PB",
    dateText: "21 de Março",
    targetDate: "2027-03-21T06:00:00-03:00",
    kitImg: "assets/joao-pessoa/CAMISA_JP.png",
    dateImg: "assets/joao-pessoa/DOBRA_DATA.png",
    distances: ["5KM", "10KM", "15KM"],
    location: "Busto de Tamandaré / Cabo Branco — João Pessoa, PB",
    time: "06h00 (Largada)",
    urlGeral: "https://eventos.fluasports.com/corrida-do-novo-circuito-2027-joao-pessoa",
    urlColaborador: "https://eventos.fluasports.com/corrida-do-novo-circuito-2027-joao-pessoa-colaborador",
    regulamentoUrl: "#regulamento"
  }
};

const CITY_KEYS = ["maceio", "recife", "joaoPessoa"];
let currentCityId = "maceio";
let currentTab = "geral"; // 'geral' | 'colaborador'

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
  // Read params from URL
  const urlParams = new URLSearchParams(window.location.search);
  const cityParam = urlParams.get("cidade");
  const tabParam = urlParams.get("aba");

  if (cityParam && CITIES[cityParam]) {
    currentCityId = cityParam;
  }
  if (tabParam === "colaborador" || tabParam === "geral") {
    currentTab = tabParam;
  }

  if (document.body.dataset.page === "home") {
    renderStageCards();
    initReveal();
    return;
  }

  initTabs();
  updateCityUI();
  initCountdown();
  initAccordion();
  initSignupModal();
  initNavScroll();
  initReveal();
});

// ==================== HOME: CITY LIST ====================
const PIN_ICON = `
  <span class="city-pin" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
    </svg>
  </span>`;

function renderStageCards() {
  const listEl = document.getElementById("city-list");
  const kitImg = document.getElementById("kit-preview-img");
  if (!listEl) return;

  const sorted = [...CITY_KEYS].sort(
    (a, b) => new Date(CITIES[a].targetDate) - new Date(CITIES[b].targetDate)
  );

  function preview(key, link) {
    listEl.querySelectorAll(".city-option").forEach((el) => {
      el.classList.toggle("is-active", el === link);
    });
    if (kitImg) {
      kitImg.src = CITIES[key].kitImg;
      kitImg.alt = `Kit da etapa ${CITIES[key].name}`;
    }
  }

  sorted.forEach((key, index) => {
    const city = CITIES[key];
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.className = "city-option";
    link.href = `etapa.html?cidade=${key}`;
    link.innerHTML = `
      ${PIN_ICON}
      <span class="city-option-name">${city.label}</span>
      <span class="city-option-date">${city.dateText}</span>
      <span class="city-option-arrow" aria-hidden="true">→</span>
    `;
    link.addEventListener("mouseenter", () => preview(key, link));
    link.addEventListener("focus", () => preview(key, link));
    li.appendChild(link);
    listEl.appendChild(li);
    if (index === 0) preview(key, link);
  });
}

// ==================== TABS LOGIC ====================
function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-nav-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      setTab(target);
    });
  });
  setTab(currentTab);
}

function setTab(tabKey) {
  currentTab = tabKey;
  // Update Buttons
  document.querySelectorAll(".tab-nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabKey);
  });
  // Update Content Panels
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.toggle("active", content.dataset.tabContent === tabKey);
  });
  updateURLParams();
}

// ==================== CITY PAGE ====================
function updateURLParams() {
  if (window.history && window.history.replaceState) {
    const url = new URL(window.location.href);
    url.searchParams.set("cidade", currentCityId);
    url.searchParams.set("aba", currentTab);
    window.history.replaceState({}, "", url.toString());
  }
}

function updateCityUI() {
  const city = CITIES[currentCityId];

  // 1. Kit preview image
  const kitImg = document.getElementById("kit-preview-img");
  if (kitImg) {
    kitImg.style.opacity = "0";
    setTimeout(() => {
      kitImg.src = city.kitImg;
      kitImg.alt = `Kit Corrida do Novo - Etapa ${city.name}`;
      kitImg.style.opacity = "1";
    }, 150);
  }

  // 2. Date bar image
  const dateBarImg = document.getElementById("date-bar-img");
  if (dateBarImg) {
    dateBarImg.style.opacity = "0";
    setTimeout(() => {
      dateBarImg.src = city.dateImg;
      dateBarImg.alt = `${city.name} - ${city.dateText}`;
      dateBarImg.style.opacity = "1";
    }, 150);
  }

  document.title = `${city.name} • Corrida do Novo`;

  // 3. Stage badges & titles across page
  document.querySelectorAll(".dynamic-city-name").forEach((el) => {
    el.textContent = city.name;
  });
  document.querySelectorAll(".dynamic-city-date").forEach((el) => {
    el.textContent = city.dateText;
  });
  document.querySelectorAll(".dynamic-city-state").forEach((el) => {
    el.textContent = city.state;
  });
  document.querySelectorAll(".dynamic-city-location").forEach((el) => {
    el.textContent = city.location;
  });

  // 4. Update CTAs with correct signup links
  document.querySelectorAll(".dynamic-link-geral").forEach((a) => {
    a.href = city.urlGeral;
  });
  document.querySelectorAll(".dynamic-link-colaborador").forEach((a) => {
    a.href = city.urlColaborador;
  });

  // 5. Update countdown city notice
  const cdNotice = document.getElementById("countdown-city-notice");
  if (cdNotice) {
    cdNotice.textContent = `ETAPA ${city.label} • ${city.dateText.toUpperCase()} • LARGADA 06H`;
  }
}

// ==================== COUNTDOWN TIMER ====================
let countdownInterval = null;

function initCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);

  function update() {
    const city = CITIES[currentCityId];
    const target = new Date(city.targetDate).getTime();
    const now = Date.now();
    let diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);

    const seconds = Math.floor(diff / 1000);

    const pad = (n) => String(n).padStart(2, "0");

    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minsEl = document.getElementById("cd-mins");
    const secsEl = document.getElementById("cd-secs");

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minsEl) minsEl.textContent = pad(minutes);
    if (secsEl) secsEl.textContent = pad(seconds);
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

// ==================== ACCORDION ====================
function initAccordion() {
  const items = document.querySelectorAll(".accordion-item");
  items.forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      // Close other items
      items.forEach((i) => i.classList.remove("open"));
      if (!isOpen) {
        item.classList.add("open");
      }
    });
  });
}

// ==================== SIGNUP MODAL ====================
function initSignupModal() {
  const modal = document.getElementById("signup-modal");
  if (!modal) return;

  function openModal() {
    const city = CITIES[currentCityId];
    const modalCityBadge = document.getElementById("modal-city-badge");
    if (modalCityBadge) {
      modalCityBadge.textContent = `Etapa ${city.name} • ${city.dateText}`;
    }
    const btnGeral = document.getElementById("modal-btn-geral");
    if (btnGeral) btnGeral.href = city.urlGeral;

    const btnColab = document.getElementById("modal-btn-colaborador");
    if (btnColab) btnColab.href = city.urlColaborador;

    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-signup-trigger]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  document.querySelectorAll("[data-signup-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
}

// ==================== NAV SCROLL SMOOTH ====================
function initNavScroll() {
  document.querySelectorAll(".nav a:not(.nav-cta-btn)").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 70;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = target.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }
    });
  });
}

// ==================== SCROLL REVEAL ====================
function initReveal() {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = document.querySelectorAll(
    ".kit-card, .city-aside, .story-grid, .section-title-wrap, .ticket-card, .countdown-box, .accordion-item"
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  targets.forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}
