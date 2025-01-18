//avkommentera denna import när det är dags för att göra en redirect efter availabilities är satt!
//import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, parseISO } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/BasicCalendar.css";
import { sv } from "date-fns/locale";

const AvailabilityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const LogoContainer = styled.img`
  height: 20rem;
`;

const Title = styled.h2`
  font-size: 22px;
`;

const Text = styled.p`
  font-size: 18px;
`;

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

function AvailabilityManager() {
  const {
    authState: { user, id },
  } = useAuth();
  const [users, setUsers] = useState([]);

  /** here is the calendar component nested inside this component
   * to avoid complex prop handling since it wont get used outside of this component!
   */
  const AvailabilityCalendar = () => {
    /** existing availabilities */
    const [availabilities, setAvailabilities] = useState([]);
    /** this will enable to toggle from existing availabilities to edit Availabilities */
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
      const getAllAvailabilities = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/availability/findbyid?caregiverId=` + id,

            {
              withCredentials: true,
              // using withCredentials is crutial for and request that needs to check authorization!
            }
          );
          const data = response.data;
          const parseAvailabilityData = data
            .map((availability) => {
              return availability.availableSlots.map((slot, index) => {
                const start = new Date(slot);
                const end = availability.availableSlots[index + 1]
                  ? new Date(availability.availableSlots[index + 1])
                  : new Date(start.getTime() + 60 * 60 * 1000);
                return {
                  start,
                  end,
                  title: `Available Slot ${index + 1}`,
                };
              });
            })
            .flat();
          setAvailabilities(parseAvailabilityData);
        } catch (error) {
          console.error("Unavailable to fetch availabilities:", error);
        }
      };

      getAllAvailabilities();
    }, []);

    const handleSlotSelect = ({ start }) => {
      if (!editMode || !user.isAuthenticated) return;
      /*sets end time to 60min after start time */
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      const newAvailability = { start, end, title: "Available Appointment" };
      setAvailabilities((prev) => [...prev, newAvailability]);

      try {
        axios.post(`http://localhost:8080/availability`, data, {
          withCredentials: true,
        });
        alert("Availability created!");
      } catch (error) {
        console.error("Error creating post:", error);
      }

      /* send to backend */
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

    const handleEventSelect = (event) => {
      if (!editMode) return;

      if (window.confirm(`Delete availability for: ${event.start}?`)) {
        /* remove slot from UI */
        setAvailabilities((prev) => prev.filter((e) => e !== event));

        /* send delete request to backend*/
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
            new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              8,
              0
            )
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
              `${localizer.format(
                start,
                "HH:mm",
                culture
              )} - ${localizer.format(end, "HH:mm", culture)}`,
          }}
        />
      </div>
    );
  };

  return (
    <AvailabilityContainer>
      <LogoContainer src={Logo} />
      <Title>Availability Dashboard</Title>
      <Text>Welcome {user}</Text>
      <AvailabilityCalendar />
    </AvailabilityContainer>
  );
}

export default AvailabilityManager;
