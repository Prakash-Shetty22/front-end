import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import { green } from '@mui/material/colors';
import Box from '@mui/material/Box';
import LoginPage from './Login';
import SignUp from './Signup';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Header from './Header';

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
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
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

export default function FloatingActionButtonZoom() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSnackbar(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  // const fabs = [
  //   {
  //     color: 'primary',
  //     sx: fabStyle,
  //     icon: <AddIcon />,
  //     label: 'Add',
  //   },
  //   {
  //     color: 'secondary',
  //     sx: fabStyle,
  //     icon: <EditIcon />,
  //     label: 'Edit',
  //   },
  //   {
  //     color: 'inherit',
  //     sx: { ...fabStyle, ...fabGreenStyle },
  //     icon: <UpIcon />,
  //     label: 'Expand',
  //   },
  // ];

  return (
    <React.Fragment>
      {console.log("Inside Floating")}
      <Header />
    <Box
      sx={{
        bgcolor: 'background.paper',
        width: '50%',
        position: 'relative',
        minHeight: 200,
        marginTop: 10,
        marginLeft: '25%',
        marginRight: '25%',
      }}
    >
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="action tabs example"
        >
          <Tab label="Sign In" {...a11yProps(0)} />
          <Tab label="Signup" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      {/* <Box component="div" style={{ transform: `translateX(${-value * 500}px)`, transition: 'transform 0.35s' }}> */}
      <Box>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <LoginPage />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <SignUp setValue={setValue} setAlertMessage={setAlertMessage} setShowSnackbar={setShowSnackbar}/>
        </TabPanel>
      </Box>
      {/* <Box
        component="div"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateX(${-value * 500}px)`,
          transition: 'transform 0.35s',
        }}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          Login
        </TabPanel>
        <Box
          component="div"
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <TabPanel value={value} index={1} dir={theme.direction}>
            <LoginPage />
          </TabPanel>
        </Box>
      </Box> */}

      {/* {fabs.map((fab, index) => (
        <Zoom
          key={fab.color}
          in={value === index}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`,
          }}
          unmountOnExit
        >
          <Fab sx={fab.sx} aria-label={fab.label} color={fab.color}>
            {fab.icon}
          </Fab>
        </Zoom>
      ))} */}
      <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity="success" variant="filled">
          {/* Mobile number already registered! */}{alertMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
    </React.Fragment>
  );
}
