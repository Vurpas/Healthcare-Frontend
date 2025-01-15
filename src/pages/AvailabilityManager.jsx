//sidan man hamnar på när man klickar på set Availabilities knapp i admin dashboard
//börja med att enbart säkerställa att man hamnar rätt och att den här routen inte blir tillgänglig om man inte är ADMIN!

//efter det importera Availability componenten och börja bygga den funktionaliteten
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
//avkommentera denna import när det är dags för att göra en redirect efter availabilities är satt!
//import { useNavigate } from "react-router-dom";
import Availability from "../components/Availability";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
//import Logout from "./Logout";
// admin page, can only visit if you have role ADMIN
const AvailabilityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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

function AvailabilityManager() {
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);

  return (
    <AvailabilityContainer>
      <LogoContainer src={Logo} />
      <Title>Availability Dashboard</Title>
      <Text>Welcome</Text>
      <Availability />
    </AvailabilityContainer>
  );
}

export default AvailabilityManager;
