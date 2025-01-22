import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Logo from "../assets/health_care_logo.svg";
import styled, { keyframes } from "styled-components";
import Logout from "./Logout";
import FetchAppointments from "./FetchAppointments";

// admin page, can only visit if you have role ADMIN
const AdminContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: -5%;
`;

const StyledButton = styled.button`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #fff;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background-color: #2fadaa;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

const LogoContainer = styled.img`
  height: 20rem;
  padding: 0;
`;

const Title = styled.h2`
  font-size: 22px;
`;

const Text = styled.p`
  font-size: 18px;
`;

const BookingText = styled.p`
  font-size: 22px;
  font-weight: 800;
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);`;

const AppointmentsButton = styled.button`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 400;
  color: #fff;
  margin-top: 40px;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  text-align: center;
  border: none;

  &:hover {
    background-color: #2fadaa;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

const LoadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2vh;
  margin-top: 1%;
`;

const Loader = styled.div`
  border: 10px solid white;
  border-top: 10px solid #057d7a;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
`;

function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  // get todays date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;

  const dayMonth = `0${month}-${day}`;
  dayMonth.toString();

  // using custom hook to check if the user is authenticated and has the correct role
  const {
    authState: { user, id },
  } = useAuth();

  //const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  //ändra routing till page AvailabilityManager om detta fungerar
  const goToCalendar = () => {
    navigate("/admin/availability");
  };
  const [users, setUsers] = useState([]);

  // Fetch appointments belonging to the logged in user.
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/appointment/getbyidanddate?userId=` +
          id +
          `&currentDate=` +
          dayMonth
      );
      setAppointments(res.data);
      setLoading(false);
    };
    fetchAppointments();
  }, []);

  return (
    <AdminContainer>
      <LogoContainer src={Logo} />
      <Title>Admin Dashboard</Title>
      <Text>Welcome, {user}</Text>
      <StyledButton onClick={goToCalendar}>Go To Calendar</StyledButton>
      <BookingText>Today's appointments</BookingText>

      {/* ternary to check if appointments array is empty, in that case display "No appointments yet" to user */}
      {appointments && appointments.length > 0 ? (
        <div
          style={{
            display: "grid",
            justifyContent: "center",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "5px",
            justifyItems: "center",
            maxWidth: "50%",
          }}
        >
          {appointments.map((a, i) => {
            return (
              <FetchAppointments
                key={i}
                dateTime={a.dateTime}
                id={a.id}
                username={a.patientId.username}
                status={a.status}
              />
            );
          })}
        </div>
      ) : (
        <>
          <LoadContainer>
            <Loader></Loader>
          </LoadContainer>
          <Text>No appointments yet</Text>
        </>
      )}
      <Logout />
    </AdminContainer>
  );
}

export default AdminDashboard;
