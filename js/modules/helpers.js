//@ts-check

//@ts-ignore
define(["jquery", "extended"], function ($) {
  
  const staticLinks = {
    ImageAudioUrl: "../images/audio.png",
    ImageAmazonUrl: "../images/amazon.png",
    ImageLiverpoolUrl: "../images/liverpool.jpeg",
    ImageGoogleLocation: "https://img.icons8.com/?size=512&id=DcygmpZqBEd9&format=png",
    IconChurch: "https://cdn-icons-png.flaticon.com/128/4186/4186011.png",
    IconReception: "https://cdn-icons-png.flaticon.com/128/887/887345.png",
    IconPhotSession: "https://cdn-icons-png.flaticon.com/128/3004/3004613.png",
    IconFeast: "https://cdn-icons-png.flaticon.com/128/4156/4156252.png",
    IconVals: "https://cdn-icons-png.flaticon.com/128/1483/1483389.png",
    IconSuit: "https://cdn-icons-png.flaticon.com/128/389/389573.png",
    IconDress: "https://cdn-icons-png.flaticon.com/128/3507/3507059.png"
  }

  var Resources = {
    MainEvent : {},
    SecondaryEvent: {},
    GoogleCalendar: {},
    AdditionalInformation : {},
    StaticLinks: staticLinks
  };
  var module = {
    init: function (resources) {
      Resources.MainEvent = resources.MainEvent;
      Resources.MainEvent.Time =  Resources.MainEvent.Date.getTime();
      Resources.MainEvent.DateString =  module.onGetDateString(Resources.MainEvent.Date);
      Resources.MainEvent.HourString =  module.onGetHoursString(Resources.MainEvent.Date);
      Resources.MainEvent.WeekDay =  module.onGetWeekDay(Resources.MainEvent.Date);
      Resources.MainEvent.Day =  module.onGetDay(Resources.MainEvent.Date);
      Resources.MainEvent.Month =  module.onGetMonth(Resources.MainEvent.Date);
      Resources.MainEvent.Year =  module.onGetYear(Resources.MainEvent.Date);
      Resources.MainEvent.YYYYMMDD =  module.onGetDateYYYYMMDD(Resources.MainEvent.Date);
      Resources.MainEvent.RandomCollageImage= 0;

      Resources.SecondaryEvent = resources.SecondaryEvent;
      Resources.SecondaryEvent.Time= Resources.SecondaryEvent.Date.getTime();
      Resources.SecondaryEvent.DateString= module.onGetDateString(Resources.SecondaryEvent.Date);
      Resources.SecondaryEvent.HourString= module.onGetHoursString(Resources.SecondaryEvent.Date);
      Resources.SecondaryEvent.WeekDay= module.onGetWeekDay(Resources.SecondaryEvent.Date);
      Resources.SecondaryEvent.Day= module.onGetDay(Resources.SecondaryEvent.Date);
      Resources.SecondaryEvent.Month= module.onGetMonth(Resources.SecondaryEvent.Date);
      Resources.SecondaryEvent.Year= module.onGetYear(Resources.SecondaryEvent.Date);
      Resources.SecondaryEvent.YYYYMMDD= module.onGetDateYYYYMMDD(Resources.SecondaryEvent.Date);

      Resources.GoogleCalendar = resources.GoogleCalendar;
      Resources.AdditionalInformation = resources.AdditionalInformation;
      module.onLoad();
    },
    onGetResources:function(){
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
      const day = module.onGetDay(eventDate);
      const dayName = module.onGetWeekDay(eventDate);
      const month = module.onGetMonth(eventDate);
      const year = module.onGetYear(eventDate);
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
      const calendarDate = module.onGetDateYYYYMMDD(Resources.MainEvent.Date);
      const title = Resources.MainEvent.Description + " " + Resources.MainEvent.Name;
      const location = Resources.MainEvent.LocationDescription;
      const hour = Resources.MainEvent.HourString;

      googleCalendar.Detail = googleCalendar.Detail.replace("[0]", title);
      googleCalendar.Detail = googleCalendar.Detail.replace("[1]", location);
      googleCalendar.Detail = googleCalendar.Detail.replace("[2]", hour);

      const params = new URLSearchParams({
        action: "TEMPLATE",
        text: googleCalendar.Text,
        dates: `${calendarDate}/${calendarDate}`,
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
    onMoveElementFromArray: function(array, oldIndex, newIndex){
      if (newIndex >= array.length) {
        newIndex = array.length - 1;
      } else if (newIndex < 0) {
        newIndex = 0
      }
      array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
      return array;
    },
    onLoad: function () {
      Resources.MainEvent.RandomCollageImage = Math.floor(Math.random() * Resources.MainEvent.CollageImages.length);
      Resources.MainEvent.CollageImages = module.onMoveElementFromArray(Resources.MainEvent.CollageImages, Resources.MainEvent.RandomCollageImage, 3 );
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

      $("[data-replace=MainEventUrl]").attr("href", Resources.MainEvent.GoogleMapsUrl);
      $("[data-replace=MainEventHourString]").text(Resources.MainEvent.HourString);
      $("[data-replace=MainEventDay]").text(Resources.MainEvent.Day);
      $("[data-replace=MainEventWeekDay]").text(Resources.MainEvent.WeekDay);
      $("[data-replace=MainEventMonth]").text(Resources.MainEvent.Month);
      $("[data-replace=MainEventYear]").text(Resources.MainEvent.Year);

      $("[data-replace=MainEventLocationDescription]").text(Resources.MainEvent.LocationDescription);
      $("[data-replace=MainEventAddress]").text(Resources.MainEvent.Address);

      //Secondary Event
      $("[data-replace=EventReceptionHourString]").text(Resources.SecondaryEvent.HourString);
      $("[data-replace=EventReceptionUrl]").attr("href", Resources.SecondaryEvent.GoogleMapsUrl);
      $("[data-replace=SecondaryEventLocationDescription]").text(Resources.SecondaryEvent.LocationDescription);
      $("[data-replace=SecondaryEventAddress]").text(Resources.SecondaryEvent.Address);

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
      $("[data-replace=ActivityIconChurch]").attr("src", Resources.StaticLinks.IconChurch);
      $("[data-replace=ActivityIconReception]").attr("src", Resources.StaticLinks.IconReception);
      $("[data-replace=ActivityIconPhotSession]").attr("src", Resources.StaticLinks.IconPhotSession);
      $("[data-replace=ActivityIconFeast]").attr("src", Resources.StaticLinks.IconFeast);
      $("[data-replace=ActivityIconVals]").attr("src", Resources.StaticLinks.IconVals);
      $("[data-replace=ActivityIconSuit]").attr("src", Resources.StaticLinks.IconSuit);
      $("[data-replace=ActivityIconDress]").attr("src", Resources.StaticLinks.IconDress);
    },
  };
  return module;
});
