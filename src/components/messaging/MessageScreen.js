import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Container } from '@mui/material';

const MessageScreen = () => {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleSenderChange = (e) => {
    setSender(e.target.value);
  };

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle message send logic here
    console.log('Sender:', sender);
    console.log('Recipient:', recipient);
    console.log('Message:', message);
    // Clear the form fields
    setSender('');
    setRecipient('');
    setMessage('');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          SendMessage
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Sender"
            value={sender}
            onChange={handleSenderChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Recipient"
            value={recipient}
            onChange={handleRecipientChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Message"
            value={message}
            onChange={handleMessageChange}
            multiline
            rows={4}
            fullWidth
            margin="normal"
            required
          />

          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Send Message
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default MessageScreen;
