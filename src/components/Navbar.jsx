import { Link } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import React from "react";
import Logout from "./Logout";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import "../styles/Button.css";

const NavContainer = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: center;
  background-color: rgb(168, 211, 210);
  box-sizing: border-box;
`;

const ListContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  list-style: none;
  text-align: center;
`;

const LogoContainer = styled.img`
  display: flex;
  width: 140px;
  height: 120px;
  cursor: pointer;
  border: none;
  margin-left: 30px;
  font-family: "Roboto", sans-serif;
  text-decoration: none;
  &:hover {
    background-color: rgb(146, 193, 192);
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

const MyPageContainer = styled.p`
  display: flex;
  cursor: pointer;
`;

const LogOutContainer = styled.p`
  display: flex;
  cursor: pointer;
  margin-right: 60px;
`;

function MyPageLink({ to, children }) {
  return (
    <Link to={to}>
      <button className="MyAppointmentsBtn">{children}</button>
    </Link>
  );
}

const Navbar = (props) => {
  const role = props.role;
  return (
    <RequireAuth allowedRoles={["ADMIN", "USER"]}>
      <>
        <NavContainer>
          <ListContainer>
            <Link to={`${role.toLowerCase()}/appointments`}>
              <LogoContainer src={Logo} />
            </Link>
            <MyPageContainer>
              <MyPageLink to={`${role.toLowerCase()}/appointments`}>
                My appointments
              </MyPageLink>
            </MyPageContainer>
            <LogOutContainer>
              <Link to="/logout"></Link>
              <Logout />
            </LogOutContainer>
          </ListContainer>
        </NavContainer>
      </>
    </RequireAuth>
  );
};
export default Navbar;
