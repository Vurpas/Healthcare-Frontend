import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import styled from "styled-components";

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

  console.log(authState.id);

  return (
    <>
      <Title>Appointments for {user} </Title>
    </>
  );
}

export default MyAppointments;
