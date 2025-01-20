import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
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

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);

  // get todays date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;

  const dayMonth = `0${month}-${day}`;
  dayMonth.toString();

  console.log(dayMonth);

  // using custom hook to check if the user is authenticated and has the correct role
  const {
    authState: { user, id },
  } = useAuth();
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const routeChange = () => {
    navigate("/appointments");
  };

  // Fetch appointments belonging to the logged in user.
  useEffect(() => {
    const fetchAppointments = async () => {
      const res = await axios.get(
        `http://localhost:8080/appointment/getbyidanddate?userId=` +
          id +
          `&currentDate=` +
          dayMonth
      );
      setAppointments(res.data);
    };
    fetchAppointments();
  }, []);

  console.log(appointments);

  return (
    <AdminContainer>
      <LogoContainer src={Logo} />
      <Title>Admin Dashboard</Title>
      <Text>Welcome, {user}!</Text>
      <BookingText>Today's appointments</BookingText>
      {/* ternary to check if appointments array is empty, in that case display "No appointments yet" to user */}
      {appointments && appointments.length > 0 ? (
        <div
          style={{
            display: "grid",
            justifyContent: "center",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "5px",
            justifyItems: "center",
            maxWidth: "50%",
          }}
        >
          {appointments.map((a, i) => {
            return <FetchAppointments key={i} dateTime={a.dateTime} />;
          })}
        </div>
      ) : (
        <Text>No Appointments yet</Text>
      )}
      <Logout />
    </AdminContainer>
  );
}

export default AdminDashboard;
