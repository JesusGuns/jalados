//@ts-check

//@ts-ignore
define(["jquery", "extended"], function ($) {
  var Resources;
  var module = {
    init: function (resources) {
      console.log("initt");
      Resources = resources;
      console.log(Resources);
      module.onLoad();
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
      const day = module.onGetDay(eventDate);
      const dayName = module.onGetWeekDay(eventDate);
      const month = module.onGetMonth(eventDate);
      const year = module.onGetYear(eventDate);
      const dateString = includeDayName ? `${dayName} ${day} de ${month} del ${year}` : `${day} de ${month} del ${year}`;
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
      const now = new Date().getTime();
      const distance = eventDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      $("#days").text(module.onAddZeroToNumber(days));
      $("#hours").text(module.onAddZeroToNumber(hours));
      $("#minutes").text(module.onAddZeroToNumber(minutes));
      $("#seconds").text(module.onAddZeroToNumber(seconds));
      if (distance < 0) {
        //@ts-ignore
        clearInterval(interval);
        $("countdown").innerHTML = "¡Ha llegado el gran día!";
      }
    },
    onGoogleCalendar: function (googleCalendar) {
      const base = "https://calendar.google.com/calendar/render";
      const params = new URLSearchParams({
        action: "TEMPLATE",
        text: googleCalendar.Text,
        dates: `${googleCalendar.StartDate}/${googleCalendar.EndDate}`,
        details: googleCalendar.Detail,
        location: googleCalendar.Location,
      });
      return `${base}?${params.toString()}`;
    },
    onAudioPlayer: function () {
      var $audioButton = $("#audioButton");
      $audioButton.on("click", function () {
        $("#audio").OnAudioPlayerClick($audioButton);
      });
    },
    onLoad: function () {
      //Main Event
      $("[data-replace=EventDateString]").text(Resources.MainEvent.DateString);
      $("[data-replace=EventHourString]").text(Resources.MainEvent.HourString);
      $("[data-replace=EventName]").text(Resources.MainEvent.Name);
      $("[data-replace=EventFather]").text(Resources.MainEvent.Father);
      $("[data-replace=EventMother]").text(Resources.MainEvent.Mother);
      $("[data-replace=EventGodFather]").text(Resources.MainEvent.GodFather);
      $("[data-replace=EventGodMother]").text(Resources.MainEvent.GodMother);
      $("[data-replace=EventChurchUrl]").attr("href", Resources.MainEvent.GoogleMapsUrl);
      $("[data-replace=Image_MyParents]").attr("src", Resources.MainEvent.ImageMyParents);
      $("[data-replace=Image_MyGodParents]").attr("src", Resources.MainEvent.ImageMyGodParents);
      $("[data-replace=Image_DressCodeUrl]").attr("src", Resources.MainEvent.ImageDressCodeUrl);
      $("[data-replace=EventAmazonGiftTableUrl]").attr("href", Resources.MainEvent.AmazonGiftTableUrl);
      $("[data-replace=EventLiverpoolGiftTableUrl]").attr("href", Resources.MainEvent.LiverpoolGiftTableUrl);

      //Secondary Event
      $("[data-replace=EventReceptionHourString]").text(Resources.SecondaryEvent.HourString);
      $("[data-replace=EventReceptionUrl]").attr("href", Resources.SecondaryEvent.GoogleMapsUrl);

      //Google calendar
      $("[data-replace=GoogleCalendarUrl]").attr("href", module.onGoogleCalendar(Resources.GoogleCalendar));

      //Additional info
      $("[data-replace=AudioUrl]").attr("src", Resources.AdditionalInformation.AudioUrl);
      $("[data-replace=Image_FrontCard]").attr("src", Resources.AdditionalInformation.ImageFrontCard);
      $("[data-replace=WhatsAppUrl]").attr("href", Resources.AdditionalInformation.WhatsAppUrl);

      //static links
      $("[data-replace=Image_AudioUrl]").attr("src", Resources.StaticLinks.ImageAudioUrl);
      $("[data-replace=Image_AmazonUrl]").attr("src", Resources.StaticLinks.ImageAmazonUrl);
      $("[data-replace=Image_LiverpoolUrl]").attr("src", Resources.StaticLinks.ImageLiverpoolUrl);
      $("[data-replace=Image_GoogleLocation]").attr("src", Resources.StaticLinks.ImageGoogleLocation);
    },
  };
  return module;
});
