const Common = {
    onGetWeekDay: function(eventDate) {
        const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const dayOfWeek = eventDate.getDay();
        const dayName = days[dayOfWeek];
        return dayName;
    },
    onGetDay: function(eventDate) {
        return eventDate.getDate();
    },
    onGetMonth: function(eventDate) {
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const month = months[eventDate.getMonth()];
        return month;
    },
    onGetYear: function(eventDate) {
        return eventDate.getFullYear();
    },
    onGetDateYYYYMMDD: function(eventDate) {
        const format = (f) => f.toISOString().split("T")[0].replace(/-/g, "");
        return format(eventDate);
    },
    onGetDateString: function(includeDayName) {
        const day = helpers.onGetDay();
        const dayName = helpers.onGetWeekDay();
        const month = helpers.onGetMonth();
        const year = helpers.onGetYear();
        const dateString = includeDayName ? `${dayName} ${day} de ${month} de ${year}` : `${day} de ${month} de ${year}`;
        return dateString;
    },
    onGetHoursString: function(eventDate, includeThe) {
        let hours = eventDate.getHours();
        const ampm = hours >= 12 ? "p.m." : "a.m.";
        const mins = eventDate.getMinutes().toString().padStart(2, "0");
        const the = hours > 1 ? "las " : "la";
        hours = hours % 12 || 12;
        const hourString = includeThe ? `${the} ${hours}:${mins} ${ampm}` : `${hours}:${mins} ${ampm}`;
        return hourString;
    },
    onAddZeroToNumber: function(number) {
        if (number.toString().length == 1) {
            return "0" + number.toString();
        }
        return number;
    }
};

const GoogleCalendar = {
    onCreateTemplate: function(calendarTemplate){
        const URLbase = 'https://calendar.google.com/calendar/render';
        const googleDate = Common.onGetDateYYYYMMDD(calendarTemplate.Event_MainDate);

        const details = `
            ${calendarTemplate.Event_CalendarDescription}.
        📍 Lugar: ${calendarTemplate.Event_MainAddress}
        🕒 Hora: ${calendarTemplate.Event_HoursString}
        ⏰ Recordatorio: Llega con 30 minutos de anticipación.
        ✨ ¡Te esperamos para compartir este momento tan especial!
        `;
        const params = new URLSearchParams({
            action: "TEMPLATE",
            text: calendarTemplate.Event_CalendarTitle,
            dates: `${googleDate}/${googleDate}`,
            details: details,
            location: calendarTemplate.Event_MainAddress
          });
          return `${URLbase}?${params.toString()}`;
    }
}

const Template = {
    Event_FullName: "",
    Event_OnlyName: "",
    Event_Father: "",
    Event_Mother: "",

};

const CommonTemplate= {
    onCreateTemplate: function(_mainEventDate, _secondayEventDate){
        const Event = {
            MainEvent: {
                Date : _mainEventDate,
                DateString: Common.onGetDateString(_mainEventDate),
                HoursStirng: Common.onGetHoursString(_mainEventDate),
                WeekDay: Common.onGetWeekDay(_mainEventDate),
                Day: Common.onGetDay(_mainEventDate),
                Month: Common.onGetMonth(_mainEventDate),
                Year: Common.onGetYear(_mainEventDate),
                YYYYMMDD: Common.onGetDateYYYYMMDD(_mainEventDate),
            },
            SecondaryEvent: {
                Date : _secondayEventDate,
                DateString: Common.onGetDateString(_secondayEventDate),
                HoursStirng: Common.onGetHoursString(_secondayEventDate),
                WeekDay: Common.onGetWeekDay(_secondayEventDate),
                Day: Common.onGetDay(_secondayEventDate),
                Month: Common.onGetMonth(_secondayEventDate),
                Year: Common.onGetYear(_secondayEventDate),
                YYYYMMDD: Common.onGetDateYYYYMMDD(_secondayEventDate),
            },
        }
        return Event;
    }
}