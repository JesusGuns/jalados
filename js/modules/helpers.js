var Resources = {
  Config: {
    EventType: "",
    Template: true,
    ImagesURL: "",
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
    const the = hours > 1 ? "las " : "la";
    hours = hours % 12 || 12;
    const hourString = includeThe ? `${the} ${hours}:${mins} ${ampm}` : `${hours}:${mins} ${ampm}`;
    return hourString;
  },
  onGetDateYYYYMMDD: function (eventDate) {
    const format = (f) => f.toISOString().split("T")[0].replace(/-/g, "");
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
    const $countdown = $("#countdown"); // contenedor del contador

    const intervalId = setInterval(() => {
      const distance = eventDate - new Date().getTime();

      if (distance < 0) {
        clearInterval(intervalId);
        $days.text("00");
        $hours.text("00");
        $minutes.text("00");
        $seconds.text("00");
        return; // ← sale del tick, no actualiza los números
      }

      $days.text(helpers.onAddZeroToNumber(Math.floor(distance / 86400000)));
      $hours.text(helpers.onAddZeroToNumber(Math.floor((distance % 86400000) / 3600000)));
      $minutes.text(helpers.onAddZeroToNumber(Math.floor((distance % 3600000) / 60000)));
      $seconds.text(helpers.onAddZeroToNumber(Math.floor((distance % 60000) / 1000)));
    }, 1000);

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
      Resources.Config.Sections.showAttendance = false;
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
          Resources.Config.Sections.showAttendance = false;
          Resources.RSVP.GuestName = "";
          Resources.RSVP.TableNumber = 0;
          Resources.RSVP.TicketCount = 0;
        }
        helpers.onLoadRSVP();
        helpers.onLoadSections();
      })
      .catch((err) => console.error("Error:", err));
  },
  onPostRSPV: function (confirmation, guestAttendants, wishes) {
    if (Resources.RSVP.Enable && Resources.Config.Template) {
      if (confirmation) {
        helpers.onToasty(Resources.Messages.Confirmation);
      } else {
        helpers.onToasty(Resources.Messages.WillNotAttend);
      }
      return;
    }

    if (!Resources.RSVP.Enable) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || "";
    if (!token) return;

    fetch(`/api/sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        eventID: Resources.RSVP.EventID,
        confirmed: confirmation,
        guests: guestAttendants,
        wishes: wishes,
      }),
    })
      .then((resp) => {
        if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
        return resp.json();
      })
      .then((data) => {
        if (data.success) {
          if (confirmation) {
            helpers.onToasty(Resources.Messages.Confirmation);
          } else {
            helpers.onToasty(Resources.Messages.WillNotAttend);
          }
        }
      })
      .catch((err) => console.error("Error:", err));
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
