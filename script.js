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
    location: "Em breve",
    time: "Em breve",
    urlGeral: "https://eventos.fluasports.com/corrida-do-novo-circuito-2027-maceio",
    urlColaborador: "https://eventos.fluasports.com/corrida-do-novo-circuito-2027-maceio-colaborador",
    regulamentoUrl: "assets/maceio/regulamento-maceio.pdf",
    priceGeralInt: "149",
    priceGeralDec: ",00",
    priceOld: "R$ 149,00",
    priceColabInt: "119",
    priceColabDec: ",20"
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
    location: "Em breve",
    time: "Em breve",
    urlGeral: "https://eventos.fluasports.com/corrida-do-novo-circuito-2027-recife",
    urlColaborador: "https://eventos.fluasports.com/corrida-do-novo-circuito-2027-recife-colaborador",
    regulamentoUrl: "assets/recife/regulamento-recife.pdf",
    priceGeralInt: "169",
    priceGeralDec: ",00",
    priceOld: "R$ 169,00",
    priceColabInt: "135",
    priceColabDec: ",20"
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
    location: "Em breve",
    time: "Em breve",
    urlGeral: "https://eventos.fluasports.com/corrida-do-novo-circuito-2027-joao-pessoa",
    urlColaborador: "https://eventos.fluasports.com/corrida-do-novo-circuito-2027-joao-pessoa-colaborador",
    regulamentoUrl: "assets/joao-pessoa/regulamento-joao-pessoa.pdf",
    priceGeralInt: "149",
    priceGeralDec: ",00",
    priceOld: "R$ 149,00",
    priceColabInt: "119",
    priceColabDec: ",20"
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
    currentCityId = cityParam && CITIES[cityParam] ? cityParam : "recife";
    renderHomeCitySelector();
    initNavScroll();
    initReveal();
    initMarquee();
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

// ==================== HOME: CITY SELECTOR (CORRIDA MATEUS STYLE) ====================
const ARROW_CIRCLE_ICON = `
  <span class="city-arrow-circle" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6V6z" /></svg>
  </span>`;

const HOME_CITY_ORDER = ["recife", "maceio", "joaoPessoa"];
const LOCKED_SLOTS_COUNT = 3;

function renderHomeCitySelector() {
  const city = CITIES[currentCityId];
  const currentBtn = document.getElementById("city-current-btn");
  const kitImg = document.getElementById("kit-preview-img");
  const listEl = document.getElementById("city-list");
  if (!currentBtn || !listEl) return;

  const labelEl = currentBtn.querySelector(".city-current-label");
  if (labelEl) labelEl.textContent = city.label;

  currentBtn.onclick = () => {
    window.location.href = `etapa.html?cidade=${currentCityId}`;
  };

  if (kitImg) {
    kitImg.src = city.kitImg;
    kitImg.alt = `Kit do corredor — Etapa ${city.name}`;
  }

  listEl.innerHTML = "";

  HOME_CITY_ORDER.forEach((key) => {
    if (key === currentCityId) return;
    const item = CITIES[key];
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "city-option";
    btn.innerHTML = `${ARROW_CIRCLE_ICON}<span>${item.label}</span>`;
    btn.addEventListener("click", () => {
      currentCityId = key;
      renderHomeCitySelector();
    });
    li.appendChild(btn);
    listEl.appendChild(li);
  });

  for (let i = 0; i < LOCKED_SLOTS_COUNT; i++) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.disabled = true;
    btn.setAttribute("aria-disabled", "true");
    btn.innerHTML = `<span class="bag" aria-hidden="true"></span><span>EM BREVE</span>`;
    li.appendChild(btn);
    listEl.appendChild(li);
  }
}

function openRegulamento() {
  window.open("assets/common/regulamento-geral.pdf", "_blank", "noopener");
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
    setSignupLink(a, city.urlGeral);
  });
  document.querySelectorAll(".dynamic-link-colaborador").forEach((a) => {
    setSignupLink(a, city.urlColaborador);
  });

  // 5. Update countdown city notice
  const cdNotice = document.getElementById("countdown-city-notice");
  if (cdNotice) {
    cdNotice.textContent = `ETAPA ${city.label} • ${city.dateText.toUpperCase()} • 5KM | 10KM | 15KM`;
  }

  // 6. Update stage regulation PDF link
  const regLink = document.getElementById("btn-download-regulamento");
  if (regLink && city.regulamentoUrl) {
    regLink.href = city.regulamentoUrl;
  }

  // 7. Update city-specific ticket prices
  document.querySelectorAll(".dynamic-price-geral-int").forEach((el) => {
    el.textContent = city.priceGeralInt;
  });
  document.querySelectorAll(".dynamic-price-geral-dec").forEach((el) => {
    el.textContent = city.priceGeralDec;
  });
  document.querySelectorAll(".dynamic-price-old").forEach((el) => {
    el.textContent = city.priceOld;
  });
  document.querySelectorAll(".dynamic-price-colab-int").forEach((el) => {
    el.textContent = city.priceColabInt;
  });
  document.querySelectorAll(".dynamic-price-colab-dec").forEach((el) => {
    el.textContent = city.priceColabDec;
  });
}

// Inscrições fechadas: sem URL no CITIES, o botão fica desativado e sem href,
// para que o link de compra não chegue ao navegador.
function setSignupLink(link, url) {
  if (url) {
    link.href = url;
    link.classList.remove("is-disabled");
    link.removeAttribute("aria-disabled");
    return;
  }
  link.removeAttribute("href");
  link.removeAttribute("target");
  link.classList.add("is-disabled");
  link.setAttribute("aria-disabled", "true");
  link.title = "Inscrições em breve";
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
    if (btnGeral) setSignupLink(btnGeral, city.urlGeral);

    const btnColab = document.getElementById("modal-btn-colaborador");
    if (btnColab) setSignupLink(btnColab, city.urlColaborador);

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

// ==================== GALLERY MARQUEE ====================
function initMarquee() {
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-offscreen", !entry.isIntersecting);
    });
  });
  document.querySelectorAll(".marquee").forEach((el) => observer.observe(el));
}
