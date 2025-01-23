import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const Text = styled.p`
  font-size: 18px;
`;

const Cancel = styled.button`
  cursor: pointer;
  padding: 5px 15px;
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

const Back = styled.button`
  cursor: pointer;
  padding: 5px 15px;
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

const AppointmentDataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 20rem;
  height: 20rem;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
  border: 2px solid #057d7a;
  border-radius: 10px;
  font-family: "Exo 2", sans-serif;
  background-color: rgb(237, 241, 241);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
`;

const AppointmentDetails = () => {
  const { id } = useParams();

  const {
    authState: { user, password, roles },
  } = useAuth();

  const [appointmentData, setAppointmentData] = useState([]);

  const [credentials] = useState({
    username: user,
    password: password,
  });

  const navigate = useNavigate();

  // Fetch appointments belonging to the logged in user.
  useEffect(() => {
    const fetchAppointments = async () => {
      const res = await axios.get(
        `http://localhost:8080/appointment/id?appointmentId=` + id,
        credentials,
        {
          withCredentials: true,
        }
      );
      setAppointmentData(res.data);
    };
    fetchAppointments();
  }, []);

  const cancelAppointment = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8080/appointment/cancel/` + id,
        credentials,
        {
          withCredentials: true,
        }
      );
      if (roles.includes("ADMIN")) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    } catch (error) {
      console.log(id);
      console.log("Error: " + error);
    }
  };

  const goBack = () => {
    if (roles.includes("ADMIN")) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/user/dashboard", { replace: true });
    }
  };

  return (
    <AppointmentDataContainer>
      <Text>Time: {appointmentData.dateTime}</Text>
      {appointmentData.symptoms == null ? (
        <Text>No symptoms specified</Text>
      ) : (
        <Text>Symptoms: {appointmentData.symptoms}</Text>
      )}
      <Cancel onClick={cancelAppointment}>Cancel appointment</Cancel>
      <Back onClick={goBack}>Go back</Back>
    </AppointmentDataContainer>
  );
};

export default AppointmentDetails;
