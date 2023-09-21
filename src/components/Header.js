import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import Logo from '../images/logo.avif';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
      {/* <img src={Logo} alt="Logo" style={{ marginRight: '10px' }} /> */}
      <img src={Logo} alt="Logo" style={{ width: '100px', height: 'auto', marginRight: '10px' }} />

        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Automation of Doctor Appointment
        </Typography>
        {/* <nav>
          <ul style={{ listStyleType: 'none', display: 'flex' }}>
            <li style={{ marginRight: '10px' }}>
              <a href="/doctors">Doctors</a>
            </li>
            <li style={{ marginRight: '10px' }}>
              <a href="/appointments">Appointments</a>
            </li>
            <li>
              <a href="/contact">Contact Admin</a>
            </li>
          </ul>
        </nav> */}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
