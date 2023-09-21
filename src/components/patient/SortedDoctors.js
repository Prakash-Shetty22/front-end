import { Box, Card, CardContent, Typography, Button, Tab, Tabs, Chip } from '@mui/material';
import GoBackButton from '../mui/GoBackButton';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import axios from 'axios';

const SortedDoctors = (props) => {

    const sortDates = (index) => {
        return Object.entries(props.data[index]?.availability)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(([date]) => date);
    };

    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    // const [selectedDate, setSelectedDate] = useState(sortDates()[0] || null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedChip, setSelectedChip] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowSnackbar(false);
    };

    const handleTabChange = (event, newValue) => {
        setSelectedDate(newValue);
        setSelectedChip(null); // Reset selected chip when tab changes
    };

    const chipStyles = {
        marginRight: '5px',
        marginBottom: '5px',
        marginTop: '5px',
        cursor: 'pointer',
    };

    const selectedChipStyles = {
        ...chipStyles,
        backgroundColor: 'lightblue',
    };

    // const chipStyles = {
    //     margin: 1,
    // };

    // const selectedChipStyles = {
    //     margin: 1,
    //     backgroundColor: 'rgba(0, 128, 0, 0.1)',
    //     borderColor: 'green',
    // };

    const sortTimes = (index) => {
        if (selectedDate) {
            const sortedTimes = Object.entries(props.data[index]?.availability[selectedDate])
                .filter(([_, status]) => status === 'vacant')
                .sort((a, b) => new Date(`1970-01-01 ${a[0]}`) - new Date(`1970-01-01 ${b[0]}`))
                .map(([time]) => time);

            return sortedTimes;
        }

        return [];
    };

    const handleBook = async () => {
        if (selectedChip != null) {
            console.log("Date : " + selectedDate);
            console.log("Time : " + selectedChip);
            console.log("Selected Index : " + selectedCardIndex);
            console.log("Doctor number : " + props.data[selectedCardIndex].mobileNumber);

            try {
                const response = await axios.post('http://localhost:8084/appointments/add', {
                    mobileNumber: sessionStorage.getItem('mobileNumber'),
                    // doctorNumber: Object.entries(props.data[selectedCardIndex]?.mobileNumber),
                    doctorNumber: props.data[selectedCardIndex].mobileNumber,
                    specialization: props.selectedSpecialty,
                    date: selectedDate,
                    time: selectedChip
                });

                // Handle successful response

                if (response.data.message === "Appointment Booked Successfully") {
                    props.setSortedDoctors([]);
                    props.setSuccessMessage("Appointment Booked Successfully");
                    props.setShowSuccess(true);
                }
                else {
                    setAlertMessage(response.data.message);
                    setShowSnackbar(true);
                }
            } catch (error) {
                // Handle error response
                console.error(error);
                setAlertMessage('Failed to book appointment.');
                setShowSnackbar(true);
            }
        }
        else {
            setAlertMessage('Please Choose any TimeSlot to Book the Appointment');
            setShowSnackbar(true);
        }
    }

    return (
        <div>
            <Typography variant="h5" component="h1" sx={{ marginTop: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 7, backgroundColor: '#1B9C85', color: '#090580' }}>
                Location : {props.selectedLocation}, Specialization : {props.selectedSpecialty}{<GoBackButton setSortedDoctors={props.setSortedDoctors} />}
            </Typography>
            {props.data.map((item, index) => (
                <Card key={index} sx={{ marginBottom: '10px', marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 7, backgroundColor: '#F1F0E8' }}>
                    <CardContent>
                        {console.log("Index : " + index)}
                        <Typography variant="h6">Dr. {item.fullName}</Typography>
                        <Typography variant="body1" color="textSecondary">
                            {item.hospital.name}, {item.hospital.location}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Age: {item.age}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Gender: {item.gender}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Specialization: {item.specialization}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Consultation Fees: {item.fee}
                        </Typography>
                        <Button variant="contained" sx={{'&:hover': { backgroundColor: '#ffffff', color: '#4caf50' }}} onClick={(e) => { setSelectedDate(sortDates(index)[0] || null); setSelectedCardIndex(index); setSelectedChip(null) }}>
                            Book Appointment
                        </Button>
                        {/* {(() => {
                            if (selectedCardIndex === index && props.data[index].Object.keys("availability").length > 0) {
                                return (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Divider />
                                        <Tabs
                                            value={selectedDate}
                                            onChange={handleTabChange}
                                            variant="scrollable"
                                            scrollButtons="auto"
                                            aria-label="scrollable auto tabs example"
                                        >
                                            {sortDates().map((date) => (
                                                <Tab key={date} label={date} value={date} />
                                            ))}
                                        </Tabs>
                                        {(() => {
                                            if (selectedDate &&
                                                props.data[index].Object.keys("availability").Object.keys(selectedDate).length > 0) {
                                                return (
                                                    <React.Fragment>
                                                        <Box sx={{ marginLeft: 30, marginRight: 30 }}>
                                                            {sortTimes(selectedCardIndex).map((time) => (
                                                                <Chip
                                                                    key={`${selectedDate}-${time}`}
                                                                    label={time}
                                                                    color="success"
                                                                    variant="outlined"
                                                                    sx={selectedChip === time ? selectedChipStyles : chipStyles}
                                                                    onClick={() => setSelectedChip(time)}
                                                                />
                                                            ))}
                                                        </Box>
                                                        <Button variant="contained" color="primary" onClick={handleBook}>
                                                            Book
                                                        </Button>
                                                    </React.Fragment>
                                                );
                                            }
                                            else {
                                                return <p>No Slot Available</p>
                                            }
                                        })()}
                                    </Box>
                                );
                            }
                            else {
                                return <p>No Slot Available</p>
                            }
                        })()} */}
                        {selectedCardIndex === index && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Divider />
                                <Tabs
                                    value={selectedDate}
                                    onChange={handleTabChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example"
                                >
                                    {sortDates(index).map((date) => (
                                        <Tab key={date} label={date} value={date} />
                                    ))}
                                </Tabs>
                                {selectedDate && (
                                    <React.Fragment>
                                        <Box sx={{ marginLeft: 30, marginRight: 30 }}>
                                            {sortTimes(selectedCardIndex).length > 0 && (sortTimes(selectedCardIndex).map((time) => (
                                                <Chip
                                                    key={`${selectedDate}-${time}`}
                                                    label={time}
                                                    color="success"
                                                    variant="outlined"
                                                    sx={selectedChip === time ? selectedChipStyles : chipStyles}
                                                    onClick={() => setSelectedChip(time)}
                                                />
                                            )))}
                                            {sortTimes(selectedCardIndex).length < 1 && <p style={{ color: 'red' }}>No Slot Available</p>}
                                        </Box>
                                        <Button variant="contained" color="primary" onClick={handleBook} sx={{backgroundColor: '#1B9C85','&:hover': { backgroundColor: '#ffffff', color: '#1B9C85' }}}>
                                            Book
                                        </Button>
                                    </React.Fragment>
                                )}
                                {!selectedDate && <p style={{ color: 'red' }}>Doctor Is Not Available</p>}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            ))}
            <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity="error" variant="filled">
                    {alertMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default SortedDoctors;
