import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/health_care_logo.svg";
import styled, { keyframes } from "styled-components";
import Logout from "./Logout";
import FetchAppointments from "./FetchAppointments";

// div with styles
const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: -5%;
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

const AppointmentsButton = styled.button`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 400;
  color: #fff;
  margin-top: 30px;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  text-align: center;
  border: none;
  
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
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
            return (
              <FetchAppointments
                key={i}
                dateTime={a.dateTime}
                id={a.id}
                username={a.caregiverId.username}
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
