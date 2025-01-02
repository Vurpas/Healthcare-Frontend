import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
// login page
const RegisterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const RegisterButton = styled.button`
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

const Title = styled.h2`
  font-size: 22px;
`;

const FormWrapper = styled.form`
  padding: 40px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 350px;
  gap: 10px;
`;

const StyledInput = styled.input`
  font-size: 16px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  border-radius: 5px;
  padding: 5px 0px;

  &:focus {
    outline: none;
  }
`;

function Register() {
  const { setAuthState } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        credentials,
        {
          withCredentials: true,
          // using withCredentials is crucial for any request that needs to check authorization!
          // so remember to use this if needed
        }
      );

      const { username, roles } = response.data;

      setAuthState({
        isAuthenticated: true,
        user: username,
        roles: roles,
        loading: false,
      });

      // redirect based on role
      if (roles.includes("ADMIN")) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <RegisterContainer>
      <Title>Register New Account</Title>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <FormWrapper onSubmit={handleRegister}>
        <label>Username: </label>
        <StyledInput
          name="username"
          type="text"
          value={credentials.username}
          onChange={handleInputChange}
          required
        />
        <label>Password: </label>
        <StyledInput
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleInputChange}
          required
        />
        <RegisterButton type="submit">Login</RegisterButton>
      </FormWrapper>
    </RegisterContainer>
  );
}

export default Register;
