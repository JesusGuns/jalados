var Resources = {
  Config: {
    EventType: "",
    Template: true,
    AudioUrl: "",
    Sections: {
      showCounter: true,
      showIntroduction: true,
      showParents: true,
      showItinerary: true,
      showGallery: true,
      showDressCode: true,
      showTickets: true,
      showTableNumber: true,
      showAttendance: true,
      showGiftTable: true,
    },
    ShowElements: {
      showAmazonOption: true,
      showLiverpoolOption: true,
    },
    Themes: [],
  },
  RSVP: {
    Enable: true,
    EventID: "",
    GuestSheetName: "", // Load on Init
    ConfirmSheetName: "", // Load on Init
    GuestName: "",
    TableNumber: 4,
    TicketCount: 2,
    // RSVP WhatsApp
    WhatsApp: false, // ← NUEVO: true = confirma solo por WhatsApp
    WhatsAppNumber: "523346004551", // ← NUEVO: número destino (formato internacional sin +)
  },
  MainEvent: {},
  SecondaryEvent: {},
  StaticLinks: {
    ImageAudioUrl: "/images/icons/play.png",
    ImageAudioPauseUrl: "/images/icons/pause.png",
    ImageAmazonUrl: "/images/icons/amazon-256.png",
    ImageLiverpoolUrl: "/images/icons/liverpool.jpeg",
    ImageGoogleLocation: "/images/icons/GoogleMaps-256.png",
    ImageCodeBar: "/images/icons/CodeBar.jpg",
  },
  Messages: {
    Confirmation: "¡Qué alegría! Tu asistencia ha sido confirmada. ✨",
    WillNotAttend: "¡Gracias por avisarnos! 🤍",
  },
};

export const helpers = {
  init: function (resources) {
    // Config
    Resources.Config = resources.Config;

    // Main Event — propiedades calculadas de la fecha
    Resources.MainEvent = resources.MainEvent;
    Resources.MainEvent.Time = Resources.MainEvent.Date.getTime();
    Resources.MainEvent.DateString = helpers.onGetDateString(Resources.MainEvent.Date);
    Resources.MainEvent.HourString = helpers.onGetHoursString(Resources.MainEvent.Date);
    Resources.MainEvent.WeekDay = helpers.onGetWeekDay(Resources.MainEvent.Date);
    Resources.MainEvent.Day = helpers.onGetDay(Resources.MainEvent.Date);
    Resources.MainEvent.Month = helpers.onGetMonth(Resources.MainEvent.Date);
    Resources.MainEvent.Year = helpers.onGetYear(Resources.MainEvent.Date);
    Resources.MainEvent.YYYYMMDD = helpers.onGetDateYYYYMMDD(Resources.MainEvent.Date);

    // Secondary Event — opcional (BabyShower no lo tiene)
    if (resources.SecondaryEvent) {
      Resources.SecondaryEvent = resources.SecondaryEvent;
      Resources.SecondaryEvent.Time = Resources.SecondaryEvent.Date.getTime();
      Resources.SecondaryEvent.DateString = helpers.onGetDateString(Resources.SecondaryEvent.Date);
      Resources.SecondaryEvent.HourString = helpers.onGetHoursString(Resources.SecondaryEvent.Date);
      Resources.SecondaryEvent.WeekDay = helpers.onGetWeekDay(Resources.SecondaryEvent.Date);
      Resources.SecondaryEvent.Day = helpers.onGetDay(Resources.SecondaryEvent.Date);
      Resources.SecondaryEvent.Month = helpers.onGetMonth(Resources.SecondaryEvent.Date);
      Resources.SecondaryEvent.Year = helpers.onGetYear(Resources.SecondaryEvent.Date);
      Resources.SecondaryEvent.YYYYMMDD = helpers.onGetDateYYYYMMDD(Resources.SecondaryEvent.Date);
    }

    // RSPV
    Resources.RSVP = resources.RSVP;
    Resources.RSVP.WhatsApp = !!resources.RSVP.WhatsApp;
    Resources.RSVP.WhatsAppNumber = (resources.RSVP.WhatsAppNumber || "523346004551").replace(/\D/g, "");
    Resources.RSVP.GuestSheetName = resources.RSVP.EventID + "_Guest";
    Resources.RSVP.ConfirmSheetName = resources.RSVP.EventID + "_Confirmed";
    Resources.RSVP.GuestName = resources.Config.Template ? "Jacqueline" : "";
    Resources.RSVP.TableNumber = resources.Config.Template ? 4 : 0;
    Resources.RSVP.TicketCount = resources.Config.Template ? 2 : 0;

    helpers.onLoad();
  },
  onGetResources: function () {
    return Resources;
  },
  onGetWeekDay: function (eventDate) {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const dayOfWeek = eventDate.getDay();
    const dayName = days[dayOfWeek];
    return dayName;
  },
  onGetDay: function (eventDate) {
    return eventDate.getDate();
  },
  onGetMonth: function (eventDate) {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const month = months[eventDate.getMonth()];
    return month;
  },
  onGetYear: function (eventDate) {
    return eventDate.getFullYear();
  },
  onGetDateString: function (eventDate, includeDayName) {
    const day = helpers.onGetDay(eventDate);
    const dayName = helpers.onGetWeekDay(eventDate);
    const month = helpers.onGetMonth(eventDate);
    const year = helpers.onGetYear(eventDate);
    const dateString = includeDayName ? `${dayName} ${day} de ${month} de ${year}` : `${day} de ${month} de ${year}`;
    return dateString;
  },
  onGetHoursString: function (eventDate, includeThe) {
    let hours = eventDate.getHours();
    const ampm = hours >= 12 ? "p.m." : "a.m.";
    const mins = eventDate.getMinutes().toString().padStart(2, "0");
    const the = hours % 12 === 1 ? "la" : "las";
    hours = hours % 12 || 12;
    const hourString = includeThe ? `${the} ${hours}:${mins} ${ampm}` : `${hours}:${mins} ${ampm}`;
    return hourString;
  },
  onGetDateYYYYMMDD: function (eventDate) {
    const format = (f) => `${f.getFullYear()}${String(f.getMonth() + 1).padStart(2, "0")}${String(f.getDate()).padStart(2, "0")}`;
    return format(eventDate);
  },
  onAddZeroToNumber: function (number) {
    if (number.toString().length == 1) {
      return "0" + number.toString();
    }
    return number;
  },
  onCounterStart(eventDate) {
    const $days = $("#days");
    const $hours = $("#hours");
    const $minutes = $("#minutes");
    const $seconds = $("#seconds");

    // Constantes para evitar recalcular literales en cada tick
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    // Guardamos el último valor mostrado para evitar tocar el DOM si no cambió
    let last = { d: null, h: null, m: null, s: null };

    const render = (d, h, m, s) => {
      if (d !== last.d) $days.text(helpers.onAddZeroToNumber(d));
      if (h !== last.h) $hours.text(helpers.onAddZeroToNumber(h));
      if (m !== last.m) $minutes.text(helpers.onAddZeroToNumber(m));
      if (s !== last.s) $seconds.text(helpers.onAddZeroToNumber(s));
      last = { d, h, m, s };
    };

    let intervalId;
    const tick = () => {
      const distance = eventDate - Date.now();

      if (distance <= 0) {
        clearInterval(intervalId);
        render(0, 0, 0, 0);
        return;
      }

      const d = Math.floor(distance / DAY);
      const h = Math.floor((distance % DAY) / HOUR);
      const m = Math.floor((distance % HOUR) / MINUTE);
      const s = Math.floor((distance % MINUTE) / SECOND);

      render(d, h, m, s);
    };

    tick(); // primer render inmediato, sin esperar 1s
    intervalId = setInterval(tick, 1000);

    return intervalId;
  },
  onAudioPlayer: function () {
    var $audioButton = $("#audioButton");
    $audioButton.on("click", function () {
      $("#audio").OnAudioPlayerClick($audioButton);
      if ($("#audioButton").hasClass("off")) {
        $("[data-replace=Image_AudioUrl]").attr("src", Resources.StaticLinks.ImageAudioUrl);
      } else {
        $("[data-replace=Image_AudioUrl]").attr("src", Resources.StaticLinks.ImageAudioPauseUrl);
      }
    });
  },
  onPlay: function () {
    var $audioButton = $("#audioButton");
    var $audio = $("#audio");

    // Cachea el selector para no buscarlo dos veces
    $audio.OnAudioPlayerClick($audioButton);

    var isOff = $audioButton.hasClass("off");
    var src = isOff ? Resources.StaticLinks.ImageAudioUrl : Resources.StaticLinks.ImageAudioPauseUrl;

    $("[data-replace=Image_AudioUrl]").attr("src", src);
  },
  onToasty: function (mensaje, colorPrincipal = "#8B5E83") {
    if (Resources.Config.EventType == "Wedding") colorPrincipal = "#a68966";
    window
      .Toastify({
        text: mensaje,
        duration: 4000,
        gravity: "bottom",
        position: "center",
        style: {
          background: colorPrincipal,
          color: "#ffffff",
          borderRadius: "20px",
          padding: "12px 24px",
        },
      })
      .showToast();
  },
  onLoadSections: function () {
    const sections = Resources.Config.Sections;
    // ─── SECCIONES — show/hide ─────────────────────────
    const sectionMap = {
      showCounter: "._counter-section",
      showIntroduction: "._introduction-section",
      showParents: "._parents-section",
      showItinerary: "._itinerary-section",
      showGallery: "._gallery-section",
      showLoveStory: "._lovestory-section",
      showVideo: "._video-section",
      showDressCode: "._dresscode-section",
      showTickets: "._tickets-section",
      showTableNumber: "._table-section",
      showAttendance: "._attendance-section",
      showGiftTable: "._gifttable-section",
    };

    Object.entries(sectionMap).forEach(([key, selector]) => {
      if (!sections[key]) $(selector).remove();
    });
  },
  onLoadElements: function () {
    const showElements = Resources.Config.ShowElements;
    // ─── SECCIONES — show/hide elements ─────────────────────────
    const elementsMap = {
      showAmazonOption: "[data-replace='EventAmazonGiftTableUrl']",
      showLiverpoolOption: "[data-replace='EventLiverpoolGiftTableUrl']",
    };

    if (Resources.Config.Template) {
      $("#themeSwitcher").removeClass("d-none");
    }

    Object.entries(elementsMap).forEach(([key, selector]) => {
      if (!showElements[key]) $(selector).remove();
    });
  },
  onLoadRSVP: function () {
    const rspv = Resources.RSVP;
    if (rspv.Enable) {
      // ─── RSVP — campos comunes ───────────────────
      $("[data-replace=GuestName]").text(rspv.GuestName);
      $("[data-replace=TableNumber]").text(rspv.TableNumber);
      $("[data-replace=TicketCount]").text(rspv.TicketCount);
    }
  },
  onLoad: function () {
    const main = Resources.MainEvent;
    const secondary = Resources.SecondaryEvent;
    const config = Resources.Config;
    const type = Resources.Config.EventType;
    helpers.onLoadSections();
    helpers.onLoadRSVP();
    helpers.onLoadElements();

    // ─── MAIN EVENT — campos comunes ───────────────────
    $("[data-replace=MainEventLocationDescription]").text(main.LocationDescription);
    $("[data-replace=MainEventAddress]").text(main.Address);
    $("[data-replace=MainEventUrl]").attr("href", main.GoogleMapsUrl);
    $("[data-replace=MainEventHourString]").text(main.HourString);
    $("[data-replace=MainEventDay]").text(main.Day);
    $("[data-replace=MainEventWeekDay]").text(main.WeekDay);
    $("[data-replace=MainEventMonth]").text(main.Month);
    $("[data-replace=MainEventYear]").text(main.Year);
    $("[data-replace=EventDateString]").text(main.DateString);
    $("[data-replace=EventHourString]").text(main.HourString);
    $("[data-replace=EventAmazonGiftTableUrl]").attr("href", main.AmazonGiftTableUrl);
    $("[data-replace=EventLiverpoolGiftTableUrl]").attr("href", main.LiverpoolGiftTableUrl);

    // ─── SECONDARY EVENT — solo si existe ──────────────
    if (secondary) {
      $("[data-replace=SecondaryEventLocationDescription]").text(secondary.LocationDescription);
      $("[data-replace=SecondaryEventAddress]").text(secondary.Address);
      $("[data-replace=EventReceptionUrl]").attr("href", secondary.GoogleMapsUrl);
      $("[data-replace=EventReceptionHourString]").text(secondary.HourString);
    }

    // ─── CAMPOS POR TIPO DE EVENTO ─────────────────────
    if (type === "XV") {
      $("[data-replace=EventName]").text(main.Name);
      $("[data-replace=EventFather]").text(main.Father);
      $("[data-replace=EventMother]").text(main.Mother);
      $("[data-replace=EventGodFather]").text(main.GodFather);
      $("[data-replace=EventGodMother]").text(main.GodMother);
    }

    if (type === "Wedding") {
      $("[data-replace=BrideName]").text(main.BrideName);
      $("[data-replace=GroomName]").text(main.GroomName);
      $("[data-replace=BrideShortName]").text(main.BrideShortName);
      $("[data-replace=GroomShortName]").text(main.GroomShortName);
      $("[data-replace=BrideGroomShortNames]").text(main.BrideShortName + " & " + main.GroomShortName);

      $("[data-replace=FatherBride]").text(main.FatherBride);
      $("[data-replace=MotherBride]").text(main.MotherBride);
      $("[data-replace=FatherGroom]").text(main.FatherGroom);
      $("[data-replace=MotherGroom]").text(main.MotherGroom);
    }

    if (type === "BabyShower") {
      $("[data-replace=EventName]").text(main.Name);
    }

    // ─── AUDIO ─────────────────────────────────────────
    $("[data-replace=AudioUrl]").attr("src", config.AudioUrl);
    $("[data-replace=Image_AudioUrl]").attr("src", Resources.StaticLinks.ImageAudioUrl);

    // ─── STATIC LINKS ──────────────────────────────────
    $("[data-replace=Image_AmazonUrl]").attr("src", Resources.StaticLinks.ImageAmazonUrl);
    $("[data-replace=Image_LiverpoolUrl]").attr("src", Resources.StaticLinks.ImageLiverpoolUrl);
    $("[data-replace=Image_GoogleLocation]").attr("src", Resources.StaticLinks.ImageGoogleLocation);
    $("[data-replace=Image_CodeBar]").attr("src", Resources.StaticLinks.ImageCodeBar);
  },
};

export const rsvp = {
  _sending: false,
  _lastSent: null,

  onGetRSVP: function () {
    if (Resources.RSVP.Enable && Resources.Config.Template) {
      helpers.onLoadRSVP();
      helpers.onLoadSections();
      return;
    }

    if (!Resources.RSVP.Enable) {
      return;
    }

    const pathParts = window.location.pathname.split("/").filter(Boolean);
    let token = "";
    if (Resources.RSVP.Enable && !Resources.Config.Template) {
      if (pathParts.length > 1) {
        token = pathParts[pathParts.length - 1];
      } else {
        const params = new URLSearchParams(window.location.search);
        token = params.get("token") || "";
      }
    }

    if (!token) {
      Resources.Config.Sections.showTableNumber = false;
      Resources.Config.Sections.showTickets = false;
      Resources.Config.Sections.showAttendance = !!Resources.RSVP.WhatsApp;
      Resources.RSVP.GuestName = "";
      Resources.RSVP.TableNumber = 0;
      Resources.RSVP.TicketCount = 0;
      helpers.onLoadRSVP();
      helpers.onLoadSections();
      return;
    }
    // ESTA LÍNEA OCULTA EL "?token=..." DE LA BARRA DE DIRECCIONES SIN BORRAR LA VARIABLE
    // window.history.replaceState({}, document.title, window.location.pathname.replace('/index.html', ''));

    fetch(`/api/sheet?token=${token}&eventID=${Resources.RSVP.EventID}`)
      .then((resp) => {
        if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
        return resp.json();
      })
      .then((data) => {
        if (data.success) {
          Resources.RSVP.GuestName = data.guestName;
          Resources.RSVP.TicketCount = data.ticket;
          Resources.RSVP.TableNumber = data.table;
        } else {
          Resources.Config.Sections.showTableNumber = false;
          Resources.Config.Sections.showTickets = false;
          Resources.Config.Sections.showAttendance = !!Resources.RSVP.WhatsApp;
          Resources.RSVP.GuestName = "";
          Resources.RSVP.TableNumber = 0;
          Resources.RSVP.TicketCount = 0;
        }
        helpers.onLoadRSVP();
        helpers.onLoadSections();
      })
      .catch((err) => {
        console.error("Error:", err);
        Resources.Config.Sections.showTableNumber = false;
        Resources.Config.Sections.showTickets = false;
        Resources.Config.Sections.showAttendance = !!Resources.RSVP.WhatsApp;
        helpers.onLoadSections();
      });
  },

  // Obtiene el token de la URL (solo en invitaciones reales, no en templates)
  _getToken: function () {
    if (Resources.Config.Template) return "";
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    if (pathParts.length > 1) return pathParts[pathParts.length - 1];
    return new URLSearchParams(window.location.search).get("token") || "";
  },

  // Devuelve true si se guardó. Reintenta solo ante errores de red, timeout o 5xx.
  _send: async function (payload, maxAttempts) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000);
      try {
        const resp = await fetch("/api/sheet", {
          method: "POST",
          keepalive: true,
          signal: ctrl.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        clearTimeout(timer);

        // Error del cliente (400, 405...): reintentar no sirve
        if (resp.status >= 400 && resp.status < 500) return false;

        if (resp.ok) {
          const data = await resp.json();
          // Error lógico del Apps Script (token inválido, etc.): no reintentar
          return !!data.success;
        }
        // 5xx: cae al backoff y reintenta
      } catch (err) {
        clearTimeout(timer);
        console.warn(`RSVP intento ${attempt + 1} falló:`, err);
      }

      if (attempt < maxAttempts - 1) {
        await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt)); // 1s, 2s
      }
    }
    return false;
  },

  onPostRSPV: function (confirmation, guestAttendants, wishes) {
    // WhatsApp: sin cambios
    if (Resources.RSVP.WhatsApp) {
      rsvp.onSendWhatsApp(confirmation, guestAttendants, wishes);
      return;
    }

    // Modo template: sin cambios
    if (Resources.RSVP.Enable && Resources.Config.Template) {
      helpers.onToasty(confirmation ? Resources.Messages.Confirmation : Resources.Messages.WillNotAttend);
      return;
    }

    if (!Resources.RSVP.Enable) return;

    // Ya hay un envío en curso: ignorar clics repetidos
    if (rsvp._sending) return;

    const token = rsvp._getToken();
    if (!token) {
      //helpers.onToasty("No encontramos tu invitación. Abre el enlace que te compartieron.", "#c0392b");
      return;
    }

    const payload = {
      token: token,
      eventID: Resources.RSVP.EventID,
      confirmed: confirmation,
      guests: guestAttendants,
      wishes: wishes,
    };

    // Misma respuesta que ya se guardó: no reenviar, solo confirmar de nuevo
    const key = JSON.stringify(payload);
    // if (rsvp._lastSent === key) {
    //   helpers.onToasty(confirmation ? Resources.Messages.Confirmation : Resources.Messages.WillNotAttend);
    //   return;
    // }

    // UI: bloquear botones y mostrar éxito de inmediato
    rsvp._sending = true;
    const $btns = $("#_btnYes, #_btnNo").prop("disabled", true).css("opacity", 0.6);
    helpers.onToasty(confirmation ? Resources.Messages.Confirmation : Resources.Messages.WillNotAttend);

    // Envío en segundo plano con red de seguridad
    rsvp._send(payload, 3).then((ok) => {
      rsvp._sending = false;
      $btns.prop("disabled", false).css("opacity", 1);

      if (ok) {
        rsvp._lastSent = key;
      } else {
        //helpers.onToasty("No pudimos guardar tu respuesta. Por favor inténtalo de nuevo 🙏", "#c0392b");
      }
    });
  },

  onSendWhatsApp: function (confirmation, guestAttendants, wishes) {
    const r = Resources.RSVP;
    const main = Resources.MainEvent;
    const isWedding = Resources.Config.EventType === "Wedding";

    const eventLabel = isWedding ? "la boda de" : "los XV años de";
    const eventName = isWedding ? `${main.BrideShortName} y ${main.GroomShortName}` : main.Name;

    const E = {
      wave: "\u{1F44B}", // 👋
      check: "\u2705", // ✅
      heart: "\u{1F90D}", // 🤍
      user: "\u{1F464}", // 👤
      ticket: "\u{1F39F}\uFE0F", // 🎟️
      chair: "\u{1FA91}", // 🪑
      people: "\u{1F465}", // 👥
      letter: "\u{1F48C}", // 💌
    };

    const lines = [confirmation ? `¡Hola! ${E.wave} Confirmo mi asistencia a ${eventLabel} *${eventName}* ${E.check}` : `¡Hola! ${E.wave} Lamentablemente no podré asistir a ${eventLabel} *${eventName}* ${E.heart}`, ""];

    if (r.GuestName) lines.push(`${E.user} *Invitado:* ${r.GuestName}`);
    if (confirmation && r.TicketCount > 0) lines.push(`${E.ticket} *Pases:* ${r.TicketCount}`);
    if (confirmation && r.TableNumber > 0) lines.push(`${E.chair} *Mesa:* ${r.TableNumber}`);
    if (confirmation && guestAttendants && guestAttendants.trim()) lines.push(`${E.people} *Acompañantes:* ${guestAttendants.trim()}`);
    if (wishes && wishes.trim()) lines.push(`${E.letter} *Mensaje:* ${wishes.trim()}`);

    const url = `https://api.whatsapp.com/send?phone=${r.WhatsAppNumber}&text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");

    helpers.onToasty(confirmation ? Resources.Messages.Confirmation : Resources.Messages.WillNotAttend);
  },
};

$.fn.extend({
  OnAudioPlayerClick: function ($audioButton) {
    var audio = this[0];
    if (audio.paused) {
      var playPromise = audio.play();

      // Evita el error silencioso que congela el hilo
      if (playPromise !== undefined) {
        playPromise.catch(function (err) {
          console.warn("Audio bloqueado por el navegador:", err);
          $audioButton.addClass("off");
        });
      }
      $audioButton.removeClass("off");
    } else {
      audio.pause();
      $audioButton.addClass("off");
    }
  },
});
