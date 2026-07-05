
// XV
const mainEvent = {
  Date: new Date("2026-10-17T13:00:00"),
  Name: "Nicole Gutiérrez",

  LocationDescription: "Catedral de Guadalajara",
  Address: "Av. Fray Antonio Alcalde 10, Guadalajara, Jal.",
  GoogleMapsUrl: "https://maps.app.goo.gl/...",

  Father: "José Gutiérrez",
  Mother: "Melissa Hurtado",
  GodFather: "Juan Fernández",
  GodMother: "Laura Jimenez",

  Gallery: ["url1", "url2", "url3", "url4"],

  AmazonGiftTableUrl: "https://www.amazon.com.mx/",
  LiverpoolGiftTableUrl: "https://www.liverpool.com.mx/",
};

const secondaryEvent = {
  Date: new Date("2026-10-17T17:00:00"),
  LocationDescription: "La Terraza Clouthier",
  Address: "Av Manuel J. Clouthier 480, Zapopan, Jal.",
  GoogleMapsUrl: "https://maps.app.goo.gl/...",
};

const Init = {
  Config: {
    EventType: "XV",
    Sections: {
      showCounter      : true,
      showIntroduction : true,
      showParents      : true,
      showItinerary    : true,
      showGallery      : true,
      showDressCode    : true,
      showTickets      : true,
      showTableNumber  : true,
      showAttendance   : true,
      showGiftTable    : true,
    },
    Themes: [],
    AudioUrl: "../music/cancion.mp3",
  },
  MainEvent: mainEvent,
  SecondaryEvent: secondaryEvent,
};

// WEDDING
const mainEvent = {
  Date: new Date("2026-10-17T13:00:00"),
  BrideName     : "Jacqueline Esquivias",
  GroomName     : "Jesús Ramírez",
  BrideShortName: "Jacqueline",
  GroomShortName: "Jesús",

  LocationDescription: "Catedral de Guadalajara",
  Address            : "Av. Fray Antonio Alcalde 10, Guadalajara, Jal.",
  GoogleMapsUrl      : "https://maps.app.goo.gl/...",

  FatherBride: "Gerardo González Navarro",
  MotherBride: "Sirina Esquivias Esquivias",
  FatherGroom: "J. Refugio Ramírez González",
  MotherGroom: "Sara Ávila García",

  Gallery: ["url1", "url2", "url3", "url4"],

  AmazonGiftTableUrl   : "https://www.amazon.com.mx/",
  LiverpoolGiftTableUrl: "https://www.liverpool.com.mx/",
};

const secondaryEvent = {
  Date               : new Date("2026-10-17T17:00:00"),
  LocationDescription: "La Terraza Clouthier",
  Address            : "Av Manuel J. Clouthier 480, Zapopan, Jal.",
  GoogleMapsUrl      : "https://maps.app.goo.gl/...",
};

const Init = {
  Config: {
    EventType: "Wedding",
    Sections: {
      showCounter      : true,
      showIntroduction : true,  // mensaje de los novios
      showParents      : true,
      showItinerary    : true,
      showGallery      : true,
      showLoveStory    : true,
      showVideo        : true,
      showDressCode    : true,
      showTickets      : true,
      showTableNumber  : true,
      showAttendance   : true,
      showGiftTable    : true,
    },
    Themes: [],
    AudioUrl: "../music/cancion.mp3",
  },
  MainEvent: mainEvent,
  SecondaryEvent: secondaryEvent,
};

// BABYSHOWER
const mainEvent = {
  Date: new Date("2026-10-17T13:00:00"),
  Name: "Thomas",

  LocationDescription: "La Terraza Clouthier",
  Address            : "Av Manuel J. Clouthier 480, Zapopan, Jal.",
  GoogleMapsUrl      : "https://maps.app.goo.gl/...",

  Gallery: ["url1", "url2", "url3", "url4"],

  AmazonGiftTableUrl   : "https://www.amazon.com.mx/",
  LiverpoolGiftTableUrl: "https://www.liverpool.com.mx/",
};

const Init = {
  Config: {
    EventType: "BabyShower",
    Sections: {
      showCounter   : true,
      showItinerary : true,
      showGallery   : true,
      showAttendance: true,
      showGiftTable : true,
    },
    Themes: [],
    AudioUrl: "../music/cancion.mp3",
  },
  MainEvent: mainEvent,
};
function DisplaySections(){
    $.each(Init.Config.Sections, function(sectionName, isVisible) {
        if (!isVisible) {
            $(`[data-section="${sectionName}"]`).hide();
        } else {
            $(`[data-section="${sectionName}"]`).show();
        }
    });
}