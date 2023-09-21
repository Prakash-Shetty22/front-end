import React, { Fragment, useEffect, useState } from 'react';
import { Avatar, Badge, List, ListItem, ListItemAvatar, ListItemText, Typography, Divider, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import Header from '../mui/Header';
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from "@mui/material/styles";
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const StyledListItem = styled(ListItem)(({ theme }) => ({
    border: "2px solid blue",
    marginBottom: "10px",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
}));

const ContactList = () => {

    const navigate = useNavigate();

    const [contacts, setContacts] = useState([]);
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

    // const contacts = [
    //     {
    //         name: 'John Doe',
    //         unreadMessages: 2,
    //         // avatarUrl: 'https://example.com/john-avatar.jpg',
    //         lastMessage: 'Hey, how are you?',
    //     },
    //     {
    //         name: 'Jane Smith',
    //         unreadMessages: 0,
    //         // avatarUrl: 'https://example.com/jane-avatar.jpg',
    //         lastMessage: 'Sure, see you then!',
    //     },
    //     // Add more contact objects...
    // ];

    useEffect(() => {

        fetchContacts();

    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axios.post('http://localhost:8085/message/contactsList', {
                mobileNumber: sessionStorage.getItem('mobileNumber')
                // mobileNumber: '9876543213'
            });

            // const data = await response.data;

            setContacts(response.data);

            // Convert the objects to strings using JSON.stringify()
            const offenceDataAsString = response.data.map(obj => JSON.stringify(obj));

            // Display the offence data as strings
            console.log("Rows:", offenceDataAsString.join(", "));

        } catch (error) {
            console.error('Error fetching data:', error);
            // setErrorMessage("There is some problem with fetching the Requests");
            // setShowError(true);
        }
    };

    const handleClick = (contact) => {
        // navigate('/start-conversation', { state: { actor1: sessionStorage.getItem('mobileNumber'), actor2: mobileNumber, hospitalName: name, } });
        // navigate('/start-conversation', { state: { actor1: '9876543213', actor2: contact.mobileNumber, hospitalName: contact.name, } });
        console.log("Inside Handle Click");
        navigate('/start-conversation', { state: { actor1: sessionStorage.getItem('mobileNumber'), actor2: contact.mobileNumber, hospitalName: contact.name, } });
    };

    const handleEndConversation = async (event, contact) => {
        event.stopPropagation(); // Prevent click from propagating to the div

        //// Add contact to ended conversations
        // setEndedConversations((prevEndedConversations) => [
        //     ...prevEndedConversations,
        //     contact.id,
        // ]);
        const actor1 = contact.mobileNumber;
        const actor2 = sessionStorage.getItem('mobileNumber');
        console.log("Contact : " + actor1 + " & " + actor2);

        try {
            const response = await axios.post('http://localhost:8085/message/endConversation', {
                actors1: actor1 + 'TO' + actor2,
                actors2: actor2 + 'TO' + actor1
            });

            if (response.data.message === "Conversation Ended Successfully") {
                setAlertMessage(response.data.message);
                setShowSnackbar(true);
                fetchContacts();
            }
            else {
                setErrorMessage(response.data.message);
                setShowError(true);
            }
        } catch (error) {
            // Handle error response
            // console.error(error);
            setErrorMessage('Failed to End Conversation.');
            setShowError(true);
        }
    };

    return (
        <Fragment>
            {(() => {
                if (sessionStorage.getItem('role') === 'Admin') {
                    return (
                        <Fragment>
                            <Header username={sessionStorage.getItem('username')} path="/admin" />
                            <h1>Patient Queries</h1>
                            <Divider />
                            {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}> */}
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {/* <List style={{width: '50%', backgroundColor: '#f0f0f0'}}> */}
                                <List>
                                    {contacts.map((contact, index) => (
                                        <div key={index} onClick={() => handleClick(contact)}>
                                            {/* <ListItem key={index} alignItems="flex-start"> */}
                                            {/* <ListItem alignItems="flex-start" style={{ border: '2px solid blue', marginBottom: '10px', padding: '10px' }}> */}
                                            <StyledListItem>
                                                <ListItemAvatar>
                                                    <Badge badgeContent={contact.unreadMessages} color="error">
                                                        <Avatar alt={contact.name} src={contact.avatarUrl} />
                                                    </Badge>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={contact.name}
                                                    secondary={
                                                        <>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                color="text.primary"
                                                            >
                                                                {contact.lastMessage}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    endIcon={<ClearIcon />}
                                                    // onClick={() => handleEndConversation(contact)}
                                                    onClick={(event) => handleEndConversation(event, contact)}
                                                    sx={{marginLeft: 2}}
                                                >
                                                    End
                                                </Button>
                                                {/* </ListItem> */}
                                            </StyledListItem>
                                            {/* {index < contacts.length - 1 && <Divider style={{ borderTop: '2px solid blue' }}/>} */}
                                        </div>
                                    ))}
                                </List>
                            </div>
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
        </Fragment>

    );
};

export default ContactList;
