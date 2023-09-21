import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Snackbar, Card, CardContent, Typography, Grid, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { NavLink } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import UpdateIcon from '@mui/icons-material/Update';
import SendIcon from '@mui/icons-material/Send';

const AcceptedAppointments = () => {
    const role = sessionStorage.getItem('role');

    const [details, setDetails] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [objToAccept, setobjToAccept] = useState('');
    const [formValue, setFormValue] = useState('');

    useEffect(() => {

        fetchDetails();

    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.post('http://localhost:8084/appointments/acceptedRequests', {
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

    const openDialog = (appointment) => {
        // Set the ID of the appointment to accept in the state
        setobjToAccept(appointment);

        setOpenUpdateDialog(true);
    };

    const closeDialog = () => {
        setOpenUpdateDialog(false);
        setFormValue('');
    };

    const handleFormChange = (event) => {
        setFormValue(event.target.value);
    };

    const handleUpdate = async () => {
        // Handle saving the updated patient records
        console.log("Value : " + formValue);
        const appointment = objToAccept;
        appointment.patientRecord = formValue;

        try {

            const response = await axios.post('http://localhost:8084/appointments/updatePatientRecord', appointment);

            const responseData = await response.data;

            if (responseData.message === "Patient Record Updated Successfully") {
                setAlertMessage(responseData.message);
                setShowSuccess(true);

                // Close the dialog after saving
                closeDialog();
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
    };

    const handleAcceptConfirmation = async () => {
        // Logic for accepting the appointment
        console.log(`Accepted appointment with ID: ${objToAccept}`);

        try {

            const response = await axios.post('http://localhost:8084/appointments/treatmentOver', objToAccept);

            const responseData = await response.data;

            if (responseData.message === "Confirmation Sent Successfully") {
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
    };  

    const handleAccept = (appointment) => {
        // Set the ID of the appointment to accept in the state
        setobjToAccept(appointment);

        // Show the confirmation dialog
        setOpenConfirmationDialog(true);
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
                                                                    <Button variant="contained" startIcon={<UpdateIcon />} onClick={() => openDialog(detail)} sx={{ marginRight: 1, '&:hover': { backgroundColor: '#ffffff', color: '#4caf50' } }}>
                                                                        Update Patient Records
                                                                    </Button>
                                                                    <Button variant="contained" startIcon={<SendIcon />} onClick={() => handleAccept(detail)} sx={{ backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#ffffff', color: '#f44336' } }}>
                                                                        Send Confirmation
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
                            <Dialog open={openConfirmationDialog} onClose={() => setOpenConfirmationDialog(false)}>
                                <DialogTitle>Confirmation!</DialogTitle>
                                <DialogContent>
                                    We believe you have updated Patient Record. If not, update  that before sending this, or else you cannot update that later.
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
                            <Dialog open={openUpdateDialog} onClose={closeDialog}>
                                <DialogTitle>Update Patient Records</DialogTitle>
                                <DialogContent style={{ width: '35vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                                    {/* <div style={{ height: '100%' }}> */}
                                    {/* <div style={{ flexGrow: 1 }}> */}
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        label="Enter Record Here"
                                        value={formValue}
                                        onChange={handleFormChange}
                                        multiline
                                        fullWidth
                                        rows={20}
                                    />
                                    {/* </div> */}
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="outlined" onClick={closeDialog}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" onClick={handleUpdate}>
                                        Save
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Fragment>
                    );
                }
                else {
                    return (
                        <Typography variant="h5" component="h1">
                            <NavLink to='/'>Please Login Using Doctor Login Credentials</NavLink>
                        </Typography>
                    );
                }
            })()}
        </Fragment>
    );
};

export default AcceptedAppointments;
