import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Snackbar, 
  Alert, 
  TextField, 
  IconButton, 
  Paper, 
  Box,
  Avatar,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  ThemeProvider,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Fade
} from '@mui/material';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import WarningIcon from '@mui/icons-material/Warning';
import SendIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';

// Custom theme and components
import './App.css';
import theme from './theme';
import Profile from './components/Profile';
import SignUp from './components/SignUp';
import Login from './components/Login';
import HeartRateMonitor from './components/HeartRateMonitor';

// Firebase auth
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [message, setMessage] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authScreen, setAuthScreen] = useState('login');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use Firebase auth state change listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        // User is signed in
        setIsLoggedIn(true);
        setCurrentUser(user);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('uid', user.uid);
      } else {
        // User is signed out
        setIsLoggedIn(false);
        setCurrentUser(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('uid');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showAlert('Successfully logged out', 'success');
      // The onAuthStateChanged listener will handle updating the UI
    } catch (error) {
      console.error("Error signing out: ", error);
      showAlert('Failed to log out. Please try again.', 'error');
    }
  };

  const handleAlertClick = () => {
    showAlert('Emergency alert sent to your caregiver! They will be notified immediately.', 'error');
    console.log('Alert sent to caregiver!');
  };

  const showAlert = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleCallClick = () => {
    showAlert('Initiating call to your caregiver...', 'info');
    console.log('Calling caregiver...');
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      showAlert('Message sent!', 'success');
      setMessage('');
    }
  };

  const showLogin = () => {
    setAuthScreen('login');
  };

  const showSignUp = () => {
    setAuthScreen('signup');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavigation = (newValue) => {
    setCurrentTab(newValue);
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      // Return either Login or SignUp based on authScreen state
      if (authScreen === 'signup') {
        return <SignUp onLoginClick={showLogin} />;
      } else {
        return <Login onLoginSuccess={() => setIsLoggedIn(true)} onSignUpClick={showSignUp} />;
      }
    }

    switch (currentTab) {
      case 0:
        return (
          <Box className="home-content">
            <Fade in={true} timeout={800}>
              <Typography variant="h4" className="welcome-text">
                Welcome to Caregiver Connect
                {currentUser && currentUser.displayName ? `, ${currentUser.displayName.split(' ')[0]}` : ''}
              </Typography>
            </Fade>

            <Fade in={true} timeout={1000} style={{ transitionDelay: '150ms' }}>
              <Button 
                variant="contained" 
                className="emergency-button"
                size="large"
                onClick={handleAlertClick}
                startIcon={<WarningIcon />}
              >
                Send Emergency Alert
              </Button>
            </Fade>

            <Fade in={true} timeout={1200} style={{ transitionDelay: '300ms' }}>
              <Box sx={{ width: '100%' }}>
                <Profile />
              </Box>
            </Fade>
          </Box>
        );
      case 1:
        return (
          <Box className="call-content">
            <Fade in={true} timeout={600}>
              <Typography variant="h5" className="section-title">
                Contact Your Caregiver
              </Typography>
            </Fade>
            <Fade in={true} timeout={800} style={{ transitionDelay: '150ms' }}>
              <Button 
                variant="contained" 
                className="call-button"
                size="large"
                onClick={handleCallClick}
                startIcon={<PhoneIcon />}
              >
                Call Caregiver
              </Button>
            </Fade>
          </Box>
        );
      case 2:
        return (
          <Box className="chat-content">
            <Fade in={true} timeout={600}>
              <Typography variant="h5" className="section-title">
                Message Your Caregiver
              </Typography>
            </Fade>

            <Box className="chat-messages">
              {/* This will be replaced with actual chat messages */}
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                opacity: 0.6
              }}>
                <ChatIcon sx={{ fontSize: 60, color: '#2563EB', mb: 2, opacity: 0.4 }} />
                <Typography variant="body1" color="textSecondary">
                  No messages yet. Start a conversation with your caregiver.
                </Typography>
              </Box>
            </Box>

            <Fade in={true} timeout={800} style={{ transitionDelay: '300ms' }}>
              <Box className="chat-input">
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  size="medium"
                  InputProps={{
                    sx: { borderRadius: 3 }
                  }}
                />
                <IconButton 
                  color="primary" 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  sx={{ 
                    bgcolor: message.trim() ? 'primary.main' : 'grey.300',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                    width: 48,
                    height: 48
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Fade>
          </Box>
        );
      case 3:
        return <HeartRateMonitor />;
      default:
        return null;
    }
  };

  // Drawer content for side menu
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar 
          alt={currentUser?.email || 'User'} 
          src={currentUser?.photoURL} 
          sx={{ width: 64, height: 64, bgcolor: 'primary.main', mb: 1 }}
        >
          {!currentUser?.photoURL && <AccountCircleIcon fontSize="large" />}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {currentUser?.displayName || currentUser?.email || 'Welcome'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Patient Account
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button onClick={() => handleNavigation(0)}>
          <ListItemIcon><HomeIcon color={currentTab === 0 ? 'primary' : undefined} /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation(3)}>
          <ListItemIcon><FavoriteIcon color={currentTab === 3 ? 'primary' : undefined} /></ListItemIcon>
          <ListItemText primary="Heart Monitor" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation(2)}>
          <ListItemIcon><ChatIcon color={currentTab === 2 ? 'primary' : undefined} /></ListItemIcon>
          <ListItemText primary="Messages" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation(1)}>
          <ListItemIcon><PhoneIcon color={currentTab === 1 ? 'primary' : undefined} /></ListItemIcon>
          <ListItemText primary="Call" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><HelpIcon /></ListItemIcon>
          <ListItemText primary="Help & Support" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            background: 'var(--background-gradient)'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <FavoriteIcon 
              sx={{ 
                fontSize: 60, 
                color: '#2563EB',
                animation: 'pulse 1.5s infinite ease-in-out'
              }} 
            />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
              Caregiver Connect
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {isLoggedIn && (
          <>
            <AppBar position="fixed" className="app-bar" elevation={0}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 1 }}
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" className="app-title" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
                  Caregiver Connect
                </Typography>
                <Tooltip title="Notifications">
                  <IconButton color="inherit" sx={{ mr: 1 }}>
                    <Badge badgeContent={2} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Tooltip title={currentUser?.email || 'Account'}>
                  <IconButton color="inherit">
                    <Avatar 
                      src={currentUser?.photoURL} 
                      sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}
                    >
                      {!currentUser?.photoURL && 
                        (currentUser?.displayName 
                          ? currentUser.displayName.charAt(0).toUpperCase() 
                          : currentUser?.email?.charAt(0).toUpperCase())}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Toolbar>
            </AppBar>

            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {drawerContent}
            </Drawer>
          </>
        )}

        <Container className="app-container">
          {renderContent()}
        </Container>

        {isLoggedIn && (
          <BottomNavigation
            value={currentTab}
            onChange={(event, newValue) => {
              setCurrentTab(newValue);
            }}
            showLabels
            className="bottom-nav"
          >
            <BottomNavigationAction 
              label="Home" 
              icon={<HomeIcon />} 
              className={currentTab === 0 ? "bottom-nav-action active" : "bottom-nav-action"} 
            />
            <BottomNavigationAction 
              label="Call" 
              icon={<PhoneIcon />} 
              className={currentTab === 1 ? "bottom-nav-action active" : "bottom-nav-action"} 
            />
            <BottomNavigationAction 
              label="Chat" 
              icon={<ChatIcon />} 
              className={currentTab === 2 ? "bottom-nav-action active" : "bottom-nav-action"} 
            />
            <BottomNavigationAction 
              label="Health" 
              icon={<FavoriteIcon />} 
              className={currentTab === 3 ? "bottom-nav-action active" : "bottom-nav-action"} 
            />
          </BottomNavigation>
        )}

        <Snackbar 
          open={alertOpen} 
          autoHideDuration={6000} 
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseAlert} 
            severity={alertSeverity} 
            className={`alert-snackbar ${alertSeverity}`}
            sx={{ width: '100%' }}
            variant="filled"
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default App;