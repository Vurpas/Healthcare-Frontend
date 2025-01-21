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

const StyledButton = styled.button`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #fff;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background-color: #2fadaa;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
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

function AdminDashboard() {
  // using custom hook to check if the user is authenticated and has the correct role
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
      <Text>Welcome, {user}</Text>
      <StyledButton onClick={goToCalendar}>Go To Calendar</StyledButton>
      <Logout />
    </AdminContainer>
  );
}

export default AdminDashboard;
