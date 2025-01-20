import axios from "axios";
import styled from "styled-components";

const LogOutButton = styled.button`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-top: 40px;
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

import "../styles/Button.css";
// button to handle logout, you can change this as you want
// does not have to look or be like this but you can see how to use the logout call
const Logout = () => {
  const handleLogout = () => {
    axios
      .post(
        "http://localhost:8080/auth/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return <LogOutButton onClick={handleLogout}>Logout</LogOutButton>;
};

export default Logout;
