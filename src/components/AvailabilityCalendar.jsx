import { useEffect, use } from "react";
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

const AvailabilityCalendar = () => {
  const [availabilities, setAvailabilities] = useState([]);

  // fetch availabilities from backend
  // should be refactored to get all availabilities by id!!

  useEffect(() => {
    fetch("http://localhost:8080/availabilities/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        /** map the data to show as events in the calendar */
        const parseAvailabilityData = data
          .map((availability) => {
            return availability.availableSlots.map((slot, index) => {
              const start = new Date(slot.$date.$numberLong);
              const end = availability.availableSlots[index + 1]
                ? new Date(
                    availability.availableSlots[index + 1].$date.$numberLong
                  )
                : /** default to one hour if there is no next slot */
                  new Date(start.getTime() + 60 + 60 * 1000);
              return {
                start,
                end,
                title: `Available Slot ${index + 1}`,
              };
            });
          })
          .flat();

        /** set parsed availabilities in state */
        setAvailabilities(parseAvailabilityData);
      })

      .catch((error) => {
        console.error("Error fetching availabilities:", error);
      });

    /** remount if user Id changes */
  }, [id]);

  return (
    <div className="calendars">
      <Calendar
        localizer={localizer}
        events={availabilities}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 550 }}
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
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            17,
            0
          )
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
};

export default AvailabilityCalendar;
