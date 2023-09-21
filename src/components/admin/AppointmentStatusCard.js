import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import axios from 'axios';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

export default function AppointmentStatusCard({ data, setShowSuccess, setAlertMessage }) {

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

        try {

            const response = await axios.post('http://localhost:8084/appointments/sendToPatient', data);

            const responseData = await response.data;

            if (responseData.message === "Sent successfully") {
                setAlertMessage(responseData.message);
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
        }
    }

    const handleFixAppointment = async () => {

        try {

            const response = await axios.post('http://localhost:8084/appointments/fixAppointment', data);

            const responseData = await response.data;

            if (responseData.message === "Appointment Fixed Successfully") {
                setAlertMessage(responseData.message);
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
                        <Typography variant="body1" style={{ color: '#AD8BF0' }}>
                            Status: {' '}
                            {(() => {
                                if(data.reschedulingRequest) {
                                    return data.reschedulingStatus
                                }
                                else {
                                    return data.requestStatus
                                }
                            })()}
                        </Typography>
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

                    <Grid item xs={6} md={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'left', backgroundColor: '#FFFCDD' }}>
                        {(() => {
                            if(data.requestStatus === 'Accepted' || data.reschedulingStatus === 'Accepted') {
                                return <Button variant="contained" color="secondary" startIcon={<EventAvailableIcon />} onClick={handleFixAppointment} sx={{ '&:hover': { backgroundColor: '#f44336', color: '#fff' } }}>Fix Appointment</Button>
                            }
                            else {
                                return <Button variant="contained" color="primary" startIcon={<SendIcon />} onClick={handleSendRequest} sx={{'&:hover': { backgroundColor: '#4caf50', color: '#fff' }}}>Send Back To Patient</Button>
                            }
                        })()}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
