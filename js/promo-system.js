/* ============================================================
   MOOMENTOS — Sistema de promociones (automático por calendario)
   ------------------------------------------------------------
   Ya NO hay interruptor manual. La promo se activa y desactiva
   sola según las fechas de `events[...].dates`, en hora de CDMX.

   Para agregar o mover una fecha: edita `dates` del evento.
   Formato: { AÑO: ["YYYY-MM-DD inicio", "YYYY-MM-DD fin"] }
   (el fin incluye el día completo, hasta las 23:59:59).

   Si hoy no cae en ningún rango NO se descarga promo-styles.css
   y la página se ve con la interfaz estándar.
   Si dos eventos coinciden, gana el de mayor descuento.

   `themeClass` solo cambia los acentos (ver promo-styles.css):
   theme-moomentos (coral/violeta), theme-nocturna, theme-sanvalentin,
   theme-buenfin, theme-hotsale.
   ============================================================ */
const PROMO_CONFIG = {
  cssPath: "css/promo-styles.css",

  // México ya no usa horario de verano: CDMX es UTC-06:00 todo el año.
  tzOffset: "-06:00",

  // true: si falta el link de pago de ese descuento, NO se muestra la promo
  // (evita mostrar $674 y cobrar $899). Recomendado dejarlo en true.
  requireLinks: true,

  // false en producción. true solo para probar: ?promo=buenfin  o  ?promoNow=2026-11-14T10:00
  allowPreview: true,

  // Links de Mercado Pago con el monto ya rebajado: 1 link por nivel de descuento y plan.
  // Montos: 15% → 424 / 764 / 1359 · 20% → 399 / 719 / 1279 · 25% → 374 / 674 / 1199
  paymentLinksByDiscount: {
    15: { standard: "https://mpago.la/12x5PtT", premium: "https://mpago.la/1pukJ5G", platinum: "https://mpago.la/2Q9Boxq" },
    20: { standard: "https://mpago.la/2hkQjDd", premium: "https://mpago.la/1p3SMzM", platinum: "https://mpago.la/2j82Umk" },
    25: { standard: "https://mpago.la/2s6AHpv", premium: "https://mpago.la/1qnNcXf", platinum: "https://mpago.la/1g6buqv" },
  },

  events: {
    moomentosday: {
      name: "Moomentos Day",
      themeClass: "theme-moomentos",
      discountPercentage: 25,
      heroMessage: "En todos los paquetes",
      dates: {
        2026: ["2026-10-16", "2026-10-18"],
        2027: ["2027-10-16", "2027-10-18"],
      },
    },
    buenfin: {
      name: "Buen Fin",
      themeClass: "theme-buenfin",
      discountPercentage: 20,
      heroMessage: "En todos los paquetes",
      dates: {
        2026: ["2026-11-13", "2026-11-17"],
        // 2027: el SAT/Concamin anuncia fechas cerca de octubre: agregar cuando se publiquen
      },
    },
    nocturna: {
      name: "Nocturna Navideña",
      themeClass: "theme-nocturna",
      discountPercentage: 15,
      heroMessage: "En todos los paquetes",
      dates: {
        2026: ["2026-12-04", "2026-12-06"], // primer fin de semana de diciembre (vie-dom)
      },
    },
    planea2027: {
      name: "Planea tu 2027",
      themeClass: "theme-moomentos",
      discountPercentage: 15,
      heroMessage: "En todos los paquetes",
      dates: {
        2027: ["2027-01-02", "2027-01-08"],
      },
    },
    sanvalentin: {
      name: "San Valentín",
      themeClass: "theme-sanvalentin",
      discountPercentage: 15,
      heroMessage: "En todos los paquetes",
      dates: {
        2027: ["2027-02-10", "2027-02-14"],
      },
    },
    hotsale: {
      name: "Hot Sale 2027",
      themeClass: "theme-hotsale",
      discountPercentage: 20,
      heroMessage: "En todos los paquetes",
      dates: {
        2027: ["2027-05-31", "2027-06-08"], // ⚠ CONFIRMAR cuando se anuncie el Hot Sale oficial
      },
    },
  },
};

(function () {
  // Nombre visible del botón (data-package) → id de paquete
  const PLAN_IDS = { Estándar: "standard", Premium: "premium", Platinum: "platinum" };
  const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  const fmt = (n) => "$" + n.toLocaleString("es-MX");
  const toStart = (d) => new Date(d + "T00:00:00" + PROMO_CONFIG.tzOffset);
  const toEnd = (d) => new Date(d + "T23:59:59.999" + PROMO_CONFIG.tzOffset);

  // "Del 16 al 18 de octubre" · "Del 31 de mayo al 8 de junio" · "Hasta el 18 de octubre" (sin inicio)
  const rangeLabel = (from, to) => {
    const [, m2, d2] = to.split("-").map(Number);
    if (!from) return "Hasta el " + d2 + " de " + MONTHS[m2 - 1];
    const [, m1, d1] = from.split("-").map(Number);
    if (from === to) return d1 + " de " + MONTHS[m1 - 1];
    if (m1 === m2) return "Del " + d1 + " al " + d2 + " de " + MONTHS[m2 - 1];
    return "Del " + d1 + " de " + MONTHS[m1 - 1] + " al " + d2 + " de " + MONTHS[m2 - 1];
  };

  // ── Preview opcional (solo si allowPreview = true) ──
  const params = new URLSearchParams(window.location.search);
  const preview = PROMO_CONFIG.allowPreview;
  const previewKey = preview ? params.get("promo") : null;
  const fakeNow = preview && params.get("promoNow") ? new Date(params.get("promoNow") + (params.get("promoNow").length <= 16 ? ":00" : "") + PROMO_CONFIG.tzOffset) : null;
  const now = () => (fakeNow && !isNaN(fakeNow) ? fakeNow : new Date());

  // ── Resuelve qué evento está activo en una fecha dada ──
  // Devuelve { key, event, startDate, endDate } o null. Si hay empate de fechas gana el mayor descuento.
  function resolve(at) {
    let best = null;
    Object.entries(PROMO_CONFIG.events).forEach(([key, ev]) => {
      Object.values(ev.dates || {}).forEach(([from, to]) => {
        if (at >= toStart(from) && at <= toEnd(to)) {
          if (!best || ev.discountPercentage > best.event.discountPercentage) best = { key, event: ev, startDate: from, endDate: to };
        }
      });
    });
    return best;
  }

  let active = null;
  if (previewKey && PROMO_CONFIG.events[previewKey]) {
    const ev = PROMO_CONFIG.events[previewKey];
    const lastRange = Object.values(ev.dates || {}).pop() || [null, "2099-12-31"];
    active = { key: previewKey, event: ev, startDate: lastRange[0], endDate: lastRange[1] };
  } else {
    active = resolve(now());
  }

  // Si el evento no tiene links de pago cargados, no se muestra (requireLinks)
  if (active && PROMO_CONFIG.requireLinks) {
    const links = PROMO_CONFIG.paymentLinksByDiscount[active.event.discountPercentage] || {};
    if (!Object.values(links).some(Boolean)) {
      console.warn("[Promo] '" + active.key + "' está en fecha pero faltan los links de pago de " + active.event.discountPercentage + "%. Promo desactivada.");
      active = null;
    }
  }

  const event = active ? active.event : null;
  const paymentLinks = event ? PROMO_CONFIG.paymentLinksByDiscount[event.discountPercentage] || {} : {};

  // API pública: el script de pagos del index la consulta
  window.MoomentosPromo = {
    isActive: !!event,
    eventKey: active ? active.key : null, // útil para analytics: gtag("event", "...", { promo: MoomentosPromo.eventKey })
    getLink: (planName) => (event && paymentLinks[PLAN_IDS[planName]]) || null,
    resolve: resolve, // expuesto para pruebas: MoomentosPromo.resolve(new Date("2026-11-14T12:00:00-06:00"))
  };

  // ── Cambio automático si la página queda abierta al iniciar/terminar una promo ──
  if (!fakeNow && !previewKey) {
    const startKey = active ? active.key : null;
    setInterval(function () {
      const current = resolve(new Date());
      const currentKey = current ? current.key : null;
      if (currentKey !== startKey) window.location.reload();
    }, 30000);
  }

  if (!event) return; // Interfaz estándar, cero descargas extra

  document.addEventListener("DOMContentLoaded", function () {
    // 1. Inyectar CSS promocional
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = PROMO_CONFIG.cssPath;
    document.head.appendChild(link);

    // 2. Clases en <body>: has-promo + acento del evento
    document.body.classList.add("has-promo", event.themeClass);

    const pct = event.discountPercentage + "%";

    // 3. Barra superior: punto coral · nombre · porcentaje
    const banner = document.createElement("div");
    banner.id = "promo-banner";
    banner.setAttribute("role", "status");
    banner.innerHTML = '<span class="promo-banner__dot" aria-hidden="true"></span>' + "<strong>" + event.name + "</strong>" + '<span class="promo-banner__sep" aria-hidden="true">·</span>' + "<span>" + pct + " de descuento</span>";
    document.body.prepend(banner);

    // 4. Hero: nombre grande, fechas pequeñas, porcentaje protagonista.
    //    (El CSS oculta hero-eyebrow, hero-title y hero-sub mientras haya promo.)
    const hero = document.querySelector(".hero");
    const heroActions = hero && hero.querySelector(".hero-actions");
    if (heroActions) {
      const promo = document.createElement("div");
      promo.id = "promo-hero";
      promo.innerHTML =
        '<h1 class="promo-hero__name">' + event.name + "</h1>" +
        '<span class="promo-hero__dates">' + rangeLabel(active.startDate, active.endDate) + "</span>" +
        '<p class="promo-hero__with">con</p>' +
        '<p class="promo-hero__pct">' + pct + "</p>" +
        '<p class="promo-hero__off">de descuento</p>' +
        '<p class="promo-hero__note">' + event.heroMessage + "</p>";
      hero.insertBefore(promo, heroActions);

      // Botones: "Ver precios" pasa a ser el principal y "Ver diseños" el secundario
      const btns = heroActions.querySelectorAll(".btn");
      if (btns.length >= 2) {
        btns[0].textContent = "Ver precios";
        btns[0].setAttribute("href", "#precios");
        btns[1].textContent = "Ver diseños";
        btns[1].setAttribute("href", "#categorias");
      }
    }

    // 5. Por cada tarjeta de paquete: badge, precio tachado y precio con descuento
    document.querySelectorAll(".pricing-card[data-plan-id]").forEach(function (card) {
      const id = card.dataset.planId;
      if (!paymentLinks[id]) {
        console.warn("[Promo] Sin link de pago promo para '" + id + "' al " + event.discountPercentage + "%.");
        if (PROMO_CONFIG.requireLinks) return; // ese paquete conserva su precio normal
      }
      const original = Number(card.dataset.priceMxn);
      const discounted = Math.round(original * (1 - event.discountPercentage / 100));

      // Badge
      const badge = document.createElement("span");
      badge.className = "promo-badge";
      badge.textContent = pct + " OFF";
      card.appendChild(badge);

      // Precio tachado + precio con descuento
      const price = card.querySelector(".pricing-card__price");
      price.innerHTML = '<s class="promo-old">' + fmt(original) + '</s><span class="promo-new">' + fmt(discounted) + "</span>";

      // El botón guarda el precio que muestra el botón flotante de pago
      const btn = card.querySelector("[data-package]");
      if (btn) btn.setAttribute("data-price", fmt(discounted));
    });
  });
})();