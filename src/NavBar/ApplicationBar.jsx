import React, { useState } from 'react';
import {
  AppBar, Box, Toolbar, List, ListItemButton, ListItem, ListItemIcon, ListItemText, Drawer,
  IconButton, Menu, MenuItem, Typography
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Provider/AuthProvider';
import InstantMessage from '../Component/PopUp/Alert';

const ApplicationBar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser, signOut } = useAuth();
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };

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

  const handleDrawerMenuClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem key="menu-page" disablePadding onClick={() => handleDrawerMenuClick('/')}>
          <ListItemButton>
            <ListItemIcon>
              <FastfoodIcon />
            </ListItemIcon>
            <ListItemText primary="Menu" />
          </ListItemButton>
        </ListItem>
        <ListItem key="menu-feedback" disablePadding onClick={() => handleDrawerMenuClick('/feedback')}>
          <ListItemButton>
            <ListItemIcon>
              <ChatBubbleIcon />
            </ListItemIcon>
            <ListItemText primary="Feedback" />
          </ListItemButton>
        </ListItem>
        <ListItem key="menu-schedule" disablePadding onClick={() => handleDrawerMenuClick('/schedule')}>
          <ListItemButton>
            <ListItemIcon>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary="Schedule" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
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
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};


export default ApplicationBar;