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
import { sv } from "date-fns/locale";

const AvailabilityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const CalendarContainer = styled.div`
  width: 90%; /* Adjust width to make it responsive */
  max-width: 1200px; /* Optional max-width for larger screens */
  margin-top: 20px; /* Add spacing from other elements */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: subtle shadow */
  border: 1px solid #e0e0e0; /* Optional: light border */
  border-radius: 8px; /* Rounded corners */
  overflow: hidden; /* Prevent content overflow */
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-right: 30px;
`;

const StyledButton = styled.button`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background-color: #2fadaa;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

const CalendarWrapper = styled.div`
  width: 100%;
  max-width: 1200px; /* Optional: adjust max-width */
  margin: 0 auto;
`;

const LogoContainer = styled.img`
  height: 15rem;
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

function AdminManageCalendar() {
  // main scope

  // retrieving logged in user and id
  const {
    authState: { user, id },
  } = useAuth();

  const CaregiverCalendar = () => {
    // calendar start

    // calendar state false = view, true = edit mode
    const [editMode, setEditMode] = useState(false);

    //state of slots selected in edit mode
    const [selectedSlots, setSelectedSlots] = useState([]);

    // existing availabilities
    const [availabilities, setAvailabilities] = useState([]);

    useEffect(() => {
      // api call
      const getAllAvailabilities = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/availability/${id}`,

            {
              withCredentials: true,
              // using withCredentials is crutial for and request that needs to check authorization!
            }
          );
          const data = response.data;
          const parseAvailabilityData = data

            .map((availability) => {
              return availability.availableSlots.map((slot) => {
                const start = new Date(slot);
                // controls the end time of each slot
                const end = new Date(start.getTime() + 60 * 60 * 1000);

                return {
                  start,
                  end,
                  title: "Available",
                  availabilityId: availability.id,
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

      // api call ends
      // remount useEffect everytime editMode changes to make sure the calendar
      // data is up to date.
    }, [editMode]);

    // select slot logic
    const handleSlotSelect = ({ start, end }) => {
      // create new slot
      const newSlot = {
        start,
        end,
        title: `New Availability`,
      };

      //add selected slots to availabilities state to be visable in calendar
      setAvailabilities((prev) => [...prev, newSlot]);

      // levels out the time difference between data sent into mongoDB(-2hrs) and
      // data beeing fetched wich is only +1hr so right time slot gets filled when
      // fetched from backend.
      const timeCorrection = new Date(start.getTime() + 60 * 60 * 1000);

      //add selected slots to the state that gets sent to backend
      setSelectedSlots((prev) => [...prev, timeCorrection]);
    };

    // custom styles for slots both in editMode and default
    const eventStyleGetter = (event) => {
      // Loop through selected slots and check if the event's start time is one of the selected slots
      if (editMode) {
        const matchingSlot = selectedSlots.find(
          (slot) => slot.getTime() === event.start.getTime() + 60 * 60 * 1000 // Correct the event's time by subtracting 1 hour
        );

        if (matchingSlot) {
          return {
            // style for selected slots in editMode
            style: {
              backgroundColor: "#057D7A",
              color: "white",
              borderRadius: "8px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              border: `1px solid ${"#2F8EAF"}`,
            },
          };
        }
      }
      // Default style for other events (non-selected)
      return {
        style: {
          backgroundColor: "#76B3C8",
          color: "slate",
          borderRadius: "8px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${"#2F8EAF"}`,
        },
      };
    };

    console.log("[SELECTEDSLOTS]:", selectedSlots);

    // calback function to toggle the state of editMode when called ()
    const handleToggleEditMode = () => {
      setEditMode((prevMode) => !prevMode);
    };

    //save selected slots to backend logic
    const handleSaveAvailabilitySlots = async () => {
      if (selectedSlots.length === 0) {
        alert("You have no slots selected!");
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
        alert("Changes are now saved");
        // untoggles editmode when saved
        setEditMode(false);
        setSelectedSlots([]);
      } catch (error) {
        console.error("Error creating post:", error);
      }
    };

    //returning the calendar
    return (
      <div>
        <CalendarWrapper>
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
            views={["week", "day"]}
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
            onSelectSlot={handleSlotSelect}
            eventPropGetter={eventStyleGetter}
            //onSelectEvent={handleEventSelect}
          />
        </CalendarWrapper>
        <ButtonContainer>
          {editMode && (
            <StyledButton onClick={handleSaveAvailabilitySlots}>
              Save Changes
            </StyledButton>
          )}
          <StyledButton onClick={handleToggleEditMode}>
            {editMode ? "Go Back" : "Edit Calendar"}
          </StyledButton>
        </ButtonContainer>
      </div>
    );
    //calendar scope ends
  };

  return (
    <AvailabilityContainer>
      <LogoContainer src={Logo} />
      <Title>{user} Schedule Dashboard</Title>
      <Text>Availability and Appointments</Text>
      <CalendarContainer>
        <CaregiverCalendar />
      </CalendarContainer>
    </AvailabilityContainer>
  );

  // main scope ends
}

export default AdminManageCalendar;
