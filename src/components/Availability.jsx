// skapa fetch availabileSlots from backend
// kolla hur den skall se ut för att visa hämtad data i react big calender

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
//import Logout from "./Logout";
// admin page, can only visit if you have role ADMIN
const AvailabilityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 16px;
`;

const LogoContainer = styled.img`
  height: 20rem;
`;

const Title = styled.h2`
  font-size: 22px;
`;

const Text = styled.p`
  font-size: 18px;
`;

function Availability() {
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);

  return (
    <AvailabilityContainer>
      <Title>{user}, Here is your availabilities!</Title>
      <Text>Show availabilities down here!</Text>
    </AvailabilityContainer>
  );
}

export default Availability;
