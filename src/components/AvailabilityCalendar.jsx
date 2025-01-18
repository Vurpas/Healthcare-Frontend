import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
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

// get todays date dynamically to use in the calendar
const today = new Date();

export const AvailabilityCalendar = () => {
  /** retrieve username and user id */
  const {
    authState: { user, id, isAuthenticated, role },
  } = useAuth();
  const [users, setUsers] = useState([]);

  /** existing availabilities */
  const [availabilities, setAvailabilities] = useState([]);
  /** this will enable to toggle from existing availabilities to edit Availabilities */
  const [editMode, setEditMode] = useState(false);

  //console.log("[USER ID]:"id);

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

/**
 * useEffect(() => {
    fetch(
      `http://localhost:8080/availability/findbyid?caregiverId=` + user.id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        /map the data to show as events in the calendar /
        const parseAvailabilityData = data
          .map((availability) => {
            return availability.availableSlots.map((slot, index) => {
              const start = new Date(slot);
              const end = availability.availableSlots[index + 1]
                ? new Date(availability.availableSlots[index + 1])
                : / default to one hour if there is no next slot /
                  new Date(start.getTime() + 60 + 60 * 1000);
              return {
                start,
                end,
                title: `Available Slot ${index + 1}`,
              };
            });
          })
          .flat();

        / set parsed availabilities in state /
        setAvailabilities(parseAvailabilityData);
      })

      .catch((error) => {
        console.error("Error fetching availabilities:", error);
      });
  }, []);

  const handleSlotSelect = ({ start }) => {
    if (!editMode || !user.isAuthenticated) return;
    /sets end time to 60min after start time /
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const newAvailability = { start, end, title: "Available Appointment" };
    setAvailabilities((prev) => [...prev, newAvailability]);

    / send to backend /
    fetch("http://localhost:8080/availabilities/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      Authorization: `Bearer ${authState.token}`,
      credentials: "include",
      body: JSON.stringify({
        caregiverId: authState.id,
        availableSlots: [start.toISOString()],
      }),
    }).catch((error) =>
      console.error("Not able to create availability:", error)
    );
  }; 
  //console.log("[CREDENTIALS]:", authState);
  const handleEventSelect = (event) => {
    if (!editMode) return;

    if (window.confirm(`Delete availability for: ${event.start}?`)) {
      // remove slot from UI
      setAvailabilities((prev) => prev.filter((e) => e !== event));

      // send delete request to backend
      fetch(`http://localhost:8080/availabilities/delete/timeslot`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          caregiverId: authState.id,
          timeSlot: event.start.toISOString(),
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete availability slot!");
          }
          return response.json();
        })
        .then(() => {
          console.log("Availability slot deleted successfully!");
        })
        .catch((error) =>
          console.error("Unable to delete availability slot:", error)
        );
    }
  };

  return (
    <div className="calendars">
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? "Wiev Availabilities" : "Edit Availabilities"}{" "}
      </button>
      <Calendar
        localizer={localizer}
        events={availabilities}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 550 }}
        selectable={editMode}
        onSelectSlot={handleSlotSelect}
        onSelectEvent={handleEventSelect}
        /  set the default view to week /
        defaultView="week"
        /
          disables the agenda option by exluding it, since we dont need it,
          maybe month is redundant too?/
        views={["week", "day", "month"]}
        / restricts slots by the full hour and not ex 8.30 etc /
        step={60}
        / only allows one timeslot per hour /
        timeslots={1}
        / dynamic restriction that only shows 08:00 to 17:00
          min decides start time an max decides last time of the day
         /
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
      
        formats={{
          / timegutterFormat is how the time is displayed on the column on
            the left side in the calendar /
          timeGutterFormat: "HH:mm",
          / this defines how the time format is shown within the calendar /
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
 */
