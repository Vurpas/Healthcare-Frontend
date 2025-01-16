import { Link } from "react-router-dom";
import React from "react";
import Logout from "./Logout";
import Home from "./Home";
import UserDashboard from "./UserDashboard";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";

const NavContainer = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  background: rgb(40, 185, 132);
  box-sizing: border-box;
  font-family: sans-serif;
`;

const ListContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  background: rgb(241, 253, 176);
  list-style: none;
  text-align: center;
  font-size: 18px;
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

const Navbar = () => (
  <>
    <NavContainer>
      <ListContainer>
        <LogoContainer src={Logo} />
        <MyPageContainer>
          <p>My page</p>
        </MyPageContainer>
        <LogOutContainer>
          <p>Log out</p>
        </LogOutContainer>
      </ListContainer>
    </NavContainer>
  </>
);

export default Navbar;
