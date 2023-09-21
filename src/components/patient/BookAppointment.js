import { Autocomplete, Button, TextField, Typography, Container, Paper, Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import SortedDoctors from './SortedDoctors';

const specialties = [
    'Internal medicine',
    'Family medicine',
    'Pediatrics',
    'Orthopedics',
    'Urology',
    'Neurology',
    'Obstetrics and gynaecology',
    'Psychiatry',
    'General practitioner',
    'Ophthalmology',
    'Dermatology',
    'Gastroenterology',
    'Pathology',
    'Emergency medicine',
    'General surgery',
    'Urologist',
    'Surgeon',
    'Cardiology',
    'Neurosurgery',
    'Otorhinolaryngology',
    'Oncology',
    'Pediatrician',
    'Anesthesiology',
    'Geriatrics'
];

// const locations = [
//     'New York',
//     'San Francisco',
//     'London',
//     'Tokyo',
// ];

const BookAppointment = () => {
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locations, setLocations] = useState([]);
    const [sortedDoctors, setSortedDoctors] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowSnackbar(false);
    };

    const handleSuccessClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowSuccess(false);
    };

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('http://localhost:8083/hospital/locations');
                setLocations(response.data);

                // // Convert the objects to strings using JSON.stringify()
                // const offenceDataAsString = response.data.map(obj => JSON.stringify(obj));

                // // Display the offence data as strings
                // console.log("Offence Data:", offenceDataAsString.join(", "));

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchLocations();

    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (selectedSpecialty && selectedLocation) {
            console.log('Perform search'); // Replace with your logic to perform search

            try {
                const response = await axios.post('http://localhost:8082/doctor/sorted', {
                    selectedLocation,
                    selectedSpecialty
                });

                const data = await response.data;

                console.log(data);
                setSortedDoctors(data);

                if (data.length === 0) {
                    setAlertMessage('There is no Doctors available with that Specialization in that Location');
                    setShowSnackbar(true);
                }

                // // Handle successful response
                // setAlertMessage(response.data.message);
                // setShowSnackbar(true);

                // // Clear the form fields
                // if (response.data.message === "Availability added successfully") {
                //     setDateField('');
                //     setTimeField('');
                // }
            } catch (error) {
                // Handle error response
                console.error(error);
                setAlertMessage('Failed to fetch Doctors.');
                setShowSnackbar(true);
            }
        } else {
            // console.log('Please select both specialty and location');
            setAlertMessage('Please select both specialty and location');
            setShowSnackbar(true);
        }
    };

    return (
        // <Container component="main" maxWidth="xs">
        <React.Fragment>
            {(() => {
                if (sortedDoctors.length > 0) {
                    return (
                        <Container component="main" maxWidth="md">
                            <SortedDoctors setSortedDoctors={setSortedDoctors} data={sortedDoctors} selectedSpecialty={selectedSpecialty} selectedLocation={selectedLocation}
                                setSuccessMessage={setSuccessMessage} setShowSuccess={setShowSuccess} />
                        </Container>);
                }
                else {
                    return (
                        // <Container component="main" maxWidth="xs" sx={{ backgroundImage: 'url("C:/Users/prakash.shetty/Documents/Full Stack Training/29. Capstone Project/Front-end/automation-of-doctor-appointmnet/src/images/welcome2.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        // <Container component="main" maxWidth="lg" sx={{ backgroundImage: "url('/images/stethoscope.jpg')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center top', height: '100%', width: '150vh' }}>
                        <Container
                            component="main"
                            maxWidth="lg"
                            sx={{
                                backgroundImage: "url('/images/stethoscope3.jpg')",
                                // backgroundSize: 'cover',
                                // backgroundSize: 'contain',
                                backgroundSize: 'auto 100%',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center', // Center the image both vertically and horizontally
                                height: '75vh', // Use 100vh to ensure the entire viewport height is covered
                                width: '120vw', // Use 100vw to ensure the entire viewport width is covered
                                display: 'flex', // Use flex to center content vertically
                                justifyContent: 'center', // Center content horizontally
                                alignItems: 'center top', // Center content vertically
                                overflow: 'hidden', // Hide any overflow content
                            }}
                        >
                            <Container component="main" maxWidth="xs" sx={{ marginLeft: '50%', marginTop: 10}}>
                                <Paper sx={{ marginTop: 5, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 7, backgroundColor: 'rgba(255, 255, 255, 0)' }}>
                                    <Box component="form" onSubmit={handleSearch} sx={{ mt: 0, width: '100%' }}>

                                        <Autocomplete
                                            options={specialties}
                                            onChange={(event, value) => setSelectedSpecialty(value)}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Specialization" fullWidth />
                                            )}
                                        />

                                        <br />

                                        <Autocomplete
                                            options={locations}
                                            onChange={(event, value) => setSelectedLocation(value)}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Location" fullWidth />
                                            )}
                                        />

                                        <br />

                                        {/* <Button variant="contained" onClick={handleSearch}>
                            Search
                        </Button> */}
                                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, '&:hover': { backgroundColor: '#4caf50', color: '#fff' } }}>
                                            Search
                                        </Button>
                                    </Box>
                                </Paper>
                                <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                                    <MuiAlert onClose={handleSnackbarClose} severity="error" variant="filled">
                                        {alertMessage}
                                    </MuiAlert>
                                </Snackbar>
                                <Snackbar open={showSuccess} autoHideDuration={6000} onClose={handleSuccessClose}>
                                    <MuiAlert onClose={handleSuccessClose} severity="success" variant="filled">
                                        {successMessage}
                                    </MuiAlert>
                                </Snackbar>
                            </Container>
                        </Container>
                    );
                }
            })()}
        </React.Fragment>
    );
};

export default BookAppointment;
