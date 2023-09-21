import React, { Fragment } from 'react';
import { AppBar, Toolbar, Typography, List, ListItem, ListItemText, Container } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { NavLink } from 'react-router-dom';
import { green } from '@mui/material/colors';
import Box from '@mui/material/Box';
import ReceivedRequests from './ReceivedRequests';
import AcceptedAppointments from './AcceptedAppointments';
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

const Appointment = () => {
    const role = sessionStorage.getItem('role');

    const theme = useTheme();
    const [value, setValue] = React.useState(0);

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

                if (role === 'Doctor') {
                    console.log("Inside Doctor session");
                    // return <Route exact path="/doctor" element={<DoctorDashboard />}></Route>
                    return (
                        <Fragment>
                            <Header username={sessionStorage.getItem('username')} path="/doctor" />
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
                                <Typography variant="h5" component="h1" sx={{ marginBottom: 1.5, }}>
                                    Appointments
                                </Typography>
                                <AppBar position="static" color="default">
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        variant="fullWidth"
                                        aria-label="action tabs example"
                                    >
                                        <Tab label="View" {...a11yProps(0)} />
                                        <Tab label="Requests" {...a11yProps(1)} />
                                    </Tabs>
                                </AppBar>
                                <Box>
                                    <TabPanel value={value} index={0} dir={theme.direction}>
                                        {/* View */}
                                        <AcceptedAppointments />
                                    </TabPanel>
                                    <TabPanel value={value} index={1} dir={theme.direction}>
                                        {/* Requests */}
                                        <ReceivedRequests />
                                    </TabPanel>
                                </Box>
                            </Box>
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
        </div>
    );
}

export default Appointment;
