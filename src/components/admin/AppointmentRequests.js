import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import Divider from '@mui/material/Divider';
import AppointmentRequestsCard from './AppointmentRequestsCard';
import { Snackbar, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { NavLink } from 'react-router-dom';
import Header from '../mui/Header';

const AppointmentRequests = () => {
    const role = sessionStorage.getItem('role');

    const [details, setDetails] = useState([]);
    const [alertMessage, setAlertMessage] = useState('Appointment sent successfully');
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {

        const fetchDetails = async () => {
            try {
                const response = await axios.post('http://localhost:8084/appointments/requests', {
                    mobileNumber: sessionStorage.getItem('mobileNumber')
                });

                // const data = await response.data;

                setDetails(response.data);

                // // Convert the objects to strings using JSON.stringify()
                // const offenceDataAsString = response.data.map(obj => JSON.stringify(obj));

                // // Display the offence data as strings
                // console.log("Rows:", offenceDataAsString.join(", "));

            } catch (error) {
                // console.error('Error fetching data:', error);
                setErrorMessage("There is some problem with fetching the Requests");
                setShowError(true);
            }

            // axios.get(`/http://localhost:8084/appointments/getAll?mobileNumber=sessionStorage.getItem('mobileNumber')`)
            // axios.get(`/http://localhost:8084/appointments/getAll?mobileNumber=${sessionStorage.getItem('mobileNumber')}`)
            //     .then(response => {
            //         // Handle the response data, for example, store it in state
            //         setDetails(response.data);
            //     })
            //     .catch(error => {
            //         // Handle the error
            //         console.error(error);
            //     });
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
                            <Header username={sessionStorage.getItem('username')} path="/admin" />
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
                                Appointment Requests
                            </Typography>
                            {(() => {
                                if (details.length > 0) {
                                    return (
                                        <Fragment>
                                            {sortedDetails.map((detail, index) => (
                                                <Fragment key={index} >
                                                    {console.log("key: " + index + " data : " + detail)}
                                                    <AppointmentRequestsCard key={index} data={detail} setShowSuccess={setShowSuccess} />
                                                    <Divider />
                                                </Fragment>
                                            ))}
                                        </Fragment>
                                    );
                                }
                                else {
                                    return (<div>No Appointment Requests Found</div>);
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

export default AppointmentRequests;
