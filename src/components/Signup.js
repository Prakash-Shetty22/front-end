import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Box } from '@mui/material';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const SignUp = (props) => {
    const [fullName, setFullName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const role = 'Patient';
    const [alertMessage, setAlertMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowSnackbar(false);
    };

    // const handleSignUp = (e) => {
    //     e.preventDefault();
    //     // Perform signup logic here
    //     // Send the form data to the backend API for signup
    //     fetch('http://localhost:8081/signup', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ mobileNumber, fullName, password, role }),
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             // Handle the response data here
    //             if (data === "Mobile number already registered") {
    //                 // Do something if mobile number is already registered
    //                 setShowSnackbar(true);
    //             } else {
    //                 // Registration successful, use the returned user data
    //                 const user = data;
    //                 // ...
    //                 console.log(data);
    //                 props.setValue(0);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);
    //         });
    //     console.log('Full Name:', fullName);
    //     console.log('Mobile Number:', mobileNumber);
    //     console.log('Password:', password);
    // };



    const handleSignUp = async (e) => {
        e.preventDefault();

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[@#$%^&+=]).{8,}$/;

        if (/^\d{10}$/.test(mobileNumber)) {
            if(password === password2) {
                if (passwordRegex.test(password)) {
                    try {
                        const response = await fetch("http://localhost:8081/authenticate/signup", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ mobileNumber, fullName, password, role })
                        });
    
                        const data = await response.json();
    
                        if (response.status === 409) {
                            setAlertMessage("Mobile Number already exists. Please enter another Mobile Number");
                            // Do something if mobile number is already registered
                            setShowSnackbar(true);
                        }
                        else if (response.ok) {
                            // setUser(data); // assuming the server returns the saved user object
                            // setMessage("");
    
                            // Registration successful, use the returned user data
                            const user = data;
                            // ...
                            console.log(data);
                            props.setAlertMessage("Sign Up is successful. Please Sign In to Continue");
                            props.setShowSnackbar(true);
                            props.setValue(0);
                        } else {
                            // setMessage(data);
                            // setUser(null);
    
                            setAlertMessage("An error occurred during signup. Please try again later.");
                            setShowSnackbar(true);
                        }
                    } catch (error) {
                        // Handle connection errors here
                        setAlertMessage("An error occurred while connecting to the server");
                        setShowSnackbar(true);
                        // if (error.name !== 'AbortError') {
                        //     setAlertMessage("An error occurred while connecting to the server");
                        //     setShowSnackbar(true);
                        // }
                    }
                }
                else {
                    setAlertMessage("Password Doesn't Match The Criteria: It should contain at least 8 characters, at least one uppercase letter, one lowercase letter, one digit, and one special character");
                    setShowSnackbar(true);
                }
            }
            else {
                setAlertMessage("Password Is Mismatching");
                setShowSnackbar(true);
            }
        }
        else {
            setAlertMessage("Invalid Mobile Number");
            setShowSnackbar(true);
        }
    }


    // const handleSignUp = (e) => {
    //     e.preventDefault();
    //     // Perform signup logic here
    //     // Send the form data to the backend API for signup
    //     fetch('http://localhost:8081/signup', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ mobileNumber, fullName, password, role }),
    //     })
    //         .then((response) => {
    //             if (response.ok) {
    //                 // Handle successful response here
    //                 // console.log('Signup successful'); <-- remove this line
    //                 const user = data;
    //                 // ...
    //                 console.log(data);
    //                 props.setValue(0);
    //             } else if (response.status === 409) {
    //                 setAlertMessage("Mobile Number already exists. Please enter another Mobile Number");
    //                 // Do something if mobile number is already registered
    //                 setShowSnackbar(true);
    //             } else {
    //                 // Handle other error responses here
    //                 setAlertMessage("An error occurred during signup. Please try again later.");
    //                 setShowSnackbar(true);
    //             }
    //         })
    //         // .then((data) => {
    //         //     // Handle the response data here
    //         //     if (data === "Mobile number already registered") {
    //         //         // Do something if mobile number is already registered
    //         //         setShowSnackbar(true);
    //         //     } else {
    //         //         // Registration successful, use the returned user data
    //         //         const user = data;
    //         //         // ...
    //         //         console.log(data);
    //         //         props.setValue(0);
    //         //     }
    //         // })
    //         .catch((error) => {
    //             // console.error('Error:', error);
    //             setAlertMessage("An error occurred while connecting to the server");
    //             setShowSnackbar(true);
    //         });
    //     console.log('Full Name:', fullName);
    //     console.log('Mobile Number:', mobileNumber);
    //     console.log('Password:', password);
    // };

    return (
        // <Container maxWidth="sm">
        <Container component="main" maxWidth="xs">
            <Paper sx={{ marginTop: 5, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 7 }}>
                <Box component="form" onSubmit={handleSignUp} sx={{ mt: 0 }}>
                    <TextField
                        id="full-name"
                        label="Full Name"
                        fullWidth
                        margin="normal"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <TextField
                        id="mobile-number"
                        label="Mobile Number"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        inputProps={{ maxLength: 10 }}
                        required
                    />
                    <TextField
                        id="password"
                        label="Create Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField
                        id="password2"
                        label="Re-enter Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />
                    {/* <Button variant="contained" color="primary" onClick={handleSignUp}>
                        Sign Up
                    </Button> */}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign Up
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

export default SignUp;
