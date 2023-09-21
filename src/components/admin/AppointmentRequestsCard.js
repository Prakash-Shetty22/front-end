import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

export default function AppointmentRequestsCard({ data, setShowSuccess }) {

    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    const { fullName, specialization, age, gender, fee, hospital } = data.doctor;
    const { name, location, admin } = hospital;
    const { mobileNumber, fullName: adminFullName } = admin;

    
    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowError(false);
    };

    const handleSendRequest = async () => {
        // try {
        //     const response = await axios.post('http://localhost:8084/appointments/sendRequest', {
        //         data: data
        //     });

        //     // const data = await response.data;

        //     setDetails(response.data);

        //     // Convert the objects to strings using JSON.stringify()
        //     const offenceDataAsString = response.data.map(obj => JSON.stringify(obj));

        //     // Display the offence data as strings
        //     console.log("Rows:", offenceDataAsString.join(", "));

        // } catch (error) {
        //     console.error('Error fetching data:', error);
        // }

        // console.log("Inside handle");
        try {
            // console.log("Type of data: " + typeof data);
            // const response = await fetch("http://localhost:8084/appointments/sendRequest", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify(data)
            // });

            const response = await axios.post('http://localhost:8084/appointments/sendRequest', data);

            // const data = await response.json();
            const responseData = await response.data;

            // if (response.status === 409) {
            //     setAlertMessage("Mobile Number already exists. Please enter another Mobile Number");
            //     // Do something if mobile number is already registered
            //     setShowSnackbar(true);
            // }
            // else if (response.ok) {
            //     // setUser(data); // assuming the server returns the saved user object
            //     // setMessage("");

            //     // Registration successful, use the returned user data
            //     const user = data;
            //     // ...
            //     console.log(data);
            //     props.setAlertMessage("Sign Up is successful. Please Sign In to Continue");
            //     props.setShowSnackbar(true);
            //     props.setValue(0);
            // } else {
            //     // setMessage(data);
            //     // setUser(null);

            //     setAlertMessage("An error occurred during signup. Please try again later.");
            //     setShowSnackbar(true);
            // }

            if (responseData.message === "Appointment sent successfully") {
                // setAlertMessage(response.data.message);
                // setShowSnackbar(true);

                // const index = details.findIndex(obj => obj.id === data.id);

                // if (index !== -1) {
                //     details.splice(index, 1);
                // }

                setShowSuccess(true);

            }
            else {
                setErrorMessage(response.data.message);
                setShowError(true);
            }
        } catch (error) {
            // Handle connection errors here
            console.log(error);
            setErrorMessage("An error occurred while connecting to the server");
            setShowError(true);
            // if (error.name !== 'AbortError') {
            //     setAlertMessage("An error occurred while connecting to the server");
            //     setShowSnackbar(true);
            // }
        }
    }

    return (
        <Card>
            <Snackbar open={showError} autoHideDuration={6000} onClose={handleErrorClose}>
                <MuiAlert onClose={handleErrorClose} severity="error" variant="filled">
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
            <CardContent>
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    <Grid item xs={6} md={3} sx={{ textAlign: 'left', backgroundColor: '#D9FAFB' }}>
                        <Typography variant="h6" style={{ color: '#52B69A' }}>Patient Details</Typography>
                        <Typography variant="body1" style={{ color: '#3AAFA9' }}>Name: {data.patient.fullName}</Typography>
                        <Typography variant="body1" style={{ color: '#3AAFA9' }}>Mobile Number: {data.patient.mobileNumber}</Typography>
                    </Grid>

                    <Grid item xs={6} md={3} sx={{ textAlign: 'left', backgroundColor: '#FDFCDC' }}>
                        <Typography variant="h6" style={{ color: '#FF7171' }}>Appointment Details</Typography>
                        <Typography variant="body1" style={{ color: '#AD8BF0' }}>Date: {data.date}</Typography>
                        <Typography variant="body1" style={{ color: '#AD8BF0' }}>Time: {data.time}</Typography>
                        <Typography variant="body1" style={{ color: '#AD8BF0' }}>Status: Requested</Typography>
                        <Typography variant="body1" style={{ color: '#AD8BF0' }}>Specialization: {specialization}</Typography>
                    </Grid>

                    <Grid item xs={6} md={3} sx={{ textAlign: 'left', backgroundColor: '#F8F7FF' }}>
                        <Typography variant="h6" style={{ color: '#387FFF' }}>Doctor Details</Typography>
                        <Typography variant="body1" style={{ color: '#5E5CE6' }}>Name: {fullName}</Typography>
                        <Typography variant="body1" style={{ color: '#5E5CE6' }}>Specialization: {specialization}</Typography>
                        <Typography variant="body1" style={{ color: '#5E5CE6' }}>Age: {age}</Typography>
                        <Typography variant="body1" style={{ color: '#5E5CE6' }}>Gender: {gender}</Typography>
                        <Typography variant="body1" style={{ color: '#5E5CE6' }}>Fee: {fee}</Typography>
                    </Grid>

                    {/* 
                    <Grid item xs={6} md={3} sx={{ textAlign: 'left', backgroundColor: '#FFFCDD' }}>
                        <Typography variant="h6" style={{ color: '#FFB800' }}>Contact Details</Typography>
                        <Typography variant="body1" style={{ color: '#FFD700' }}>Mobile Number: {mobileNumber}</Typography>
                        <Typography variant="body1" style={{ color: '#FFD700' }}>Name: {adminFullName}</Typography>
                    </Grid> */}

                    {/* <Grid item xs={6} md={3} sx={{ textAlign: 'left', backgroundColor: '#FFFCDD' }}> */}
                    <Grid item xs={6} md={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'left', backgroundColor: '#FFFCDD' }}>
                        {/* <Typography variant="h6" style={{ color: '#FFB800' }}>Send Request</Typography> */}
                        {/* <Button variant="contained" color="primary">Send Request</Button> */}
                        <Button variant="contained" color="primary" startIcon={<SendIcon />} onClick={handleSendRequest} sx={{'&:hover': { backgroundColor: '#4caf50', color: '#fff' }}}>Send Request</Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
