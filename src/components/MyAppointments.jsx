import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import styled from "styled-components";
import FetchAppointments from "./FetchAppointments";

const Title = styled.h2`
  font-size: 22px;
`;

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  // Get user id from authContext.
  const {
    authState: { id },
  } = useAuth();

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
