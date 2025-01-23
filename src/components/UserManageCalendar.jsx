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
import "../styles/Calendar.css";
import { sv } from "date-fns/locale";

const MainContainer = styled.div`
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
        <DialogTitle>Booking Info</DialogTitle>
        <Text>Date: {formatDate(appointmentInfo.selectedSlot)}</Text>
        <DialogButtonContainer>
          <StyledButton onClick={onClose} style={{ backgroundColor: "#666" }}>
            Cancel
          </StyledButton>
          <StyledButton onClick={onConfirm}>Confirm booking</StyledButton>
        </DialogButtonContainer>
      </DialogContent>
    </DialogOverlay>
  );
};

function UserManageCalendar() {
  // main scope

  // retrieving logged in user and id
  const {
    authState: { user, id },
  } = useAuth();

  const PatientCalendar = () => {
    // calendar start

    //state of slots selected in edit mode
    const [newAppointment, setNewAppointment] = useState({
      caregiverId: "",
      patientId: "",
      selectedSlot: "",
      symptoms: "123",
    });

    // existing availabilities
    const [availabilities, setAvailabilities] = useState([]);

    // calendar state false = view, true = edit mode
    const [editMode, setEditMode] = useState(true);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // update this to accomodate fetching all existing availabilities
    useEffect(() => {
      // api call
      const getAllAvailabilities = async () => {
        try {
          const response = await axios.get(
            //change this endpoint when implemented
            `http://localhost:8080/availability/all`,

            {
              withCredentials: true,
              // using withCredentials is crutial for and request that needs to check authorization!
            }
          );
          const data = response.data;
          const now = new Date();

          const parseAvailabilityData = data
            .map((availability) => {
              // get caregiverId and username from the response
              const { caregiverId } = availability;
              const username = caregiverId.username;

              return availability.availableSlots
                .map((slot) => {
                  const start = new Date(slot);
                  // controls the end time of each slot
                  const end = new Date(start.getTime() + 60 * 60 * 1000);

                  return {
                    start,
                    end,
                    title: "Available",
                    doctor: username,
                    availabilityId: availability.id,
                    caregiverId: caregiverId.id,
                    type: "availability",
                  };
                })
                .filter((slot) => {
                  // Lägg till en liten marginal (t.ex. 30 minuter) för att inte visa tider som nästan passerat
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
    }, []);

    // alert message for when a empty slot is clicked
    const handleSlotSelect = (slotInfo) => {
      if (!slotInfo) {
        alert("Slot is not available!"); // This should never happen, as `slotInfo` is always passed.
      } else {
        console.log("Slot selected:", slotInfo);
        alert("No Availabily found!");
      }
    };

    // logic for when a avalability slot is clicked to start converting it to an appointment
    const handleSelectedEvent = async (event) => {
      if (event.type === "availability") {
        const appointmentInfo = {
          caregiverId: event.caregiverId,
          patientId: id,
          selectedSlot: new Date(event.start.getTime()),
          symptoms: "123",
        };

        //console.log("DEBUG - Original appointment info:", appointmentInfo);

        setSelectedAppointment(appointmentInfo);
        setShowConfirmation(true);
        //console.log("APPOINTMENT INFO:", appointmentInfo);
      } else {
        alert("This is not an available timeslot!");
      }
    };

    const handleConfirmBooking = async () => {
      try {
        // compensating the issue with time difference that was
        // creating error when sending it to backend
        const adjustedDate = new Date(
          selectedAppointment.selectedSlot.getTime()
        );
        adjustedDate.setHours(adjustedDate.getHours() + 1);

        const formattedDate = adjustedDate.toISOString().split(".")[0];

        const appointmentToSend = {
          caregiverId: selectedAppointment.caregiverId,
          patientId: selectedAppointment.patientId,
          selectedSlot: formattedDate,
          symptoms: selectedAppointment.symptoms,
        };

        //console.log("DEBUG - Sending appointment:", appointmentToSend);

        await axios.post(`http://localhost:8080/bookings`, appointmentToSend, {
          withCredentials: true,
        });
        alert("Booking confirmed!");
        setShowConfirmation(false);

        window.location.reload();
      } catch (error) {
        console.error("Error creating booking:", error.response?.data || error);
        alert("Error creating appointment. Please try again.");
      }
    };

    //returning the calendar
    return (
      <div>
        <CalendarWrapper>
          <Calendar
            localizer={localizer}
            events={availabilities}
            style={{ height: 650 }}
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
            dayLayoutAlgorithm="no-overlap"
            //eventPropGetter={eventStyleGetter}
            components={{
              event: ({ event }) => (
                <div
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    backgroundColor: "#76B3C8",
                    height: "100%",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <strong style={{ margin: "0", lineHeight: "1.2" }}>
                    {event.title}
                  </strong>
                  <p style={{ margin: "4px 0", lineHeight: "1.2" }}>
                    {event.doctor}
                  </p>
                </div>
              ),
            }}
            onSelectEvent={handleSelectedEvent}
            onSelectSlot={handleSlotSelect}
            selectable={editMode}
          />
        </CalendarWrapper>
        <ConfirmationDialog
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          appointmentInfo={selectedAppointment}
          onConfirm={handleConfirmBooking}
        />
      </div>
    );
    //calendar scope ends
  };

  // the main return that renders the entire component including the calendar
  return (
    <MainContainer>
      <LogoContainer src={Logo} />
      <Title>Patient Calendar</Title>
      <Text>My Appointments and Available Appointments </Text>
      <CalendarContainer>
        <PatientCalendar />
      </CalendarContainer>
    </MainContainer>
  );

  // main scope ends
}

export default UserManageCalendar;
