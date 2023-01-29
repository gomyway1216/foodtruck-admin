import React, { useState } from 'react';
import { AppBar, Toolbar, List, ListItem, ListItemText, Drawer, 
  IconButton, Menu, MenuItem, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Provider/AuthProvider';
import InstantMessage from '../Component/PopUp/Alert';

const ApplicationBar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser, signOut } = useAuth();
  const [error, setError] = useState('');

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSignIn = () => {
    navigate('/signin');
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    setError('');
    try {
      await signOut();
      setAnchorEl(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleAlertClose = () => {
    setError('');
  };

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" 
            sx={{ flexGrow: 1 }} style={{ cursor: 'pointer' }}>
            Food Truck Admin
          </Typography>
          <div className="account-button-wrapper">
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {!currentUser && 
                <MenuItem onClick={handleSignIn}>Admin Sign In</MenuItem>
              }
              {currentUser && 
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              }
            </Menu>
            {error && <InstantMessage message={error}
              onClose={handleAlertClose} />
            }
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};


export default ApplicationBar;