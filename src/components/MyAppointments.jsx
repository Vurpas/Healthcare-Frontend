import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import styled from "styled-components";
import FetchAppointments from "./FetchAppointments";

const Title = styled.h2`
  font-size: 22px;
`;

function MyAppointments() {
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);

  // Get that authState of the user the logged in user.
  const { authState } = useAuth();

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch(
      `http://localhost:8080/appointment/getbyid?userId=` + authState.id,

      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => setAppointments(data));
  }, []);

  console.log(appointments);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Title>Dina kommande bokningar</Title>
      {appointments.map((a, i) => {
        return <FetchAppointments key={i} dateTime={a.dateTime} />;
      })}
    </div>
  );
}

export default MyAppointments;
