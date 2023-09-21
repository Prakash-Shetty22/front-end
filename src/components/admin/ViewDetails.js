import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import SelectLabels from '../mui/Select';
import BasicTextField from '../mui/BasicTextField';
import Report from '../../images/report2.svg';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import '../mui/BasicTextField.css';
import './ViewDetails.css';
import { Typography, Autocomplete, Divider } from '@mui/material';
import CompletedAppointmentsCard from '../patient/CompletedAppointmentsCard';
import { NavLink } from 'react-router-dom';
import ViewDetailsCard from './ViewDetailsCard';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Header from '../mui/Header';


function ViewDetails() {
    const role = sessionStorage.getItem('role');

    const [doctorsList, setDoctorsList] = useState([]);
    const [rows, setRows] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        // Function to fetch data using Axios
        const fetchData = async () => {
            try {
                const response1 = await axios.post('http://localhost:8082/doctor/getBasedOnHospital', {
                    mobileNumber: sessionStorage.getItem('mobileNumber')
                });

                // setDoctorsList(response.data);

                // response1.data.map((doctor) => {
                //     console.log(doctor.fullName);
                //     setDoctorsList([...doctorsList, doctor.fullName]);
                // })
                const names = response1.data.map(doctor => doctor.fullName);
                setDoctorsList(names);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        const fetchDetails = async () => {
            try {
                const response = await axios.post('http://localhost:8084/appointments/completedOfHospital', {
                    mobileNumber: sessionStorage.getItem('mobileNumber')
                });

                setRows(response.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchDetails();

    }, []);



    const menuLists = [
        { id: 0, name: "Patient" },
        { id: 1, name: "Doctor" },
        { id: 2, name: "Date" }
    ];

    const [basedOn, setBasedOn] = React.useState('');
    const [mobileNo, setMobileNo] = React.useState('');
    const [doctorName, setDoctorName] = React.useState('');
    const [imageShow, setImageShow] = React.useState(true);
    // const [showAlert, setShowAlert] = React.useState(false);
    const [sortedRows, setSortedRows] = React.useState([]);
    const [date, setDate] = React.useState('');
    const [disableSearch, setDisableSearch] = React.useState(true);

    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowError(false);
    };

    const handleChange = (event) => {
        setBasedOn(event.target.value);
        setMobileNo('');
        setDate('');
        setImageShow(true);
        // setShowAlert(false);
    };

    const handleDoctorName = (event, value) => {
        // console.log("Value: " + event.target.value);
        // console.log("Doctor : " + doctorsList[event.target.value]);
        console.log("Doctors Name: " + value);
        if (typeof event.target.value === 'number') {


            // let row = rows.filter(row => row.doctor.fullName === doctorsList[event.target.value]);
            let row = rows.filter(row => row.doctor.fullName === value);
            if (row.length > 0) {
                setImageShow(false);
                // setShowAlert(false);
                setSortedRows(row);
            }
            else {
                setImageShow(true);
                // setShowAlert(true);
                setErrorMessage("No Appointments Found");
                setShowError(true);
                setSortedRows([]);
            }
        }
        else {
            setImageShow(true);
            setSortedRows([]);
        }
    };

    const handleDate = (event) => {
        let row = rows.filter(row => Date.parse(row.date) === Date.parse(date));
        if (row.length > 0) {
            setImageShow(false);
            // setShowAlert(false);
            setSortedRows(row);
        }
        else {
            setImageShow(true);
            // setShowAlert(true);
            setErrorMessage("No Appointments Found");
            setShowError(true);
            setSortedRows([]);
        }
    };

    const changeDate = (event) => {
        setDate(event.target.value);
        if (event.target.value.length > 0) {
            setDisableSearch(false);
        }
    };

    const handleMobileNumber = (event) => {

        let regex = new RegExp(/^(\d{10})$/);

        if (regex.test(mobileNo) === true) {
            let row = rows.filter(row => row.patient.mobileNumber == mobileNo);
            if (row.length > 0) {
                setImageShow(false);
                // setShowAlert(false);
                setSortedRows(row);
            }
            else {
                setImageShow(true);
                // setShowAlert(true);
                setErrorMessage("No Appointments Found");
                setShowError(true);
                setSortedRows([]);
            }
        }
        else {
            // alert("Please Enter Valid Mobile Number");
            setImageShow(true);
            // setShowAlert(true);
            setErrorMessage("Please Enter Valid Mobile Number");
            setShowError(true);
            setSortedRows([]);
        }
    };

    const sortedDetails = sortedRows.sort((a, b) => {
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
                if (role === 'Admin') {
                    return (
                        <Fragment>
                            <Header username={sessionStorage.getItem('username')} path="/admin" />
                            <Typography sx={{ marginTop: 3 }} variant="h5" component="h1">
                                View Details
                            </Typography>
                            {/* <Header>Report Generation</Header> */}
                            <SelectLabels label="Based On" value={basedOn} onChange={handleChange} lists={menuLists} />
                            {(() => {
                                if (basedOn === 0) {
                                    return <div>
                                        {/* <BasicTextField id={menuLists.find(({ id }) => id === basedOn).name} label={menuLists.find(({ id }) => id === basedOn).name}
                                            onChange={e => setMobileNo(e.target.value)} /> */}
                                        <BasicTextField id={menuLists.find(({ id }) => id === basedOn).name} label={"Enter Mobile Number"}
                                            onChange={e => setMobileNo(e.target.value)} />
                                        <Button variant="contained" sx={{ backgroundColor: '#8a2b06', marginLeft: '10px', height: '55px' }} onClick={handleMobileNumber}>
                                            Search
                                        </Button>
                                    </div>
                                } else if (basedOn === 1) {
                                    return (
                                        <Autocomplete
                                            options={doctorsList}
                                            onChange={handleDoctorName}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Enter Doctor Name" sx={{ width: '20vw' }} />
                                            )}
                                        />
                                    );
                                    // return <SelectLabels label="Vehicle Type" value={vehicleType} onChange={handleVehicleType} lists={vehicleTypes} />;
                                } else if (basedOn === 2) {
                                    let currentDate = new Date().toLocaleDateString('en-GB', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                    }).split('/').reverse().join('-');
                                    return <div>
                                        <TextField
                                            label="Select Date"
                                            type="date"
                                            value={date}
                                            inputProps={{ max: currentDate }}
                                            onChange={changeDate}
                                            InputLabelProps={{ shrink: true }}
                                            className="textField"
                                        />
                                        <Button variant="contained" sx={{ backgroundColor: '#8a2b06', marginLeft: '10px', height: '56px' }} disabled={disableSearch} onClick={handleDate}>Search</Button>
                                    </div>
                                }
                            })()}
                            {imageShow ? <div className="remaining-height">
                                <img src={Report} alt='Choose Your Input' />
                            </div> :
                                <Fragment>
                                    {sortedDetails.map((detail, index) => (
                                        <Fragment key={index} >
                                            {/* <CompletedAppointmentsCard  /> */}
                                            <ViewDetailsCard key={index} data={detail} />
                                            <Divider />
                                        </Fragment>
                                    ))}
                                </Fragment>
                            }
                            {/* {(() => {
                                if (showAlert === true) {
                                    alert("No Offence Found");
                                    setShowAlert(false);
                                }
                            })()} */}
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
}

export default ViewDetails;
