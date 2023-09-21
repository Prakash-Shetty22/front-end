import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, List, ListItem, ListItemText, Container } from '@mui/material';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import CardComp from '../mui/CardComp';
import availabilityImage from '../../images/availability3.jpg';
import appointmentImage from '../../images/appointment.jpg';
import { NavLink } from 'react-router-dom';
import Header from '../mui/Header';

const DoctorDashboard = () => {
    const role = sessionStorage.getItem('role');

    const [data, setData] = useState();

    const availability = "Add and View Your Availabilities";
    const appointment = "View Your Appointments and Pending Requests";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.post('http://localhost:8082/doctor/getDetails', {
                mobileNumber: sessionStorage.getItem('mobileNumber')
            });

            setData(response.data);

            console.log(response.data);

        } catch (error) {
            // Handle error response
            console.error(error);
        }
    };

    return (
        <div>
            {(() => {

                if (role === 'Doctor') {
                    console.log("Inside Doctor session");
                    return (
                        <div>
                            <Header username={sessionStorage.getItem('username')} path="/doctor" />
                            <Typography sx={{ marginTop: 3 }} variant="h5" component="h1">
                                Doctor Dashboard
                            </Typography>
                            {data && (<Typography variant="h6" component="h1">
                                <span style={{ color: '#8C3333' }}>{data.hospital.name}</span>
                            </Typography>)}
                            <Box sx={{ width: '100%' }}>
                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{ minHeight: '100vh' }}>
                                    <Grid item xs={'auto'} lg={'auto'}>
                                        <CardComp title="Availabilities" cardName="AVAILABILITIES" details={availability} image={availabilityImage} hrf='/doctor/availabilities'></CardComp>
                                    </Grid>
                                    <Grid item xs={'auto'} lg={'auto'}>
                                        <CardComp title="Appointments" cardName="APPOINTMENTS" details={appointment} image={appointmentImage} hrf='/doctor/appointments'></CardComp>
                                    </Grid>
                                </Grid>
                            </Box>
                        </div>
                    );
                }
                else {
                    return (
                        <Typography variant="h5" component="h1">
                            <NavLink to='/'>Please Login Using Doctors Login Credentials</NavLink>
                        </Typography>
                    );
                }

            })()}
        </div>
    );
}

export default DoctorDashboard;
