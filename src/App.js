import React, { useState } from 'react';
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
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  ThemeProvider,
  createTheme
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import WarningIcon from '@mui/icons-material/Warning';
import SendIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './App.css';
import Profile from './components/Profile';
import SignUp from './components/SignUp';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#FF4081',
    },
  },
});

function App() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAlertClick = () => {
    setAlertOpen(true);
    console.log('Alert sent to caregiver!');
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleCallClick = () => {
    console.log('Calling caregiver...');
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return <SignUp onSignUpSuccess={() => setIsLoggedIn(true)} />;
    }

    switch (currentTab) {
      case 0:
        return (
          <Box className="home-content">
            <Typography variant="h4" className="welcome-text">
              Welcome to Caregiver Connect
            </Typography>
            <Button 
              variant="contained" 
              className="emergency-button"
              size="large"
              onClick={handleAlertClick}
              startIcon={<WarningIcon />}
            >
              Send Emergency Alert
            </Button>
            <Profile />
          </Box>
        );
      case 1:
        return (
          <Box className="call-content">
            <Typography variant="h5" className="section-title">
              Contact Your Caregiver
            </Typography>
            <Button 
              variant="contained" 
              className="call-button"
              size="large"
              onClick={handleCallClick}
              startIcon={<PhoneIcon />}
            >
              Call Caregiver
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box className="chat-content">
            <Typography variant="h5" className="section-title">
              Message Your Caregiver
            </Typography>
            <Box className="chat-messages">
              {/* Messages would appear here */}
            </Box>
            <Box className="chat-input">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <IconButton 
                color="primary" 
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {isLoggedIn && (
          <AppBar position="fixed" className="app-bar">
            <Toolbar>
              <Typography variant="h6" className="app-title">
                Caregiver Connect
              </Typography>
            </Toolbar>
          </AppBar>
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
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            <BottomNavigationAction label="Call" icon={<PhoneIcon />} />
            <BottomNavigationAction label="Chat" icon={<ChatIcon />} />
            <BottomNavigationAction label="Heart Rate" icon={<FavoriteIcon />} />
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
            severity="success" 
            className="alert-snackbar"
            sx={{ width: '100%' }}
          >
            Alert sent to your caregiver! They will be notified immediately.
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default App;