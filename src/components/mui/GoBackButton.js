import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookAppointment from '../patient/BookAppointment';

const GoBackButton = ({setSortedDoctors}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // navigate(-1);
    setSortedDoctors([]);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<ArrowBackIcon />}
      onClick={handleGoBack}
      sx={{
        borderRadius: '25px',
        boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.1)',
        textTransform: 'none',
        fontWeight: 'bold',
        padding: '10px 20px',
        fontSize: '15px',
        marginTop: 2,
        marginBottom: 2,
        '&:hover': {
          backgroundColor: '#ff7f50',
        },
      }}
    >
      Go Back
    </Button>
  );
};

export default GoBackButton;
