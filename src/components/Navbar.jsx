import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
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
  margin-left: 50px;
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
  margin-right: 80px;
`;

function MyPageLink({ to, children }) {
  return (
    <Link to={to}>
      <button className="MyAppointmentsBtn">{children}</button>
    </Link>
  );
}

function ifUser() {
  if (allowedRoles === "USER") {
    console.log(allowedRoles);
    return <Link to="/user/dashboard">My appointments</Link>;
  } else {
    return <Link to="/admin/dashboard">My appointments</Link>;
  }
}

const Navbar = () => {
  return (
    <>
      <NavContainer>
        <ListContainer>
          <RequireAuth allowedRoles={["ADMIN", "USER"]}>
            <Link to="/user/dashboard">
              <LogoContainer src={Logo} />
            </Link>
            <MyPageContainer>
              {ifUser}
              <MyPageLink to="/user/dashboard">My appointments</MyPageLink>
            </MyPageContainer>
            <LogOutContainer>
              <Link to="/logout"></Link>
              <Logout />
            </LogOutContainer>
          </RequireAuth>
        </ListContainer>
      </NavContainer>
    </>
  );
};
export default Navbar;
