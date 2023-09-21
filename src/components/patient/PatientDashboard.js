import React, { Fragment } from 'react';
import { AppBar, Toolbar, Typography, List, ListItem, ListItemText, Container } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { NavLink } from 'react-router-dom';
import { green } from '@mui/material/colors';
import Box from '@mui/material/Box';
import WelcomeCard from './WelcomeCard';
import BookAppointment from './BookAppointment';
import RequestStatus from './RequestStatus';
import RequestStatusCard from './RequestStatusCard';
import CompletedAppointments from './CompletedAppointments';
import Header from '../mui/Header';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`action-tabpanel-${index}`}
            aria-labelledby={`action-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `action-tab-${index}`,
        'aria-controls': `action-tabpanel-${index}`,
    };
}

const fabStyle = {
    position: 'absolute',
    bottom: 16,
    right: 16,
};

const fabGreenStyle = {
    color: 'common.white',
    bgcolor: green[500],
    '&:hover': {
        bgcolor: green[600],
    },
};

const PatientDashboard = () => {
    const role = sessionStorage.getItem('role');

    const theme = useTheme();
    const [value, setValue] = React.useState();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    return (
        <div>
            {(() => {

                if (role === 'Patient') {
                    console.log("Inside Patient session");
                    // return <Route exact path="/doctor" element={<DoctorDashboard />}></Route>
                    return (
                        <Fragment>
                            <Header username={sessionStorage.getItem('username')} path="/patient" />
                            <Box
                                sx={{
                                    bgcolor: 'background.paper',
                                    width: '80%',
                                    position: 'relative',
                                    minHeight: 200,
                                    marginTop: 1.5,
                                    marginLeft: '10%',
                                    marginRight: '10%',
                                }}
                            >
                                <AppBar position="static" color="default">
                                    <Tabs
                                        // value={value}
                                        // {...(value!==undefined && {value: value})}
                                        value={value ? value : 0}
                                        onChange={handleChange}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        variant="fullWidth"
                                        aria-label="action tabs example"
                                    >
                                        <Tab label="Book Appointment" {...a11yProps(0)} />
                                        <Tab label="Appointments Status" {...a11yProps(1)} />
                                        <Tab label="Completed Appointments" {...a11yProps(2)} />
                                    </Tabs>
                                </AppBar>
                                <Box>
                                    {(() => {
                                        if (value === undefined) {
                                            return <WelcomeCard setValue={setValue} />
                                        }
                                        else {
                                            return (
                                                <React.Fragment>
                                                    <TabPanel value={value} index={0} dir={theme.direction}>
                                                        {/* Completed */}
                                                        <BookAppointment />
                                                    </TabPanel>
                                                    <TabPanel value={value} index={1} dir={theme.direction}>
                                                        {/* Request New */}
                                                        <RequestStatus />
                                                    </TabPanel>
                                                    <TabPanel value={value} index={2} dir={theme.direction}>
                                                        {/* Requested */}
                                                        {/* <RequestStatusCard /> */}
                                                        <CompletedAppointments />
                                                    </TabPanel>
                                                </React.Fragment>
                                            )
                                        }
                                    })()}
                                </Box>
                            </Box>
                        </Fragment>
                    );
                }
                else {
                    return (
                        <Typography variant="h5" component="h1">
                            <NavLink to='/'>Please Login Using Patient Login Credentials</NavLink>
                        </Typography>
                    );
                }

            })()}
        </div>
    );
}

export default PatientDashboard;
