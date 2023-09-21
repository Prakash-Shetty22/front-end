import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Snackbar, Card, CardContent, Typography, Grid, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { NavLink } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const ReceivedRequests = () => {
    const role = sessionStorage.getItem('role');

    const [details, setDetails] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [openDeclinationDialog, setOpenDeclinationDialog] = useState(false);
    const [objToAccept, setobjToAccept] = useState('');

    useEffect(() => {

        fetchDetails();

    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.post('http://localhost:8084/appointments/doctorsRequests', {
                mobileNumber: sessionStorage.getItem('mobileNumber')
            });

            // const data = await response.data;

            setDetails(response.data);

            // Convert the objects to strings using JSON.stringify()
            const offenceDataAsString = response.data.map(obj => JSON.stringify(obj));

            // Display the offence data as strings
            console.log("Rows:", offenceDataAsString.join(", "));

        } catch (error) {
            // console.error('Error fetching data:', error);
            setErrorMessage("There is some problem with fetching the Requests");
            setShowError(true);
        }
    };

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

    const handleAcceptConfirmation = async () => {
        // Logic for accepting the appointment
        console.log(`Accepted appointment with ID: ${objToAccept}`);

        try {
        
            const response = await axios.post('http://localhost:8084/appointments/acceptRequest', objToAccept);

            const responseData = await response.data;

            if (responseData.message === "Appointment Accepted Successfully") {
                setAlertMessage(responseData.message);
                setShowSuccess(true);
                setOpenConfirmationDialog(false);
                fetchDetails();
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

        // // Show success message and reset confirmation state
        // setAlertMessage('Appointment accepted successfully');
        // setShowSuccess(true);
        // // setShowConfirmation(false);
        // setOpenConfirmationDialog(false);
    };

    // const handleCancelConfirmation = () => {
    //     // Reset confirmation state to false
    //     setShowConfirmation(false);
    //     setOpenConfirmationDialog(false);
    // };

    const handleDeclineConfirmation = async () => {
        // Logic for accepting the appointment
        console.log(`Declined appointment with ID: ${objToAccept}`);

        try {
        
            const response = await axios.post('http://localhost:8084/appointments/declineRequest', objToAccept);

            const responseData = await response.data;

            if (responseData.message === "Appointment Declined Successfully") {
                setAlertMessage(responseData.message);
                setShowSuccess(true);
                setOpenDeclinationDialog(false);
                fetchDetails();
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

        // // Show success message and reset confirmation state
        // setAlertMessage('Appointment declined successfully');
        // setShowSuccess(true);
        // setOpenDeclinationDialog(false);
    };

    const handleAccept = (appointment) => {
        // Set the ID of the appointment to accept in the state
        setobjToAccept(appointment);

        // Show the confirmation dialog
        // setShowConfirmation(true);
        setOpenConfirmationDialog(true);
    };

    const handleDecline = (appointment) => {
        // Set the ID of the appointment to accept in the state
        setobjToAccept(appointment);

        // Show the confirmation dialog
        setOpenDeclinationDialog(true);
    };

    return (
        <Fragment>
            {(() => {
                if (role === 'Doctor') {
                    return (
                        <Fragment>
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
                            {(() => {
                                if (details.length > 0) {
                                    return (
                                        <Card>
                                            <CardContent>
                                                {/* <Typography variant="h5" component="div">
                                            Appointment List
                                          </Typography> */}
                                                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                                                    {sortedDetails.map(detail => (
                                                        <Grid item xs={12} key={detail.id}>
                                                            <Card variant="outlined" sx={{ backgroundColor: "#F2F2F2", color: "#333333" }}>
                                                                <CardContent>
                                                                    <Typography variant="body1">
                                                                        Date: {detail.date}
                                                                    </Typography>
                                                                    <Typography variant="body1">
                                                                        Time: {detail.time}
                                                                    </Typography>
                                                                    <Typography variant="body1">
                                                                        Patient Name: {detail.patient.fullName}
                                                                    </Typography>
                                                                    <Typography variant="body1">
                                                                        Mobile Number: {detail.patient.mobileNumber}
                                                                    </Typography>
                                                                    <Button variant="contained" startIcon={<CheckIcon />} onClick={() => handleAccept(detail)} sx={{ marginRight: 1, '&:hover': { backgroundColor: '#4caf50', color: '#fff' } }}>
                                                                        Accept
                                                                    </Button>
                                                                    <Button variant="contained" startIcon={<CloseIcon />} onClick={() => handleDecline(detail)} sx={{ backgroundColor: '#f44336', color: '#fff', '&:hover': { backgroundColor: '#d32f2f' } }}>
                                                                        Decline
                                                                    </Button>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    );
                                }
                                else {
                                    return (<div>No Appointment Requests Found</div>);
                                }
                            })()}
                            {/* {showConfirmation && (
                                <Snackbar open={showConfirmation} autoHideDuration={6000}>
                                    <MuiAlert severity="warning" variant="filled">
                                        Are you sure you want to accept this appointment?
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleAcceptConfirmation}
                                            sx={{ marginLeft: 2 }}
                                        >
                                            Confirm
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleCancelConfirmation}
                                        >
                                            Cancel
                                        </Button>
                                    </MuiAlert>
                                </Snackbar>
                            )} */}
                            <Dialog open={openConfirmationDialog} onClose={() => setOpenConfirmationDialog(false)}>
                                <DialogTitle>Confirm Acceptance</DialogTitle>
                                <DialogContent>
                                    Are you sure you want to accept this appointment?
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="outlined" onClick={handleAcceptConfirmation}>
                                        Confirm
                                    </Button>
                                    <Button variant="outlined" onClick={() => setOpenConfirmationDialog(false)}>
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Dialog open={openDeclinationDialog} onClose={() => setOpenDeclinationDialog(false)}>
                                <DialogTitle>Confirm Declination</DialogTitle>
                                <DialogContent>
                                    Are you sure you want to decline this appointment?
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="outlined" onClick={handleDeclineConfirmation}>
                                        Confirm
                                    </Button>
                                    <Button variant="outlined" onClick={() => setOpenDeclinationDialog(false)}>
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
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

export default ReceivedRequests;
