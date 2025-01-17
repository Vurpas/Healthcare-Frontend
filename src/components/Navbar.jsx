import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import RequireAuth from "./RequireAuth";
import React from "react";
import Logout from "./Logout";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import Home from "./Home";

const NavContainer = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  background-color: #057d7a;
  box-sizing: border-box;
`;

const ListContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  background: rgb(241, 253, 176);
  list-style: none;
  text-align: center;
`;

const LogoContainer = styled.img`
  display: flex;
  width: 140px;
  cursor: pointer;
`;

const MyPageContainer = styled.p`
  display: flex;
  cursor: pointer;
  margin: 100px;
`;

const LogOutContainer = styled.p`
  display: flex;
  cursor: pointer;
  margin: 100px;
`;

const Button = styled.button`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border: none;
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  font-weight: 400;
  &:hover {
    background-color: #2fadaa;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

/*
function UserDashboard() {
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
}
//ändra routing till page AvailabilityManager om detta fungerar
const goToUserDashboard = () => {
  navigate("/user/dashboard");
};
*/

const Navbar = () => {
  return (
    <>
      <NavContainer>
        <ListContainer>
          <RequireAuth allowedRoles={["ADMIN", "USER"]}>
            <Link to="/home">
              <LogoContainer src={Logo} />
            </Link>
            <MyPageContainer>
              <Link to="/user/dashboard">My page</Link>
            </MyPageContainer>
            <LogOutContainer>
              <Link to="/logout"></Link>
              <Button>
                <p>Log out</p>
                <Logout />
              </Button>
            </LogOutContainer>
          </RequireAuth>
        </ListContainer>
      </NavContainer>
    </>
  );
};
export default Navbar;
