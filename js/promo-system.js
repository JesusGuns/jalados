/* ============================================================
   MOOMENTOS — Sistema de promociones
   Para activar/desactivar: cambia `active` y `currentEvent`.
   Si active === false NO se descarga promo-styles.css.
   ============================================================ */
const PROMO_CONFIG = {
  active: false, // ← bandera global
  cssPath: "css/promo-styles.css",
  currentEvent: "hotsale", // hotsale | blackfriday | custom
  // false: muestra precios rebajados aunque falte el link de pago (usa el link normal; avisa en consola).
  // true: sin link promo, ese paquete conserva su precio normal.
  requireLinks: false,
  events: {
    hotsale: {
      name: "Hot Sale 2026",
      themeClass: "theme-hotsale",
      badgeText: "30% OFF",
      bannerMessage: "🔥 ¡Hot Sale! 30% de descuento en tus invitaciones digitales",
      heroMessage: "En todos los paquetes",
      deadlineText: "Solo por tiempo limitado", // ej. "Hasta el 31 de mayo"
      discountPercentage: 30,
      // Pega aquí los links de Mercado Pago con el precio ya rebajado.
      // Si falta el link de un paquete, ese paquete NO muestra descuento.
      paymentLinks: { standard: "", premium: "", platinum: "" },
    },
    blackfriday: {
      name: "Black Friday",
      themeClass: "theme-blackfriday",
      badgeText: "40% OFF",
      bannerMessage: "⚡ Black Friday: precios especiales por tiempo limitado",
      heroMessage: "En todos los paquetes",
      deadlineText: "Solo por tiempo limitado",
      discountPercentage: 40,
      paymentLinks: { standard: "", premium: "", platinum: "" },
    },
    custom: {
      name: "Promo de temporada",
      themeClass: "theme-custom",
      badgeText: "20% OFF",
      bannerMessage: "🎉 Promoción de temporada en todos los paquetes",
      heroMessage: "En todos los paquetes",
      deadlineText: "Solo por tiempo limitado",
      discountPercentage: 20,
      paymentLinks: { standard: "", premium: "", platinum: "" },
    },
  },
};

(function () {
  // Nombre visible del botón (data-package) → id de paquete
  const PLAN_IDS = { Estándar: "standard", Premium: "premium", Platinum: "platinum" };

  const event = PROMO_CONFIG.active ? PROMO_CONFIG.events[PROMO_CONFIG.currentEvent] : null;
  if (PROMO_CONFIG.active && !event) console.warn("[Promo] Evento no encontrado:", PROMO_CONFIG.currentEvent);

  const fmt = (n) => "$" + n.toLocaleString("es-MX");

  // API pública: el script de pagos del index la consulta
  window.MoomentosPromo = {
    isActive: !!event,
    getLink: (planName) => (event && event.paymentLinks[PLAN_IDS[planName]]) || null,
  };

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
    const hero = document.querySelector(".hero");
    const heroActions = hero && hero.querySelector(".hero-actions");
    if (heroActions) {
      const promo = document.createElement("a");
      promo.id = "promo-hero";
      promo.href = "#precios";
      promo.innerHTML =
        '<span class="promo-hero__pct">' + event.badgeText + "</span>" +
        '<span class="promo-hero__text"><strong>' + event.name + "</strong>" +
        "<span>" + event.heroMessage + (event.deadlineText ? " · " + event.deadlineText : "") + "</span></span>" +
        '<span class="promo-hero__cta">Ver precios</span>';
      hero.insertBefore(promo, heroActions);
    }

    // 4, 5 y 6. Por cada tarjeta de paquete
    document.querySelectorAll(".pricing-card[data-plan-id]").forEach(function (card) {
      const id = card.dataset.planId;
      const payLink = event.paymentLinks[id];
      if (!payLink) {
        console.warn("[Promo] Sin link de pago promo para '" + id + "'.");
        if (PROMO_CONFIG.requireLinks) return;
      }
      const original = Number(card.dataset.priceMxn);
      const discounted = Math.round(original * (1 - event.discountPercentage / 100));

      // Badge
      const badge = document.createElement("span");
      badge.className = "promo-badge";
      badge.textContent = event.badgeText;
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