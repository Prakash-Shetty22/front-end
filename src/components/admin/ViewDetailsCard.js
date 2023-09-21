import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Divider from '@mui/material/Divider';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

export default function ViewDetailsCard({ data }) {

    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [scroll, setScroll] = React.useState('paper');

    const { fullName, specialization, age, gender, fee, hospital } = data.doctor;
    const { name, location, admin } = hospital;
    const { mobileNumber, fullName: adminFullName } = admin;

    const descriptionElementRef = React.useRef(null);
    useEffect(() => {
        if (openDialog) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [openDialog]);

    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowError(false);
    };

    return (
        <Card sx={{marginTop: '20px'}}>
            <Snackbar open={showError} autoHideDuration={6000} onClose={handleErrorClose}>
                <MuiAlert onClose={handleErrorClose} severity="error" variant="filled">
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={3} sx={{ textAlign: 'left', backgroundColor: '#FDFCDC' }}>
                        <Typography variant="h6" style={{ color: '#FF7171' }}>Patient Details</Typography>
                        <Typography variant="body1" style={{ color: '#AD8BF0' }}>Name: {data.patient.fullName}</Typography>
                        <Typography variant="body1" style={{ color: '#AD8BF0' }}>Mobile Number: {data.patient.mobileNumber}</Typography>
                    </Grid>

                    <Grid item xs={6} md={3} sx={{ textAlign: 'left', backgroundColor: '#F8F7FF' }}>
                        <Typography variant="h6" style={{ color: '#387FFF' }}>Appointment Details</Typography>
                        <Typography variant="body1" style={{ color: '#5E5CE6' }}>Date: {data.date}</Typography>
                        <Typography variant="body1" style={{ color: '#5E5CE6' }}>Time: {data.time}</Typography>
                        <Typography variant="body1" style={{ color: '#5E5CE6' }}>Specialization: {specialization}</Typography>
                    </Grid>

                    <Grid item xs={6} md={3} sx={{ textAlign: 'left', backgroundColor: '#D9FAFB' }}>
                        <Typography variant="h6" style={{ color: '#52B69A' }}>Doctor Details</Typography>
                        <Typography variant="body1" style={{ color: '#3AAFA9' }}>Name: {fullName}</Typography>
                        <Typography variant="body1" style={{ color: '#3AAFA9' }}>Specialization: {specialization}</Typography>
                        <Typography variant="body1" style={{ color: '#3AAFA9' }}>Age: {age}</Typography>
                        <Typography variant="body1" style={{ color: '#3AAFA9' }}>Gender: {gender}</Typography>
                        <Typography variant="body1" style={{ color: '#3AAFA9' }}>Fee: {fee}</Typography>
                    </Grid>

                    <Grid item xs={6} md={3} sx={{ textAlign: 'left', backgroundColor: '#FFFCDD' }}>
                        {/* <Typography variant="h6" style={{ color: '#FFB800' }}>Contact Details</Typography>
                        <Typography variant="body1" style={{ color: '#FFD700' }}>Mobile Number: {mobileNumber}</Typography>
                        <Typography variant="body1" style={{ color: '#FFD700' }}>Name: {adminFullName}</Typography>
                        <Divider /> */}
                        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center' }}>{/* Add space between Typography and buttons */}
                            <Button variant="contained" color="primary" startIcon={<VisibilityIcon />} onClick={e => setOpenDialog(true)} sx={{ color: '#fff', backgroundColor: '#3f51b5', '&:hover': { color: '#3f51b5', backgroundColor: '#fff' } }}>Show Record</Button>
                        </div>
                    </Grid>
                </Grid>
            </CardContent>
            <Dialog open={openDialog} onClose={e => setOpenDialog(false)} scroll={scroll}
                aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
                <DialogTitle>Health Record:</DialogTitle>
                {/* <DialogContent style={{ width: '35vw', height: '100vh', display: 'flex', flexDirection: 'column' }}> */}
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <pre>{data.patientRecord}</pre>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={e=> setOpenDialog(false)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
