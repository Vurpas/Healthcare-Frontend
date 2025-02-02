import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, parseISO } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/Calendar.css";
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
  background-color: rgb(119, 175, 236);
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
const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 300px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DialogTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #333;
  font-size: 20px;
`;

const DialogButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
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

// confirmation modal for when creating an appointment
const ConfirmationDialog = ({
  isOpen,
  onClose,
  appointmentInfo,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd HH:mm");
  };

  return (
    <DialogOverlay>
      <DialogContent>
        <DialogTitle>Availability Info</DialogTitle>
        <Text>Date: {formatDate(appointmentInfo.selectedSlot)}</Text>
        <DialogButtonContainer>
          <StyledButton onClick={onClose} style={{ backgroundColor: "#666" }}>
            Cancel
          </StyledButton>
          <StyledButton onClick={onConfirm}>Remove availability?</StyledButton>
        </DialogButtonContainer>
      </DialogContent>
    </DialogOverlay>
  );
};

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

    // existing appointments
    const [appointments, setAppointments] = useState([]);

    // state to be able to choose to show availabilities and appointments or both
    const [displayMode, setDisplayMode] = useState("combined");

    // states to sort appointments by date
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [oldAppointments, setOldAppointments] = useState([]);

    // state used in confirmationDialogue
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedAvailability, setSelectedAvailability] = useState(null);

    // retrieving all availabilities created by logged in user
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
          const now = new Date();
          const parseAvailabilityData = data

            .map((availability) => {
              return availability.availableSlots
                .map((slot) => {
                  const start = new Date(slot);
                  // controls the end time of each slot
                  const end = new Date(start.getTime() + 60 * 60 * 1000);
                  const type = "availability";

                  return {
                    start,
                    end,
                    title: "Available",
                    caregiverId: id,
                    type: "availability",
                  };
                })
                .filter((slot) => {
                  const marginInMinutes = 30;
                  const marginInMs = marginInMinutes * 60 * 1000;
                  const timeWithMargin = new Date(now.getTime() + marginInMs);

                  return slot.start > timeWithMargin;
                });
            })
            .flat()
            .sort((a, b) => a.start.getTime() - b.start.getTime());

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
    // Fetch appointments belonging to the logged in caregiver.

    useEffect(() => {
      // api call
      const getAllAppointments = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/appointment/getbyid?userId=` + id,
            {
              withCredentials: true,
              // using withCredentials is crutial for and request that needs to check authorization!
            }
          );
          const data = response.data;
          const parseAppointmentData = data.map((appointments) => {
            const {
              caregiverId: { username: Caregiver, id: caregiverId },
              patientId: { firstName: Patient, id: patientId },
              dateTime,
              status,
              id: appointmentId,
            } = appointments;

            const start = new Date(dateTime);
            const end = new Date(start.getTime() + 60 * 60 * 1000);
            //added to be able to separate events in calendar
            const type = "appointments";

            // lets us know if the appointment date alrady has passed
            const today = new Date();
            const isPresent = start >= today ? true : false;

            return {
              Caregiver,
              Patient,
              title: `Appointment with ${Patient}`,
              start,
              end,
              status,
              appointmentId,
              caregiverId,
              patientId,
              type,
              isPresent,
            };
          });

          setAppointments(parseAppointmentData);
        } catch (error) {
          console.error("Unavailable to fetch appointments:", error);
        }
      };

      getAllAppointments();
      // api call ends
    }, []);

    // sort appointments based on date
    useEffect(() => {
      const sortAppointments = () => {
        const present = appointments.filter(
          (appointment) => appointment.isPresent
        );
        const absent = appointments.filter(
          (appointment) => !appointment.isPresent
        );

        setUpcomingAppointments(present);
        setOldAppointments(absent);
      };
      sortAppointments();
    }, [appointments]);

    // select slot logic for adding new availabilities
    const addNewAvailability = ({ start, end }) => {
      if (editMode) {
        const slotExists = availabilities.some(
          (slot) =>
            slot.start.getTime() === start.getTime() &&
            slot.end.getTime() === end.getTime()
        );

        // create new slot

        const newSlot = {
          start,
          end,
          title: "New Availability",
          type: "availability",
        };

        //add selected slots to availabilities state to be visable in calendar
        setAvailabilities((prev) => [...prev, newSlot]);

        // levels out the time difference between data sent into mongoDB(-2hrs) and
        // data beeing fetched wich is only +1hr so right time slot gets filled when
        // fetched from backend.
        const timeCorrection = new Date(start.getTime() + 60 * 60 * 1000);
        console.log("timeCorrection:", timeCorrection);

        //add selected slots to the state that gets sent to backend
        setSelectedSlots((prev) => [...prev, timeCorrection]);
      }
      if (!editMode) {
        alert("To add availability go to Edit Calendar");
      }
    };

    // log appointments state whenever it updates
    useEffect(() => {
      console.log("[selected slots]:", selectedSlots);
    }, [selectedSlots]);

    const handleSelectedEvent = async (event) => {
      // only allows changes inside editMode

      if (editMode && event.type === "availability") {
        const availabilityInfo = {
          caregiverId: id,
          selectedSlot: new Date(event.start.getTime()),
        };
        console.log("DEBUG - Original availability info:", availabilityInfo);

        setSelectedAvailability(availabilityInfo);
        setShowConfirmation(true);
        console.log("AVAILABILITY INFO:", availabilityInfo);
      }
      if (editMode && event.type === "appointments") {
        // insert functionallity to set appointments status to canceled
        alert("You clicked an appointment!");
        console.log("Appointment event clicked:", event);
        // Add your logic for 'other' event types here
      }
      if (!editMode) {
        alert("To edit go to Edit Calendar!");
      }
    };

    const handleConfirmRemoveAvailability = async () => {
      try {
        // compensating the issue with time difference that was
        // creating error when sending it to backend
        const adjustedDate = new Date(
          selectedAvailability.selectedSlot.getTime()
        );
        adjustedDate.setHours(adjustedDate.getHours() + 1);

        const formattedDate = adjustedDate.toISOString().split(".")[0];

        const availabilityToSend = {
          caregiverId: id,
          selectedSlot: formattedDate,
        };
        console.log("DEBUG - Sending availability:", availabilityToSend);

        await axios.delete(
          `http://localhost:8080/availability/removetimeslot`,
          {
            data: availabilityToSend,

            withCredentials: true,
          }
        );
        alert("Availability removed!");
        setShowConfirmation(false);

        window.location.reload();
      } catch (error) {
        console.error(
          "Error removing availability!:",
          error.response?.data || error
        );
        alert("Error removing availability. Please try again.");
      }
    };

    // calback function to toggle the state of editMode when called ()
    const toggleEditMode = () => {
      setEditMode((prevMode) => !prevMode);
      setSelectedSlots([]);
    };

    //save selected slots to backend logic
    const saveNewAvailabilitySlots = async () => {
      if (selectedSlots.length === 0) {
        alert("You have no slots selected!");
        return;
      }
      const data = {
        caregiverId: id,
        availableSlots: selectedSlots,
      };
      //console.log("DATA SENT TO BACKEND:", data);

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

    //clears the selected slot state to avoid unwanted slots in the state
    const clearChanges = () => {
      alert("Changes have been cleared");
      setSelectedSlots([]);
      toggleEditMode();
    };

    // eventsToShow provides the ability to toggle between rendered events
    const eventsToShow = (() => {
      if (displayMode === "combined")
        return [...upcomingAppointments, ...availabilities];
      if (displayMode === "past") return [...oldAppointments];
    })();
    //returning the calendar
    return (
      <div>
        <CalendarWrapper>
          <div style={{ marginBottom: "1rem" }}>
            {displayMode === "combined" && (
              <button
                className="toggleHistory"
                onClick={() => setDisplayMode("past")}
              >
                Appointment History
              </button>
            )}
            {displayMode === "past" && (
              <button
                className="toggleHistory"
                onClick={() => setDisplayMode("combined")}
              >
                Go Back!
              </button>
            )}
          </div>
          <Calendar
            localizer={localizer}
            events={eventsToShow}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
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
            components={{
              event: ({ event }) => {
                const isAvailability = event.type === "availability";
                const newAvailability = event.title === "New Availability";
                const eventStyle = {
                  padding: "8px",
                  borderRadius: "6px",
                  backgroundColor: newAvailability
                    ? "#46a76a"
                    : isAvailability
                    ? "#76B3C8"
                    : "#408180",
                  color: isAvailability ? "#FFFFFF" : "#FFFFFF",
                  height: "100%",
                  //whiteSpace: "normal",
                  //wordWrap: "break-word",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                };

                return (
                  <div style={eventStyle}>
                    <strong style={{ margin: "0", lineHeight: "1.2" }}>
                      {event.title}
                    </strong>
                    <p style={{ margin: "4px 0", lineHeight: "1.2" }}>
                      {event.doctor}
                    </p>
                  </div>
                );
              },
            }}
            selectable={editMode}
            onSelectSlot={addNewAvailability}
            //eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectedEvent}
          />
        </CalendarWrapper>
        <ConfirmationDialog
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          appointmentInfo={selectedAvailability}
          onConfirm={handleConfirmRemoveAvailability}
        />
        <ButtonContainer>
          {editMode && (
            <StyledButton onClick={saveNewAvailabilitySlots}>
              Save Changes
            </StyledButton>
          )}
          <StyledButton onClick={toggleEditMode}>
            {editMode ? "Go Back" : "Edit Calendar"}
          </StyledButton>
          {editMode && (
            <StyledButton onClick={clearChanges}>Clear Changes</StyledButton>
          )}
        </ButtonContainer>
      </div>
    );
    //calendar scope ends
  };

  return (
    <AvailabilityContainer>
      <LogoContainer src={Logo} />
      <Title>{user} Appointments Dashboard</Title>
      <Text>Add new Availabilities OR Cancel Appointments</Text>
      <CalendarContainer>
        <CaregiverCalendar />
      </CalendarContainer>
    </AvailabilityContainer>
  );

  // main scope ends
}
export default AdminManageCalendar;
