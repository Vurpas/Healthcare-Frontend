// import { format } from "date-fns";
import styled from "styled-components";

const AppointmentsContainer = styled.div`
  margin: 1rem;
  width: 14rem;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 0.5rem;
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

function FetchAppointments({ dateTime }) {
  return (
    <AppointmentsContainer>
      <Title> Möte </Title>
      <p> {dateTime} </p>
    </AppointmentsContainer>
  );
}

export default FetchAppointments;
