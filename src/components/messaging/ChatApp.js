import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Box, Container, List, ListItem, ListItemText, TextField, Toolbar, Typography, InputAdornment, Divider }
    from '@mui/material';
import { Send } from '@mui/icons-material';

function ChatApp() {
    const [selectedContact, setSelectedContact] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const contacts = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        // Add more contacts here
    ];

    useEffect(() => {
        if (contacts.length > 0) {
            const initialContact = contacts[0]; // Get the first contact
            setSelectedContact(initialContact);
            setMessages(staticConversations[initialContact.id] || []);
        }
    }, []);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom of the message container when a new message is sent
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]); // Trigger the effect whenever the messages array updates

    const staticConversations = {
        1: [
            { sender: 'John Doe', message: 'Hello there!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
            { sender: 'You', message: 'Hi John!' },
        ],
        2: [
            { sender: 'Jane Smith', message: 'Hey! How are you?' },
            { sender: 'You', message: 'I\'m good, thanks!' },
        ],
    };

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
        setMessages(staticConversations[contact.id] || []);
        setNewMessage(''); // Clear the newMessage state when switching contacts
    };

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            const updatedMessages = [
                ...messages,
                { sender: 'You', message: newMessage },
            ];
            setMessages(updatedMessages);
            setNewMessage('');
        }
    };

    return (
        <Container maxWidth="xl">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Chat App</Typography>
                </Toolbar>
            </AppBar>
            <Box display="flex" flexDirection="row" height="70vh">
                {/* <Box display="flex" flexDirection="row" height="100%"> */}
                <Box width="30%" borderRight="1px solid #e0e0e0">
                    <List>
                        {contacts.map((contact) => (
                            <ListItem
                                key={contact.id}
                                button
                                onClick={() => handleContactClick(contact)}
                                selected={selectedContact === contact}
                            >
                                <ListItemText
                                    primary={contact.name}
                                    primaryTypographyProps={{
                                        color: selectedContact === contact ? 'primary' : 'initial', // Highlight the selected contact
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box width="70%" display="flex" flexDirection="column">
                    {selectedContact && ( // Only render if a contact is selected
                        <Box p={1} textAlign="left"> {/* Position header on the left */}
                            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                {selectedContact.name}
                            </Typography>
                            <Divider /> {/* Add a divider */}
                        </Box>
                    )}
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
                        <Box
                            // height="85%"
                            display="flex"
                            flexDirection="column"
                            justifyContent="flex-end"
                        >
                            {messages.map((message, index) => (
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
                                                message.sender === 'You' ? '#4caf50' : '#f0f0f0',
                                            padding: '5px 10px',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        {message.message}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    <TextField
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        variant="outlined"
                        placeholder="Type a message..."
                        fullWidth
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
    );
}

export default ChatApp;

