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
  const [selectedSlots, setSelectedSlots] = useState([]);

  // this will enable to toggle from existing availabilities to edit Availabilities
  const [editMode, setEditMode] = useState(false);

  // calback function to toggle the state of editMode when called ()
  const handleToggleEditMode = () => {
    setEditMode((prevMode) => !prevMode);
  };

  /** here is the calendar component nested inside this component
   * to avoid complex prop handling since it wont get used outside of this component!
   */
  const AvailabilityCalendar = () => {
    // existing availabilities
    const [availabilities, setAvailabilities] = useState([]);

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
                const start = new Date(
                  new Date(slot).getTime() + 60 * 60 * 1000
                );
                const end = availability.availableSlots[index + 1]
                  ? new Date(
                      new Date(
                        availability.availableSlots[index + 1]
                      ).getTime() +
                        60 * 60 * 1000
                    )
                  : new Date(start.getTime() + 60 * 60 * 1000);
                /*   const start = new Date(slot);
                const end = availability.availableSlots[index + 1]
                  ? new Date(availability.availableSlots[index + 1])
                  : new Date(start.getTime() + 60 * 60 * 1000); */
                return {
                  start,
                  end,
                  title: `Available`,
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

    /** SAVES SELECTED SLOT IN DATABASE
     * needs to look into selecting multiple slots before saving
     * slot saves -2hrs from selected time in DB and when fetched
     * it only sets +1hr like we got from Postman.
     * NEEDS CORRECTION!
     */

    const handleAvailabilitySlotSelect = ({ start }) => {
      // Set end time to 60 minutes after the start time
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      // Create a new slot
      const newSlot = {
        start,
        end,
        title: "Available", // You can customize the title if necessary
      };

      // Update the UI state with the new slot (add to availabilities)
      setSelectedSlots((prev) => [...prev, newSlot]);
      setAvailabilities((prev) => [...prev, newSlot]);
    };

    /* const handleAvailabilitySlotSelect = ({ start }) => {
      sets end time to 60min after start time 
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      const newSlot = start.toISOString();
      setSelectedSlots((prev) => [...prev, newSlot]);

      console.log("[SELECTEDSLOTS]:", selectedSlots);

      const newAvailability = { start, end, title: "Available" };
      setAvailabilities((prev) => [...prev, newAvailability]);
    }; */

    /**
     * OBS THIS NEEDS TO BE FIXED ALONGSIDE THE BACKEND SERVICE!! INPUTS IN BACKEND IS OFF AND NOT
     * APLICABLE ON HOW OUR AVAILABILITY MANAGMENT IN FRONTEND IS INTENDED TO WORK!!
     */

    return (
      <div className="calendars">
        <Calendar
          localizer={localizer}
          events={availabilities}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 550 }}
          //set the default view to week
          defaultView="week"
          /* disables the agenda option by exluding it, since we dont need it,
          maybe month is redundant too?*/
          views={["week", "day", "month"]}
          /* dynamic restriction that only shows 08:00 to 17:00
          min decides start time an max decides last time of the day */
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
          formats={{
            /* timegutterFormat is how the time is displayed on the column on
             the left side in the calendar */
            timeGutterFormat: "HH:mm",
            /* this defines how the time format is shown within the calendar 
             so we dont get AM and PM */
            eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
              `${localizer.format(
                start,
                "HH:mm",
                culture
              )} - ${localizer.format(end, "HH:mm", culture)}`,
          }}
          dayPropGetter={(date) => {
            // hide Saturdays (6) and Sundays (0) to only show mon -> fri
            if (date.getDay() === 0 || date.getDay() === 6) {
              return {
                style: { display: "none" }, // Hide weekends
              };
            }
          }}
          // restricts duration of each slot to 60min
          step={60}
          // this gives only one slot per hour
          timeslots={1}
          selectable={editMode}
          onSelectSlot={handleAvailabilitySlotSelect}
          //onSelectEvent={handleEventSelect}
        />
      </div>
    );
  };

  const handleSaveAvailabilitySlots = async () => {
    if (selectedSlots.length === 0) {
      alert("Please select at least one slot.");
      return;
    }
    const data = {
      caregiverId: id,
      availableSlots: selectedSlots,
    };

    try {
      await axios.post(`http://localhost:8080/availability`, data, {
        withCredentials: true,
      });
      alert("Successfully Saved!");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <AvailabilityContainer>
      <LogoContainer src={Logo} />
      <Title>Availability Dashboard</Title>
      <Text>Welcome {user}</Text>
      {/* <button onClick={handleSaveAvailabilitySlots}>Save Selected Slots</button> */}

      <button onClick={handleToggleEditMode}>
        {editMode ? "View Availabilities" : "Edit Availabilities"}
      </button>
      <AvailabilityCalendar />
    </AvailabilityContainer>
  );
}

export default AvailabilityManager;

/*  const handleEventSelect = async (event) => {
      if (!editMode) return; // Ensure editing is enabled
      const data = { caregiverId: id, timeSlot: event.start.toISOString() };

      if (window.confirm(`Delete availability for: ${event.start}?`)) {
        // Remove slot from UI
        setAvailabilities((prev) => prev.filter((e) => e !== event));

        try {
          // Send delete request to backend using axios
          const response = await axios.delete(
            `http://localhost:8080/availabilities/delete/timeslot`,
            {
              data, // Axios allows you to pass the body of a DELETE request via the `data` field
              withCredentials: true, // Include credentials for authorization
            }
          );
          console.log("Availability slot deleted successfully:", response.data);
        } catch (error) {
          console.error("Unable to delete availability slot:", error);
          // Optionally, you could re-add the removed availability in case of an error
          setAvailabilities((prev) => [...prev, event]);
        }
      }
    }; */
