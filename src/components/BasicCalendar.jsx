import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, parseISO } from "date-fns";
import { sv } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/BasicCalendar.css";

const locales = {
  "sv-SE": sv,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const availabilities = [
  {
    start: parseISO("2025-01-17T10:00:00"),
    end: parseISO("2025-01-17T11:00:00"),
    title: "Test1",
  },
  {
    start: parseISO("2025-01-16T09:00:00"),
    end: parseISO("2025-01-16T10:00:00"),
    title: "Test2",
  },
];
// get todays date dynamically to use in the calendar
const today = new Date();

export const MyCalendar = (props) => (
  <div className="calendars">
    <Calendar
      localizer={localizer}
      events={availabilities}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      /**  set the default view to week */
      defaultView="week"
      /**
       * disables the agenda option by exluding it, since we dont need it,
       * maybe month is redundant too?*/
      views={["week", "day", "month"]}
      /** dynamic restriction that only shows 08:00 to 17:00
       * min decides start time an max decides last time of the day
       */
      min={
        new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0)
      }
      max={
        new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0)
      }
      /**  */
      formats={{
        /** timegutterFormat is how the time is displayed on the column on
         * the left side in the calendar */
        timeGutterFormat: "HH:mm",
        /** this defines how the time format is shown within the calendar */
        eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
          `${localizer.format(start, "HH:mm", culture)} - ${localizer.format(
            end,
            "HH:mm",
            culture
          )}`,
      }}
    />
  </div>
);
