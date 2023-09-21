import React, { useState, useEffect, useRef, Fragment } from 'react';
import { AppBar, Box, Container, List, ListItem, ListItemText, TextField, Toolbar, Typography, InputAdornment, Divider, Grid }
    from '@mui/material';
import { CookieSharp, Send } from '@mui/icons-material';
import Stomp from 'stompjs';
import axios from "axios";
import { useLocation, NavLink } from 'react-router-dom';
import Header from '../mui/Header';
import { useCallback } from 'react';

function PatientChat() {
    const role = sessionStorage.getItem('role');

    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [data, setData] = useState({});
    const [mergedData, setMergedData] = useState({});
    const [fetchAgain, setFetchAgain] = useState();

    const location = useLocation();
    const { actor1, actor2, hospitalName } = location.state || {};

    useEffect(() => {
        // setMessages(staticConversations || []);
        // setMessages(staticConversations);

        fetchOldMessage();

        const intervalId = setInterval(fetchOldMessage, 5000);

        return () => {
            clearInterval(intervalId); // Cleanup when component unmounts
        };
    }, []);

    // useEffect(() => {
    //     const intervalId = setInterval(receiveMessage, 5000);

    //     return () => {
    //         clearInterval(intervalId); // Cleanup when component unmounts
    //     };
    // }, []);

    const fetchOldMessage = async () => {
        console.log("Actor1 : " + actor1 + " Actor2 : " + actor2 + " Name : " + hospitalName);
        try {
            const response = await axios.post('http://localhost:8085/message/receiveOldMessage', {
                // actor1: '9876543212', actor2: '9876543213'
                actor1: actor1, actor2: actor2
            });

            if (response.data.msgSent !== data.msgSent || response.data.msgReceive !== data.msgReceive) {

                console.log(response.data);
                console.log("DAta : " + JSON.stringify(response.data));

                const mergedDateObjs = {};

                // Merge msgSent
                for (const date in response.data.msgSent) {
                    if (!mergedDateObjs[date]) {
                        mergedDateObjs[date] = {};
                    }
                    Object.assign(mergedDateObjs[date], response.data.msgSent[date]);
                }

                // Merge msgReceive
                for (const date in response.data.msgReceive) {
                    if (!mergedDateObjs[date]) {
                        mergedDateObjs[date] = {};
                    }
                    Object.assign(mergedDateObjs[date], response.data.msgReceive[date]);
                }

                console.log(mergedDateObjs);

                setData(response.data);
                setMergedData(mergedDateObjs);

                // const newData = { ...data }; // Create a copy of the existing data state
                // const newMergedData = { ...mergedData }; // Create a copy of the existing mergedData state

                // // Update the copied state based on the response
                // newData.msgSent = response.data.msgSent; // Update msgSent
                // newData.msgReceive = response.data.msgReceive; // Update msgReceive

                // // Update the mergedData based on the response
                // for (const date in response.data.msgSent) {
                //     if (!newMergedData[date]) {
                //         newMergedData[date] = {};
                //     }
                //     Object.assign(newMergedData[date], response.data.msgSent[date]);
                // }

                // for (const date in response.data.msgReceive) {
                //     if (!newMergedData[date]) {
                //         newMergedData[date] = {};
                //     }
                //     Object.assign(newMergedData[date], response.data.msgReceive[date]);
                // }

                // setData(newData); // Set the updated data state
                // setMergedData(newMergedData); // Set the updated mergedData state

            }

        } catch (error) {
            // Handle error response
            console.error(error);
            // setAlertMessage('Failed to Fetch availabilities.');
            // setShowSnackbar(true);
        }
    };

    const receiveMessage = async () => {
        console.log("Actor1 : " + actor1 + " Actor2 : " + actor2 + " Name : " + hospitalName);
        try {
            const response = await axios.post('http://localhost:8085/message/receiveMessage', {
                // actor1: '9876543212', actor2: '9876543213'
                // actor1: actor1, actor2: actor2
                actors: actor1 + 'TO' + actor2
            });

            const resp = JSON.stringify(response.data);

            console.log("Data in receive : " + response.data);

            console.log("Response Size : " + response.data.size);

            // Convert the objects to strings using JSON.stringify()
            const offenceDataAsString = Object.entries(response.data).map(obj => JSON.stringify(obj));

            // Display the offence data as strings
            console.log("Rows:", offenceDataAsString.join(", "));

            let count = 0;

            for (const outerKey in response.data) {
                if (response.data.hasOwnProperty(outerKey)) {
                    const innerMap = response.data[outerKey];
                    count += Object.keys(innerMap).length;
                }
            }

            console.log("Count : " + count);

            // if (response.data.size > 0) {
            if (count > 0) {

                console.log("Inside If");

                // console.log("Data : " + JSON.stringify(data));

                let tempData = data || {}; // Initialize with an empty object if data is falsy

                console.log("Is receive present ? : " + tempData.msgReceive);
                if (!tempData.msgReceive) {
                    tempData.msgReceive = {}; // Initialize msgSent if it doesn't exist
                }

                // Merge msgReceive in data state
                for (const date in response.data) {
                    if (!tempData.msgReceive[date]) {
                        tempData.msgReceive[date] = {};
                    }
                    Object.assign(tempData.msgReceive[date], response.data[date]);
                }

                // if (tempData.msgReceive[dateKey]) {
                //     console.log("Date present");
                //     tempData.msgSent[dateKey][timeKey] = messageContent;
                // } else {
                //     console.log("Date not present");
                //     const innerMap = {};
                //     innerMap[timeKey] = messageContent;
                //     tempData.msgSent[dateKey] = innerMap;
                // }

                console.log("Temp Data : " + JSON.stringify(tempData));
                setData(tempData);


                const mergedDateObjs = mergedData;

                // Merge msgReceive
                for (const date in response.data) {
                    if (!mergedDateObjs[date]) {
                        mergedDateObjs[date] = {};
                    }
                    Object.assign(mergedDateObjs[date], response.data[date]);
                }

                console.log("MergedDate Objects : " + JSON.stringify(mergedDateObjs));

                setMergedData(mergedDateObjs);

            }



            // if (response.status === 200) {
            //     const messageMap = response.data;
            //     console.log("Message Map : " + messageMap);
            //     // Update your state with the messageMap
            //     // For example, you can set it to a state variable named 'receivedMessageMap'
            //     // setReceivedMessageMap(messageMap);

            //     console.log("Inside If");

            //     // console.log("Data : " + JSON.stringify(data));

            //     console.log("Data : " + JSON.stringify(data));

            //     let tempData = data || {}; // Initialize with an empty object if data is falsy

            //     console.log("Is receive present ? : " + tempData.msgReceive);
            //     if (!tempData.msgReceive) {
            //         console.log("Msg Receive Not present");
            //         tempData.msgReceive = {}; // Initialize msgSent if it doesn't exist
            //     }

            //     // Merge msgReceive in data state
            //     for (const date in messageMap) {
            //         if (!tempData.msgReceive[date]) {
            //             tempData.msgReceive[date] = {};
            //         }
            //         // console.log("messageMap[] : " + JSON.stringify(messageMap[date]));
            //         Object.assign(tempData.msgReceive[date], messageMap[date]);
            //     }

            //     // if (tempData.msgReceive[dateKey]) {
            //     //     console.log("Date present");
            //     //     tempData.msgSent[dateKey][timeKey] = messageContent;
            //     // } else {
            //     //     console.log("Date not present");
            //     //     const innerMap = {};
            //     //     innerMap[timeKey] = messageContent;
            //     //     tempData.msgSent[dateKey] = innerMap;
            //     // }

            //     console.log("Temp Data : " + JSON.stringify(tempData));
            //     setData(tempData);


            //     const mergedDateObjs = mergedData;

            //     // Merge msgReceive
            //     for (const date in messageMap) {
            //         if (!mergedDateObjs[date]) {
            //             mergedDateObjs[date] = {};
            //         }
            //         Object.assign(mergedDateObjs[date], messageMap[date]);
            //     }

            //     console.log("MergedDate Objects : " + JSON.stringify(mergedDateObjs));

            //     setMergedData(mergedDateObjs);
            // } else {
            //     console.log("Received a response with status code:", response.status);
            // }

        } catch (error) {
            // Handle error response
            console.error(error);
            // setAlertMessage('Failed to Fetch availabilities.');
            // setShowSnackbar(true);
        }
    };

    const fetchMessage = async () => {
        console.log("Actor1 : " + actor1 + " Actor2 : " + actor2 + " Name : " + hospitalName);
        try {
            const response = await axios.post('http://localhost:8085/message/receiveOldMessage', {
                // actor1: '9876543212', actor2: '9876543213'
                actor1: actor1, actor2: actor2
            });

            if (response.data != JSON.stringify(data)) {
                setData(response.data);
                // console.log(response.data);
                // console.log("DAta : " + JSON.stringify(data));

                const mergedDateObjs = {};

                // Merge msgSent
                for (const date in response.data.msgSent) {
                    if (!mergedDateObjs[date]) {
                        mergedDateObjs[date] = {};
                    }
                    Object.assign(mergedDateObjs[date], response.data.msgSent[date]);
                }

                // Merge msgReceive
                for (const date in response.data.msgReceive) {
                    if (!mergedDateObjs[date]) {
                        mergedDateObjs[date] = {};
                    }
                    Object.assign(mergedDateObjs[date], response.data.msgReceive[date]);
                }

                console.log("Merged Date Objects : " + mergedDateObjs);

                setMergedData(mergedDateObjs);

            }

        } catch (error) {
            // Handle error response
            console.error(error);
            // setAlertMessage('Failed to Fetch availabilities.');
            // setShowSnackbar(true);
        }
    };

    // const staticConversations = [
    //     { sender: 'John Doe', message: 'Hello there!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    //     { sender: 'You', message: 'Hi John!' },
    // ];

    const handleSendMessage = async () => {
        // if (newMessage.trim() !== '') {
        //     const updatedMessages = [
        //         ...messages,
        //         { sender: 'You', message: newMessage },
        //     ];
        //     setMessages(updatedMessages);
        //     setNewMessage('');
        // }
        if (newMessage.trim() !== '') {

            try {
                const response = await axios.post('http://localhost:8085/message/sendMessage', {
                    // actors: '9876543212to9876543213', message: newMessage
                    actors: actor1 + 'TO' + actor2, message: newMessage
                });

                const message = response.data;

                console.log("Message : ");
                console.log(message);

                const parts = message.split(" ");

                if (parts.length > 2) {
                    const dateKey = parts[0];
                    const timeKey = parts[1];
                    const messageContent = parts.slice(2).join(" ");
                    console.log("Message Content : " + messageContent);

                    console.log("Data : " + JSON.stringify(data));

                    let tempData = data || {}; // Initialize with an empty object if data is falsy
                    const mergedDateObjs = mergedData;

                    if (!tempData.msgSent) {
                        console.log("msgSent is not present");
                        tempData.msgSent = {}; // Initialize msgSent if it doesn't exist
                    }

                    if (tempData.msgSent[dateKey]) {
                        console.log("Date is present in Data");
                        console.log("Date present");
                        tempData.msgSent[dateKey][timeKey] = messageContent;
                    } else {
                        console.log("Date not present");
                        const innerMap = {};
                        innerMap[timeKey] = messageContent;
                        tempData.msgSent[dateKey] = innerMap;
                    }
                    // setData(tempData);

                    const mergedDate = mergedData;

                    // Merge msgSent
                    for (const date in tempData.msgSent) {
                        if (!mergedDate[date]) {
                            console.log("Date is not present in merged msgSent");
                            mergedDate[date] = {};
                        }
                        Object.assign(mergedDate[date], tempData.msgSent[date]);
                    }

                    // Merge msgReceive
                    for (const date in tempData.msgReceive) {
                        if (!mergedDate[date]) {
                            console.log("Date is not present in merged msgReceive");
                            mergedDate[date] = {};
                        }
                        Object.assign(mergedDate[date], tempData.msgReceive[date]);
                    }

                    console.log(mergedDate);

                    // setMergedData(mergedDate);

                    // fetchOldMessage();
                    // setFetchAgain(!fetchAgain);
                }

            } catch (error) {
                // Handle error response
                console.error(error);
                // setAlertMessage('Failed to Fetch availabilities.');
                // setShowSnackbar(true);
            }

            // setData(response.data);
            // console.log(response.data);

            const updatedMessages = [
                ...messages,
                { sender: 'You', message: newMessage },
            ];
            setMessages(updatedMessages);
            setNewMessage('');
        }
    };

    const sortDates = () => {
        return Object.entries(mergedData)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]));
    };

    // const sortTimes = (index) => {
    //     if (typeof mergedData[index] === 'object' && mergedData[index] !== null) {
    //         const sortedTimes = Object.entries(mergedData[index])
    //             .sort((a, b) => new Date(`1970-01-01 ${a[0]}`) - new Date(`1970-01-01 ${b[0]}`))
    //             .map(([time]) => time);

    //         console.log("Sorted Times : " + sortedTimes);

    //         return sortedTimes;
    //     }

    //     return [];
    // };

    const sortTimes = (index) => {
        if (typeof mergedData[index] === 'object' && mergedData[index] !== null) {
            const sortedTimes = Object.entries(mergedData[index])
                .sort((a, b) => {
                    const timeA = a[0].replace(/(\d{2})(\d{3})/, "$1.$2");
                    const timeB = b[0].replace(/(\d{2})(\d{3})/, "$1.$2");
                    return new Date(`1970-01-01T${timeA}`).getTime() - new Date(`1970-01-01T${timeB}`).getTime();
                })
                .map(([time]) => time);

            // console.log("Sorted Times : " + sortedTimes);

            return sortedTimes;
        }

        return [];
    };

    return (
        <Fragment>
            {(() => {
                if (role === 'Patient' || role === 'Admin') {
                    return (
                        <Fragment>
                            {role === 'Patient' && (<Header username={sessionStorage.getItem('username')} path="/patient" />)}
                            {role === 'Admin' && (<Header username={sessionStorage.getItem('username')} path="/admin" />)}
                            <Container maxWidth="xl">
                                {/* <AppBar position="static">
                <Toolbar> */}
                                {/* <Typography variant="h6">Chat App</Typography> */}
                                {/* <Typography variant="h6">{hospitalName}</Typography> */}
                                {/* </Toolbar>
            </AppBar> */}
                                <Box p={1} textAlign="center"> {/* Position header on the left */}
                                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                        <span style={{ color: '#557A46' }}>Connected with </span>
                                        <span style={{ color: '#8C3333' }}>{hospitalName}</span>
                                    </Typography>
                                    <Divider /> {/* Add a divider */}
                                </Box>
                                <Box display="flex" flexDirection="row" height="70vh" border="1px solid #e0e0e0" backgroundColor="#f0f0f0">
                                    <Box width="100%" marginLeft="5%" marginRight="5%" display="flex" flexDirection="column">
                                        <Box
                                            width="100%"
                                            height="85%"
                                            display="flex"
                                            flexDirection="column"
                                            overflow="auto"
                                            style={{
                                                flexDirection: 'column-reverse', // Reverse the display order
                                                /* Apply custom scrollbar styles */
                                                scrollbarWidth: 'thin',
                                                scrollbarColor: '#bdbdbd #f0f0f0', // Track and thumb colors
                                            }}
                                        >
                                            {/* {data.length > 0 && */}
                                            <Box
                                                display="flex"
                                                flexDirection="column"
                                                justifyContent="flex-end"
                                            >
                                                {/* {messages.map((message, index) => (
                                <Box
                                    key={index}
                                    alignSelf={
                                        message.sender === 'You' ? 'flex-end' : 'flex-start'
                                    }
                                    p={1}
                                >
                                    <Typography
                                        variant="body1"
                                        style={{
                                            background:
                                                message.sender === 'You' ? '#4caf50' : '#ffffff',
                                            padding: '5px 10px',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        {message.message}
                                    </Typography>
                                </Box>
                            ))} */}

                                                {sortDates().map(([date]) =>
                                                    sortTimes(date).map((time) => (
                                                        <Box
                                                            key={`${date}-${time}`}
                                                            alignSelf={
                                                                (data.msgSent != null && data.msgSent != undefined && Object.values(data.msgSent).some(dateObj => time in dateObj)) ? 'flex-end' : 'flex-start'
                                                            }
                                                            p={1}
                                                        >
                                                            <Typography
                                                                variant="body1"
                                                                style={{
                                                                    background:
                                                                        (data.msgSent != null && data.msgSent != undefined && Object.values(data.msgSent).some(dateObj => time in dateObj)) ? '#4caf50' : '#ffffff',
                                                                    padding: '5px 10px',
                                                                    borderRadius: '10px',
                                                                }}
                                                            >
                                                                {/* {console.log("Date : " + date + " time : " + time)} */}
                                                                {mergedData[date][time]}
                                                            </Typography>
                                                        </Box>
                                                    )))}
                                            </Box>
                                            {/* } */}
                                            {/* {!data.length > 0 && 
                        <Grid item xs={6} md={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'left', backgroundColor: '#FFFCDD', paddingTop: '13%', paddingBottom: '13%' }}>
                            <Typography variant="h2">Start Conversation</Typography> */}
                                            {/* <div>Start Conversation</div> */}
                                            {/* </Grid>
                    } */}
                                        </Box>
                                        <TextField
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            variant="outlined"
                                            placeholder="Type a message..."
                                            fullWidth
                                            // border="1px solid blue"
                                            sx={{ border: "1px solid blue" }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Send
                                                            color="primary"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={handleSendMessage}
                                                        />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Container>
                        </Fragment>
                    );
                }
                else {
                    return (
                        <Typography variant="h5" component="h1">
                            <NavLink to='/'>Please Login Either Using Patient or Doctor Login Credentials</NavLink>
                        </Typography>
                    );
                }
            })()}
        </Fragment>

    );
}

export default PatientChat;

