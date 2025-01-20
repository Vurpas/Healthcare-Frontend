import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import Logout from "./Logout";
import FetchAppointments from "./FetchAppointments";

// div with styles
const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
// img with styles
const LogoContainer = styled.img`
  height: 20rem;
`;
// h2 with styles
const Title = styled.h2`
  font-size: 22px;
`;
// p with styles
const Text = styled.p`
  font-size: 18px;
`;

const BookingText = styled.p`
  font-size: 22px;
  font-weight: 800;
`;

function UserDashboard() {
  const [appointments, setAppointments] = useState([]);
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
        `http://localhost:8080/appointment/getbyid?userId=` + id
      );
      setAppointments(res.data);
    };
    fetchAppointments();
  }, []);

  return (
    <UserContainer>
      <LogoContainer src={Logo} />
      <Title>User Dashboard</Title>
      <Text>Welcome, {user}!</Text>
      <BookingText>My upcoming appointments</BookingText>
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
            return <FetchAppointments key={i} dateTime={a.dateTime} />;
          })}
        </div>
      ) : (
        <Text>No Appointments yet</Text>
      )}
      <Logout />
    </UserContainer>
    /*  
   Så här hade det sett ut utan styled components
   då hade vi kanske lagt homeContainer som en css klass med samma styles 
   som ovan osv.
   <div>
     <img src={Logo} />
     <h2>User Dashboard</h2>
     <p>Welcome, {user}</p>
     <button>Logout</button>
   </div> */
  );
}

export default UserDashboard;
