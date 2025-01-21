import { Link } from "react-router-dom";
import styled from "styled-components";

const AppointmentsContainer = styled.div`
  margin: 1rem;
  width: 10rem;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
  border: 2px solid #057d7a;
  border-radius: 10px;
  font-family: "Exo 2", sans-serif;
  background-color: rgb(237, 241, 241);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  &:hover {
    background-color: #e0f7f7;
  }
`;

const hover = styled.div`
  AppointmentsContainer:hover {
    background-color: black;
  }
`;

const Title = styled.p`
  font-weight: 700;
`;

function FetchAppointments({ dateTime, username, id, status }) {
  return (
    <Link
      style={{ textDecoration: "none", color: "black" }}
      to={`/appointment/${id}`}
    >
      <AppointmentsContainer>
        <Title> Appointment </Title>
        <p> {dateTime} </p>
        <p> Meeting with:</p>
        <Title>{username}</Title>
        <p>Status: {status}</p>
      </AppointmentsContainer>
    </Link>
  );
}

export default FetchAppointments;
