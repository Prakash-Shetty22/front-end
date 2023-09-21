import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Tab, Tabs, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import Divider from '@mui/material/Divider';
import { green } from '@mui/material/colors';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import ClearIcon from '@mui/icons-material/Clear';
import Link from '@mui/material/Link';
import { Route, Router, Routes, useNavigate } from 'react-router-dom';
import PatientChat from '../messaging/PatientChat';

export default function RequestStatusCard({ data, setShowSuccess, setAlertMessage }) {
    // export default function RequestStatusCard() {

    // const data = {
    //     doctor: {
    //         fullName: "Sachin",
    //         specialization: "Dermatology",
    //         age: 45,
    //         gender: "Male",
    //         fee: 350,
    //         hospital: {
    //             name: "Vinaya Hospital",
    //             location: "Kundapura",
    //             admin: {
    //                 mobileNumber: "9876543216",
    //                 fullName: "Omar"
    //             }
    //         }
    //     },
    //     specialization: "Dermatology",
    //     requestStatus: "Requested",
    //     date: "2023-08-09",
    //     time: "10:15"
    // };

    const navigate = useNavigate();

    const sortDates = () => {
        // Convert the objects to strings using JSON.stringify()
        const offenceDataAsString = JSON.stringify(availability);

        // Display the offence data as strings
        console.log("Availability :", offenceDataAsString);

        // return data.doctor.availability
        return Object.entries(availability)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(([date]) => date);
    };

    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
    const [showAvailability, setShowAvailability] = useState(false);
    // const [selectedDate, setSelectedDate] = useState(sortDates()[0] || null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedChip, setSelectedChip] = useState(null);
    const [availability, setAvailability] = useState({});

    const { fullName, specialization, age, gender, fee, hospital } = data.doctor;
    const { name, location, admin } = hospital;
    const { mobileNumber, fullName: adminFullName } = admin;

    const handleClick = () => {
        console.log("Inside handle click");
        navigate('/start-conversation', { state: { actor1: sessionStorage.getItem('mobileNumber'), actor2: mobileNumber, hospitalName: name, } });
    };

    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowError(false);
    };

    const renderButtons = () => {
        // if (data.requestStatus === 'Declined') {
        if (data.sentToPatient === true && ((data.requestStatus === 'Declined' && !data.reschedulingRequest) || (data.reschedulingRequest && data.reschedulingStatus === 'Declined'))) {
            return <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={handleRemove} sx={{ color: '#fff', backgroundColor: '#f44336', '&:hover': { color: '#f44336', backgroundColor: '#fff' } }}>Remove</Button>;
        } else {
            return <Button variant="contained" color="primary" startIcon={<ClearIcon />} onClick={handleCancel} sx={{ color: '#fff', backgroundColor: '#f44336', '&:hover': { color: '#f44336', backgroundColor: '#fff' } }}>Cancel</Button>;
        }
    };

    const handleTabChange = (event, newValue) => {
        setSelectedDate(newValue);
        setSelectedChip(null); // Reset selected chip when tab changes
    };

    const chipStyles = {
        marginRight: '5px',
        marginBottom: '5px',
        cursor: 'pointer',
    };

    const selectedChipStyles = {
        ...chipStyles,
        backgroundColor: 'lightblue',
    };

    const sortTimes = () => {
        if (selectedDate) {
            const sortedTimes = Object.entries(availability[selectedDate])
                .filter(([_, status]) => status === 'vacant')
                .sort((a, b) => new Date(`1970-01-01 ${a[0]}`) - new Date(`1970-01-01 ${b[0]}`))
                .map(([time]) => time);

            return sortedTimes;
        }

        return [];
    };

    const handleCancelConfirmation = async () => {

        try {

            const response = await axios.post('http://localhost:8084/appointments/cancel', data);

            const responseData = await response.data;

            if (responseData.message === "Canceled Successfully") {
                setOpenCancelDialog(false);
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
    };

    const handleRemoveConfirmation = async () => {

        try {

            const response = await axios.post('http://localhost:8084/appointments/remove', data);

            const responseData = await response.data;

            if (responseData.message === "Removed Successfully") {
                setOpenRemoveDialog(false);
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
    };

    const handleCancel = async () => {
        setOpenCancelDialog(true);
    }

    const handleRemove = async () => {
        setOpenRemoveDialog(true);
    }

    const handleReschedule = async () => {
        try {
            const response = await axios.post('http://localhost:8082/doctor/getAvailability', {
                mobileNumber: data.doctor.mobileNumber
            });

            setAvailability(response.data);

            console.log(response.data);

            setShowAvailability(!showAvailability);
            const tempSort = () => {
                return Object.entries(response.data)
                    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
                    .map(([date]) => date);
            }
            setSelectedDate(tempSort()[0] || null);
            setSelectedChip(null);

        } catch (error) {
            // Handle error response
            console.error(error);
            setErrorMessage('Failed to Fetch availabilities.');
            setShowError(true);
        }
    }

    const handleBook = async () => {
        if (selectedChip != null) {
            console.log("Date : " + selectedDate);
            console.log("Time : " + selectedChip);
            console.log("Doctor number : " + data.doctor.mobileNumber);

            try {
                if (data.requestStatus === 'Accepted') {
                    const response = await axios.post('http://localhost:8084/appointments/add', {
                        mobileNumber: sessionStorage.getItem('mobileNumber'),
                        doctorNumber: data.doctor.mobileNumber,
                        specialization: data.specialization,
                        date: selectedDate,
                        time: selectedChip,
                        rescheduling: true,
                        createdDate: data.createdDate,
                        appointmentId: data.id,
                        oldDate: data.date,
                        oldTime: data.time
                    });

                    // Handle successful response

                    if (response.data.message === "Appointment Rescheduled Successfully") {
                        setShowAvailability(false);
                        setSelectedDate(null);
                        setSelectedChip(null);

                        setAlertMessage("Appointment Rescheduled Successfully");
                        setShowSuccess(true);
                    }
                    else {
                        setErrorMessage(response.data.message);
                        setShowError(true);
                    }
                }
                else {
                    const response = await axios.post('http://localhost:8084/appointments/add', {
                        mobileNumber: sessionStorage.getItem('mobileNumber'),
                        doctorNumber: data.doctor.mobileNumber,
                        specialization: data.specialization,
                        date: selectedDate,
                        time: selectedChip,
                        rescheduling: true,
                        createdDate: data.createdDate,
                        appointmentId: data.id
                    });

                    // Handle successful response

                    if (response.data.message === "Appointment Rescheduled Successfully") {
                        setShowAvailability(false);
                        setSelectedDate(null);
                        setSelectedChip(null);

                        setAlertMessage("Appointment Rescheduled Successfully");
                        setShowSuccess(true);
                    }
                    else {
                        setErrorMessage(response.data.message);
                        setShowError(true);
                    }
                }
            } catch (error) {
                // Handle error response
                console.error(error);
                setErrorMessage('Failed to book appointment.');
                setShowError(true);
            }
        }
        else {
            setErrorMessage('Please Choose any TimeSlot to Book the Appointment');
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
                <Grid container spacing={2}>
                    <Grid item xs={6} md={3} sx={{ textAlign: 'left', backgroundColor: '#FDFCDC' }}>
                        <Typography variant="h6" style={{ color: '#FF7171' }}>Appointment Details</Typography>
                        <Typography variant="body1" style={{ color: '#AD8BF0' }}>Date: {data.date}</Typography>
                        <Typography variant="body1" style={{ color: '#AD8BF0' }}>Time: {data.time}</Typography>
                        <Typography variant="body1" style={{ color: '#AD8BF0' }}>Status:{' '}
                            {(() => {
                                if (data.sentToPatient === true && ((data.requestStatus === 'Accepted' && !data.reschedulingRequest) || (data.reschedulingRequest && data.reschedulingStatus === 'Accepted'))) {
                                    return <span style={{ color: 'green' }}><b>Accepted</b></span>
                                }
                                else if (data.sentToPatient === true && ((data.requestStatus === 'Declined' && !data.reschedulingRequest) || (data.reschedulingRequest && data.reschedulingStatus === 'Declined'))) {
                                    return <span style={{ color: 'red' }}><b>Declined</b></span>
                                }
                                else {
                                    return <span style={{ color: 'blue' }}><b>Requested</b></span>
                                }
                            }
                            )()}
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

                    <Grid item xs={6} md={3} sx={{ textAlign: 'left', backgroundColor: '#D9FAFB' }}>
                        <Typography variant="h6" style={{ color: '#52B69A' }}>Hospital Details</Typography>
                        <Typography variant="body1" style={{ color: '#3AAFA9' }}>Name: {name}</Typography>
                        <Typography variant="body1" style={{ color: '#3AAFA9' }}>Location: {location}</Typography>
                    </Grid>

                    <Grid item xs={6} md={3} sx={{ textAlign: 'left', backgroundColor: '#FFFCDD' }}>
                        <Typography variant="h6" style={{ color: '#FFB800' }}>Contact Details</Typography>
                        <Typography variant="body1" style={{ color: '#FFB800' }}>Mobile Number: {mobileNumber}</Typography>
                        <Typography variant="body1" style={{ color: '#FFB800' }}>Name: {adminFullName}</Typography>
                        {/* #FFD700 */}
                        <Link
                            component="button"
                            variant="body2"
                            onClick={handleClick}
                        >
                            Start Conversation
                        </Link>

                        <Divider />
                        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center' }}>{/* Add space between Typography and buttons */}
                            <Button variant="contained" color="primary" startIcon={<UpdateIcon />} onClick={handleReschedule} sx={{ color: '#fff', backgroundColor: '#3f51b5', '&:hover': { color: '#3f51b5', backgroundColor: '#fff' } }}>Reschedule</Button>
                        </div>
                        {showAvailability && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Divider />
                                <Tabs
                                    value={selectedDate}
                                    onChange={handleTabChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example"
                                    // sx={{marginRight: '20px'}}
                                    sx={{
                                        maxWidth: "100%",
                                        overflowX: "auto",
                                    }}
                                >
                                    {sortDates().map((date) => (
                                        <Tab key={date} label={date} value={date} />
                                    ))}
                                </Tabs>
                                {selectedDate && (
                                    <React.Fragment>
                                        {/* <Box sx={{ marginLeft: 30, marginRight: 30 }}> */}
                                        <Box sx={{ border: "1px solid black", padding: "10px" }}>
                                            {sortTimes().length > 0 && ( sortTimes().map((time) => (
                                                <Chip
                                                    key={`${selectedDate}-${time}`}
                                                    label={time}
                                                    color="success"
                                                    variant="outlined"
                                                    sx={selectedChip === time ? selectedChipStyles : chipStyles}
                                                    onClick={() => setSelectedChip(time)}
                                                />
                                            )))}
                                            {sortTimes().length < 1 && <p style={{ color: 'red' }}>No Slot Available</p>}
                                        </Box>
                                        <Box sx={{ border: "1px solid black", padding: "10px" }}>
                                            <Button variant="contained" color="primary" onClick={handleBook} sx={{backgroundColor: '#007bff', color: '#fff', '&:hover': { backgroundColor: '#0056b3' }}}>
                                                Book
                                            </Button>
                                        </Box>
                                    </React.Fragment>
                                )}
                                {!selectedDate && <p style={{ color: 'red' }}>Doctor Is Not Available</p>}
                            </Box>
                        )}
                        {!showAvailability && (
                            <div style={{ marginTop: '5px', display: 'flex', justifyContent: 'center' }}>
                                {renderButtons()}
                            </div>
                        )}
                    </Grid>
                </Grid>
            </CardContent>
            <Dialog open={openRemoveDialog} onClose={() => setOpenRemoveDialog(false)}>
                <DialogTitle>Confirm Remove</DialogTitle>
                <DialogContent>
                    Are you sure you want to Remove this appointment?<br />If you remove it you will not be able to Reschedule it.
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleRemoveConfirmation}>
                        Confirm
                    </Button>
                    <Button variant="outlined" onClick={() => setOpenRemoveDialog(false)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
                <DialogTitle>Confirm Cancel</DialogTitle>
                <DialogContent>
                    Are you sure you want to Cancel this appointment?<br />If you cancel it you will not be able to Reschedule it.
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleCancelConfirmation}>
                        Confirm
                    </Button>
                    <Button variant="outlined" onClick={() => setOpenCancelDialog(false)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Card >
    );
}
