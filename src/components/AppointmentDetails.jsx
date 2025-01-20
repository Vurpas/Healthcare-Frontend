import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Text = styled.p`
  font-size: 18px;
`;

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointmentData, setAppointmentData] = useState([]);

  // Fetch appointments belonging to the logged in user.
  useEffect(() => {
    const fetchAppointments = async () => {
      const res = await axios.get(
        `http://localhost:8080/appointment/id?appointmentId=` + id
      );
      setAppointmentData(res.data);
    };
    fetchAppointments();
  }, []);

  console.log(appointmentData);
  console.log(id);

  /*  <Text>Doctor: {appointmentData.caregiverId.username}</Text>
      <Text>Patient: {appointmentData.patientId.username}</Text> 
      
      These lines causes the page to crash on refresh, can no longer fetch data if these are included...?
    */

  return (
    <>
      <Text>Time: {appointmentData.dateTime}</Text>
      {appointmentData.symptoms == null ? (
        <Text>No symtoms specified</Text>
      ) : (
        <Text>Symptoms: {appointmentData.symptoms}</Text>
      )}
    </>
  );
};

export default AppointmentDetails;
