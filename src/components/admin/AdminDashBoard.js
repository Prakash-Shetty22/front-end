import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, List, ListItem, ListItemText, Container } from '@mui/material';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import CardComp from '../mui/CardComp';
import requestImage from '../../images/request.jpg';
import statusImage from '../../images/status.jpg';
import detailsImage from '../../images/details.png';
import messageImage from '../../images/message.webp';
import { NavLink } from 'react-router-dom';
import Header from '../mui/Header';

const AdminDashboard = () => {
    const role = sessionStorage.getItem('role');

    const [data, setData] = useState();

    const requests = "Patients Appointment Requests";
    // const status = "Patients Appointment Status";
    const status = "Doctors Approval";
    const details = "Explore Appointments of Doctors, Patients, ...";
    const queries = "Help Patients through messaging";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // const response = await axios.post('http://localhost:8083/hospital/getDetails', {
            //     mobileNumber: sessionStorage.getItem('mobileNumber')
            // });

            const response = await axios.post('http://localhost:8082/doctor/getBasedOnHospital', {
                mobileNumber: sessionStorage.getItem('mobileNumber')
            });

            // setData(response.data);

            // Convert the objects to strings using JSON.stringify()
            const offenceDataAsString = response.data.map(obj => JSON.stringify(obj));

            // Display the offence data as strings
            console.log("Rows:", offenceDataAsString.join(", "));

            // console.log("Data : " + response.data);

            let obj = null;

            console.log("Name : " + response.data[0].hospital.name);

            if (response.data != null)
                obj = response.data[0].hospital.name;

            setData(obj);

        } catch (error) {
            // Handle error response
            console.error(error);
        }
    };

    return (
        <div>
            {(() => {

                if (role === 'Admin') {
                    console.log("Inside Admin session");
                    return (
                        <div>
                            <Header username={sessionStorage.getItem('username')} path="/admin" />
                            <Typography sx={{ marginTop: 3 }} variant="h5" component="h1">
                                Admin Dashboard
                            </Typography>
                            {data && (<Typography variant="h6" component="h1">
                                <span style={{ color: '#8C3333' }}>{data}</span>
                            </Typography>)}
                            <Box sx={{ width: '100%' }}>
                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{ minHeight: '100vh' }}>
                                    <Grid item xs={'auto'} lg={'auto'}>
                                        <CardComp title="Request" cardName="REQUESTS" details={requests} image={requestImage} hrf='/admin/requests'></CardComp>
                                    </Grid>
                                    <Grid item xs={'auto'} lg={'auto'}>
                                        <CardComp title="Status" cardName="STATUS" details={status} image={statusImage} hrf='/admin/status'></CardComp>
                                    </Grid>
                                    <Grid item xs={'auto'} lg={'auto'}>
                                        <CardComp title="Details" cardName="VIEW DETAILS" details={details} image={detailsImage} hrf='/admin/details'></CardComp>
                                        {/* <CardComp title="Details" cardName="VIEW DETAILS" details={details} image={detailsImage} hrf='#'></CardComp> */}
                                    </Grid>
                                    <Grid item xs={'auto'} lg={'auto'}>
                                        <CardComp title="Messaging" cardName="PATIENT'S QUERIES" details={queries} image={messageImage} hrf='/admin/message'></CardComp>
                                    </Grid>
                                </Grid>
                            </Box>
                        </div>
                    );
                }
                else {
                    return (
                        <Typography variant="h5" component="h1">
                            <NavLink to='/'>Please Login Using Admin Login Credentials</NavLink>
                        </Typography>
                    );
                }

            })()}
        </div>
    );
}

export default AdminDashboard;
