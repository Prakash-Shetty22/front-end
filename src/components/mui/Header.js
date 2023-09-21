import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, MenuItem } from '@mui/material';
import Logo from '../../images/logo.avif';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from "react-router-dom";

const Header = ({ username, path }) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const handleHome = () => {
    navigate(path);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <div style={{ display: 'flex', alignItems: 'center', width: '24%' }}>
          <img src={Logo} alt="Logo" style={{ width: '100px', height: 'auto', marginRight: '10px' }} />

          <Toolbar>
            {/* <IconButton edge="start" color="inherit" onClick={() => window.history.back()}> */}
            <MenuItem onClick={() => window.history.back()}>
              <ArrowBackIcon /><Typography textAlign="center">Back</Typography>
            </MenuItem>
            {/* </IconButton> */}
            {/* <h5>Back</h5> */}
            {/* <Link to="/" style={{ textDecoration: 'none', color: 'inherit', marginLeft: 10 }}>
            <IconButton color="inherit">
              <HomeIcon />
            </IconButton>
          </Link> */}
            <MenuItem onClick={() => handleHome()}>
              <HomeIcon /><Typography textAlign="center">Home</Typography>
              {/* <HomeIcon /><h5>Home</h5> */}
            </MenuItem>
          </Toolbar>
        </div>

        <div style={{ display: 'flex', alignItems: 'left', width: '68%' }}>
          <Typography variant="h4" component="div" sx={{ marginLeft: '13%' }}>
            Automation of Doctor Appointment
          </Typography>
        </div>

        <div style={{ display: 'flex', alignItems: 'right', width: '8%' }}>
          <h5>Hi {username.split(' ')[0]}</h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={() => handleLogout()}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
    </AppBar>
  );

  // return (
  //   <AppBar position="static">
  //     <Toolbar>
  //         <img src={Logo} alt="Logo" style={{ width: '100px', height: 'auto', marginRight: '10px' }} />

  //         <Toolbar>
  //           <MenuItem onClick={() => window.history.back()}>
  //             <ArrowBackIcon /><Typography textAlign="center">Back</Typography>
  //           </MenuItem>

  //           <MenuItem>
  //             <HomeIcon /><Typography textAlign="center">Home</Typography>
  //           </MenuItem>
  //         </Toolbar>
      

        
  //         <Typography variant="h4" component="div" sx={{ flexGrow: 1, alignItems: 'center' }}>
  //           Automation of Doctor Appointment
  //         </Typography>
        

        
  //         <h5>Hi {username.split(' ')[0]}</h5>
  //         <Tooltip title="Logout">
  //           <IconButton color="inherit" onClick={() => handleLogout()}>
  //             <LogoutIcon />
  //           </IconButton>
  //         </Tooltip>
        
  //     </Toolbar>
  //   </AppBar>
  // );
}

export default Header;
