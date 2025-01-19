import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import Logout from "./Logout";

// admin page, can only visit if you have role ADMIN
const AdminContainer = styled.div`
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

const availableSlots = [
  "2025-03-17T09:00:00",
  "2025-03-16T11:00:00",
  "2025-03-15T13:00:00",
];

function AdminDashboard() {
  const {
    authState: { user, id },
  } = useAuth();
  //const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  //ändra routing till page AvailabilityManager om detta fungerar
  const goToCalendar = () => {
    navigate("/admin/availability");
  };

  return (
    <AdminContainer>
      <LogoContainer src={Logo} />
      <Title>Admin Dashboard</Title>
      <Text>Logged in as, {user}</Text>
      <button onClick={goToCalendar}>Go To Calendar</button>
      <Logout />
    </AdminContainer>
  );
}

export default AdminDashboard;
