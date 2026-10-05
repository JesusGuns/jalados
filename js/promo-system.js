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
      themeClass: "theme-custom", // TODO: crear .theme-moomentosday en promo-styles.css
      discountPercentage: 25,
      bannerMessage: "🎉 ¡Moomentos Day! 25% de descuento en todas tus invitaciones",
      heroMessage: "En todos los paquetes",
      dates: {
        2026: ["2026-10-16", "2026-10-18"],
        2027: ["2027-10-16", "2027-10-18"],
      },
    },
    buenfin: {
      name: "Buen Fin",
      themeClass: "theme-custom",
      discountPercentage: 20,
      bannerMessage: "🛍️ ¡Buen Fin! 20% de descuento en tus invitaciones digitales",
      heroMessage: "En todos los paquetes",
      dates: {
        2026: ["2026-11-13", "2026-11-17"],
        // 2027: el SAT/Concamin anuncia fechas cerca de octubre: agregar cuando se publiquen
      },
    },
    nocturna: {
      name: "Nocturna Navideña",
      themeClass: "theme-custom",
      discountPercentage: 15,
      bannerMessage: "🎄 Nocturna Navideña: 15% de descuento en tus invitaciones",
      heroMessage: "En todos los paquetes",
      dates: {
        2026: ["2026-12-04", "2026-12-06"], // primer fin de semana de diciembre (vie-dom)
      },
    },
    planea2027: {
      name: "Planea tu 2027",
      themeClass: "theme-custom",
      discountPercentage: 15,
      bannerMessage: "📅 Planea tu 2027: 15% de descuento al reservar tu invitación",
      heroMessage: "En todos los paquetes",
      dates: {
        2027: ["2027-01-02", "2027-01-08"],
      },
    },
    sanvalentin: {
      name: "San Valentín",
      themeClass: "theme-custom",
      discountPercentage: 15,
      bannerMessage: "💘 San Valentín: 15% de descuento en tus invitaciones",
      heroMessage: "En todos los paquetes",
      dates: {
        2027: ["2027-02-10", "2027-02-14"],
      },
    },
    hotsale: {
      name: "Hot Sale 2027",
      themeClass: "theme-hotsale",
      discountPercentage: 20,
      bannerMessage: "🔥 ¡Hot Sale! 20% de descuento en tus invitaciones digitales",
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
  const endLabel = (d) => {
    const [, m, day] = d.split("-").map(Number);
    return "Hasta el " + day + " de " + MONTHS[m - 1];
  };

  // ── Preview opcional (solo si allowPreview = true) ──
  const params = new URLSearchParams(window.location.search);
  const preview = PROMO_CONFIG.allowPreview;
  const previewKey = preview ? params.get("promo") : null;
  const fakeNow = preview && params.get("promoNow") ? new Date(params.get("promoNow") + (params.get("promoNow").length <= 16 ? ":00" : "") + PROMO_CONFIG.tzOffset) : null;
  const now = () => (fakeNow && !isNaN(fakeNow) ? fakeNow : new Date());

  // ── Resuelve qué evento está activo en una fecha dada ──
  // Devuelve { key, event, endDate } o null. Si hay empate de fechas gana el mayor descuento.
  function resolve(at) {
    let best = null;
    Object.entries(PROMO_CONFIG.events).forEach(([key, ev]) => {
      Object.values(ev.dates || {}).forEach(([from, to]) => {
        if (at >= toStart(from) && at <= toEnd(to)) {
          if (!best || ev.discountPercentage > best.event.discountPercentage) best = { key, event: ev, endDate: to };
        }
      });
    });
    return best;
  }

  let active = null;
  if (previewKey && PROMO_CONFIG.events[previewKey]) {
    const ev = PROMO_CONFIG.events[previewKey];
    const lastRange = Object.values(ev.dates || {}).pop() || [null, "2099-12-31"];
    active = { key: previewKey, event: ev, endDate: lastRange[1] };
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

    // 2. Clase temática en <body>
    document.body.classList.add("has-promo", event.themeClass);

    // 3. Banner superior
    const banner = document.createElement("div");
    banner.id = "promo-banner";
    banner.setAttribute("role", "status");
    banner.textContent = event.bannerMessage;
    document.body.prepend(banner);

    // Aviso en el hero, justo antes de los botones
    const badgeText = event.discountPercentage + "% OFF";
    const hero = document.querySelector(".hero");
    const heroActions = hero && hero.querySelector(".hero-actions");
    if (heroActions) {
      const promo = document.createElement("a");
      promo.id = "promo-hero";
      promo.href = "#precios";
      promo.innerHTML =
        '<span class="promo-hero__pct">' + badgeText + "</span>" +
        '<span class="promo-hero__text"><strong>' + event.name + "</strong>" +
        "<span>" + event.heroMessage + " · " + endLabel(active.endDate) + "</span></span>" +
        '<span class="promo-hero__cta">Ver precios</span>';
      hero.insertBefore(promo, heroActions);
    }

    // 4, 5 y 6. Por cada tarjeta de paquete
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
      badge.textContent = badgeText;
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