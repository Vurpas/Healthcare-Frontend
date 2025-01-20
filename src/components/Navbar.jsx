import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import React from "react";
import Logout from "./Logout";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import "../styles/Button.css";
import RequireAuth from "./RequireAuth";

const Navbar = () => {
  const {
    authState: { roles },
  } = useAuth();

  const navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  return (
    <RequireAuth roles={["USER", "ADMIN"]}>
      <>
        <NavContainer>
          <ListContainer>
            <LogoContainer
              src={Logo}
              onClick={() =>
                routeChange(`/${roles[0].toLowerCase()}/dashboard`)
              }
            />
            <MyPageContainer>
              <MyAppointmentsButton
                onClick={() => routeChange("/appointments")}
              >
                My Appointments
              </MyAppointmentsButton>
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
  height: 115px;
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

const MyAppointmentsButton = styled.button`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 400;
  color: #fff;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  text-align: center;
  border: none;

  &:hover {
    background-color: #2fadaa;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
`;
