import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Box } from '@mui/material';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

const AddAvailability = () => {
    const [dateField, setDateField] = useState('');
    const [timeField, setTimeField] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowSnackbar(false);
    };

    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowError(false);
    };

    let currentDate = new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).split('/').reverse().join('-');

    // Function to get current time in format HH:mm
    function getCurrentTime() {
        const currentDate = new Date();
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // const handleAdd = (event) => {
    //     event.preventDefault();
    //     console.log("Selected date : " + dateField);
    //     console.log("Selected time : " + timeField);
    // };
    const handleAdd = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8082/doctor/availability', {
                mobileNumber: sessionStorage.getItem('mobileNumber'),
                date: dateField,
                time: timeField
            });

            // Handle successful response
            // setAlertMessage(response.data.message);
            // setShowSnackbar(true);

            // Clear the form fields
            if (response.data.message === "Availability added successfully") {
                setDateField('');
                setTimeField('');
                setAlertMessage(response.data.message);
                setShowSnackbar(true);
            }
            else {
                setErrorMessage(response.data.message);
                setShowError(true);
            }
        } catch (error) {
            // Handle error response
            // console.error(error);
            setErrorMessage('Failed to add availability.');
            setShowError(true);
        }
    };

    return (
        <Container
            component="main"
            maxWidth="lg"
            sx={{
                backgroundImage: "url('/images/availability_bg2.jpg')",
                backgroundSize: 'auto 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center', // Center the image both vertically and horizontally
                height: '69vh', // Use 100vh to ensure the entire viewport height is covered
                width: '100vw', // Use 100vw to ensure the entire viewport width is covered
                display: 'flex', // Use flex to center content vertically
                justifyContent: 'center', // Center content horizontally
                alignItems: 'center top', // Center content vertically
                overflow: 'hidden', // Hide any overflow content
            }}
        >
            <Container component="main" maxWidth="xs" sx={{ marginLeft: '50%'}}>
                <Paper sx={{ marginTop: 5, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 7, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                    <Box component="form" onSubmit={handleAdd} sx={{ mt: 0 }}>
                        {/* <TextField
                        id="full-name"
                        label="Full Name"
                        fullWidth
                        margin="normal"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    /> */}
                        <TextField
                            required
                            fullWidth
                            id="Date"
                            helperText="Select Date"
                            type='date'
                            value={dateField}
                            inputProps={{ min: currentDate }}
                            onChange={(e) => setDateField(e.target.value)}
                        />
                        <TextField
                            required
                            fullWidth
                            id="Time"
                            helperText="Select Time Slot"
                            type='time'
                            value={timeField}
                            onChange={(e) => setTimeField(e.target.value)}
                            inputProps={{ min: (dateField === currentDate) ? getCurrentTime() : null }}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, '&:hover': { backgroundColor: '#4caf50', color: '#fff' } }}>
                            Add
                        </Button>
                    </Box>
                </Paper>
                <Snackbar open={showError} autoHideDuration={6000} onClose={handleErrorClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <MuiAlert onClose={handleErrorClose} severity="error" variant="filled">
                        {errorMessage}
                    </MuiAlert>
                </Snackbar>
                <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <MuiAlert onClose={handleSnackbarClose} severity="success" variant="filled">
                        {alertMessage}
                    </MuiAlert>
                </Snackbar>
            </Container>
        </Container>
    );
};

export default AddAvailability;
