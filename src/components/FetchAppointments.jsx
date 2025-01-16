import styled from "styled-components";

const AppointmentsContainer = styled.div`
  margin: 1rem;
  width: 14rem;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 0.5rem;
  border: 3px solid #057d7a;
  border-radius: 10px;
  font-family: "Exo 2", sans-serif;
`;

function FetchAppointments({ dateTime }) {
  const time = dateTime.toString();

  return (
    <AppointmentsContainer>
      <p>Möte: {time} </p>
    </AppointmentsContainer>
  );
}

export default FetchAppointments;
