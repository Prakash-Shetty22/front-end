import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import Divider from '@mui/material/Divider';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import CompletedAppointmentsCard from './CompletedAppointmentsCard';

const CompletedAppointments = () => {

    const [details, setDetails] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {

        const fetchDetails = async () => {
            try {
                const response = await axios.post('http://localhost:8084/appointments/completed', {
                    mobileNumber: sessionStorage.getItem('mobileNumber')
                });

                setDetails(response.data);

                // Convert the objects to strings using JSON.stringify()
                const offenceDataAsString = response.data.map(obj => JSON.stringify(obj));

                // Display the offence data as strings
                console.log("Rows:", offenceDataAsString.join(", "));

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchDetails();

    }, []);

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

        // // Compare the dates and times
        // if (dateA < dateB) {
        //     return -1;
        // } else if (dateA > dateB) {
        //     return 1;
        // } else {
        //     return 0;
        // }

        // Compare the dates and times
        if (dateA > dateB) {
            return -1;
        } else if (dateA < dateB) {
            return 1;
        } else {
            return 0;
        }
    });

    return (
        <Fragment>
            <Snackbar open={showError} autoHideDuration={6000} onClose={handleErrorClose}>
                <MuiAlert onClose={handleErrorClose} severity="error" variant="filled">
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
            {(() => {
                if (details.length > 0) {
                    return (
                        <Fragment>
                            {sortedDetails.map((detail, index) => (
                                <Fragment key={index} >
                                    <CompletedAppointmentsCard key={index} data={detail}/>
                                    <Divider />
                                </Fragment>
                            ))}
                        </Fragment>
                    );
                }
                else {
                    return (<div>You've not completed any Appointment yet.</div>);
                }
            })()}
        </Fragment>
    );
};

export default CompletedAppointments;
