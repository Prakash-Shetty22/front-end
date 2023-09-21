// import React from "react"

// export default function AppointmentStatus () {
//     return <div>Status</div>
// }

import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import Divider from '@mui/material/Divider';
import { Snackbar, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { NavLink } from 'react-router-dom';
import AppointmentStatusCard from './AppointmentStatusCard';
import Header from '../mui/Header';

const AppointmentStatus = () => {
    const role = sessionStorage.getItem('role');

    const [details, setDetails] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {

        const fetchDetails = async () => {
            try {
                const response = await axios.post('http://localhost:8084/appointments/doctorApproval', {
                    mobileNumber: sessionStorage.getItem('mobileNumber')
                });

                setDetails(response.data);

                // Convert the objects to strings using JSON.stringify()
                const offenceDataAsString = response.data.map(obj => JSON.stringify(obj));

                // Display the offence data as strings
                console.log("Rows:", offenceDataAsString.join(", "));

            } catch (error) {
                // console.error('Error fetching data:', error);
                setErrorMessage("There is some problem with fetching the Status");
                setShowError(true);
            }
        };

        fetchDetails();

    }, [showSuccess]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowSuccess(false);
    };

    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowError(false);
    };

    const sortedDetails = details.sort((a, b) => {
        // Convert the date and time strings to Date objects for comparison
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);

        // Compare the dates and times
        if (dateA < dateB) {
            return -1;
        } else if (dateA > dateB) {
            return 1;
        } else {
            return 0;
        }
    });

    return (
        <Fragment>
            {(() => {
                if (role === 'Admin') {
                    return (
                        <Fragment>
                            <Header username={sessionStorage.getItem('username')} path="/admin"/>
                            <Snackbar open={showSuccess} autoHideDuration={6000} onClose={handleSnackbarClose}>
                                <MuiAlert onClose={handleSnackbarClose} severity="success" variant="filled">
                                    {alertMessage}
                                </MuiAlert>
                            </Snackbar>
                            <Snackbar open={showError} autoHideDuration={6000} onClose={handleErrorClose}>
                                <MuiAlert onClose={handleErrorClose} severity="error" variant="filled">
                                    {errorMessage}
                                </MuiAlert>
                            </Snackbar>
                            <Typography sx={{marginTop: 3}} variant="h5" component="h1">
                                Appointment Status
                            </Typography>
                            {(() => {
                                if (details.length > 0) {
                                    return (
                                        <Fragment>
                                            {sortedDetails.map((detail, index) => (
                                                <Fragment key={index} >
                                                    {console.log("key: " + index + " data : " + detail)}
                                                    <AppointmentStatusCard key={index} data={detail} setShowSuccess={setShowSuccess} setAlertMessage={setAlertMessage}/>
                                                    <Divider />
                                                </Fragment>
                                            ))}
                                        </Fragment>
                                    );
                                }
                                else {
                                    return (<div>No Appointment Status Found</div>);
                                }
                            })()}
                        </Fragment>
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
        </Fragment>
    );
};

export default AppointmentStatus;
