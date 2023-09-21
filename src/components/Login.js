import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Container, Paper } from '@mui/material';
import Box from '@mui/system/Box';
import axios from 'axios';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

  sessionStorage.removeItem('role');

  const navigate = useNavigate();

  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [role, setRole] = useState('');

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     // Code to be executed after a delay
  //     console.log('Delayed code executed');
  //     if (role === 'Doctor') {
  //       console.log("Inside if");
  //       navigate("/doctor");
  //     }
  //   }, 1000); // Delay of 2 seconds (2000 milliseconds)

  //   // Clean up the timeout if the component unmounts before the delay finishes
  //   return () => clearTimeout(timeoutId);
  // }, [role]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSnackbar(false);
  };

  const handleMobileNumberChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', mobileNumber);
    // Add your authentication logic here

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[@#$%^&+=]).{8,}$/;

    if (/^\d{10}$/.test(mobileNumber)) {
      try {
        // Send a POST request to the backend endpoint for authentication
        // const response = await axios.post('http://localhost:8081/authenticate/login', {
        //   mobileNumber,
        //   password
        // });

        const response = await fetch('http://localhost:8081/authenticate/login', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ mobileNumber, password })
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          sessionStorage.setItem('username', data.fullName);
          sessionStorage.setItem('mobileNumber', data.mobileNumber);
          sessionStorage.setItem('role', data.role);
          setRole(data.role);
        } else if (response.status === 401) {
          setAlertMessage("Password is Invalid");
          setShowSnackbar(true);
        } else if (response.status === 404) {
          setAlertMessage("There is No Account with the Given Mobile Number, Please Sign Up with this Number to Continue.");
          setShowSnackbar(true);
        } else {
          setAlertMessage("An error occurred during signin. Please try again later.");
          setShowSnackbar(true);
        }
      } catch (error) {
        setAlertMessage("Server Connection Failure!");
        setShowSnackbar(true);
      }

      if (sessionStorage.getItem('role') === 'Doctor') {
        console.log("Inside if");
        navigate("/doctor");
      } else if (sessionStorage.getItem('role') === 'Patient') {
        console.log("Inside else if");
        navigate("/patient");
      } else if (sessionStorage.getItem('role') === 'Admin') {
        console.log("Inside else if");
        navigate("/admin");
      }
    }
    else {
      setAlertMessage("Invalid Mobile Number");
      setShowSnackbar(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      {console.log("Inside Login session")}
      <Paper sx={{ marginTop: 5, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 7 }}>
        {/* <Typography variant="h5" component="h1">
          Login
        </Typography> */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 0 }}>
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobileNumber"
            type="tel"
            value={mobileNumber}
            onChange={handleMobileNumberChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
            required
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
        </Box>
      </Paper>
      <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity="error" variant="filled">
          {/* Mobile number already registered! */}{alertMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;
