import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Avatar, 
  Grid,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import HeightIcon from '@mui/icons-material/Height';
import ScaleIcon from '@mui/icons-material/Scale';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import RestaurantIcon from '@mui/icons-material/Restaurant';
// Firebase imports
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  // Update date formatting function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '/');
    } catch (error) {
      return dateString; // Return original string if date parsing fails
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get the user ID from localStorage
        const uid = localStorage.getItem('uid');
        
        if (!uid) {
          setError('No user found. Please login again.');
          setLoading(false);
          return;
        }

        // Get user profile from Firestore
        const userDocRef = doc(db, "patients", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // Structure the data to match the expected format
          const userData = userDocSnap.data();
          setUserProfile({
            contact: userData.contact || {},
            medical: userData.medical || {
              conditions: [],
              medications: [],
              diet: []
            },
            emergency: userData.emergency || {}
          });
        } else {
          setError('User profile not found');
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError('Failed to load profile: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = async (action) => {
    switch (action) {
      case 'edit':
        // Implement edit functionality
        break;
      case 'settings':
        // Implement settings functionality
        break;
      case 'logout':
        try {
          await signOut(auth);
          // Firebase auth state listener in App.js will handle the rest
        } catch (error) {
          console.error("Error signing out:", error);
        }
        break;
      default:
        break;
    }
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!userProfile) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No profile data available</Typography>
      </Box>
    );
  }

  const accordionStyles = {
    '&:before': {
      display: 'none',
    },
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  };

  const summaryStyles = {
    borderRadius: '8px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateX(5px)',
    },
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mt: 3, 
        maxWidth: 600, 
        width: '100%',
        borderRadius: '16px',
        background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3, 
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
        p: 3,
        borderRadius: '12px',
        color: 'white',
        boxShadow: '0 4px 20px rgba(33, 150, 243, 0.2)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              mr: 2, 
              bgcolor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              border: '3px solid white',
            }}
          >
            <PersonIcon sx={{ fontSize: 40, color: '#2196F3' }} />
          </Avatar>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              {userProfile.contact.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Age: {userProfile.contact.age}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleMenuClick} sx={{ color: 'white' }}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              borderRadius: '12px',
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
        >
          <MenuItem onClick={() => handleMenuItemClick('edit')}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('settings')}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('logout')}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      <Accordion defaultExpanded sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            ...summaryStyles,
            bgcolor: '#e3f2fd',
            borderRadius: '8px',
            '&:hover': { 
              bgcolor: '#bbdefb',
              transform: 'translateX(5px)',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ContactMailIcon sx={{ mr: 1, color: '#1976d2' }} />
            <Typography sx={{ fontWeight: 'bold' }}>Contact Information</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                p: 1,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}>
                <PhoneIcon sx={{ mr: 1, color: '#2196F3' }} />
                <Typography variant="body1">{userProfile.contact.number}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                p: 1,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}>
                <EmailIcon sx={{ mr: 1, color: '#2196F3' }} />
                <Typography variant="body1">{userProfile.contact.email}</Typography>
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            ...summaryStyles,
            bgcolor: '#e3f2fd',
            borderRadius: '8px',
            '&:hover': { 
              bgcolor: '#bbdefb',
              transform: 'translateX(5px)',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MedicalServicesIcon sx={{ mr: 1, color: '#1976d2' }} />
            <Typography sx={{ fontWeight: 'bold' }}>Medical Information</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                p: 1,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}>
                <BloodtypeIcon sx={{ mr: 1, color: '#2196F3' }} />
                <Typography variant="body1">Blood Type: {userProfile.medical.bloodtype}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                p: 1,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}>
                <HeightIcon sx={{ mr: 1, color: '#2196F3' }} />
                <Typography variant="body1">Height: {userProfile.medical.height}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                p: 1,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}>
                <ScaleIcon sx={{ mr: 1, color: '#2196F3' }} />
                <Typography variant="body1">Weight: {userProfile.medical.weight}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                p: 1,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}>
                <AccessTimeIcon sx={{ mr: 1, color: '#2196F3' }} />
                <Typography variant="body1">Last Checkup: {formatDate(userProfile.medical.lastcheckup)}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Conditions</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {userProfile.medical.conditions && userProfile.medical.conditions.map((condition, index) => (
                  <Box
                    key={index}
                    sx={{
                      bgcolor: '#e3f2fd',
                      color: '#1976d2',
                      px: 2,
                      py: 1,
                      borderRadius: '16px',
                      fontSize: '0.875rem',
                    }}
                  >
                    {condition}
                  </Box>
                ))}
                {(!userProfile.medical.conditions || userProfile.medical.conditions.length === 0) && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    No conditions listed
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Medications</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {userProfile.medical.medications && userProfile.medical.medications.map((medication, index) => (
                  <Box
                    key={index}
                    sx={{
                      bgcolor: '#e3f2fd',
                      color: '#1976d2',
                      px: 2,
                      py: 1,
                      borderRadius: '16px',
                      fontSize: '0.875rem',
                    }}
                  >
                    {medication}
                  </Box>
                ))}
                {(!userProfile.medical.medications || userProfile.medical.medications.length === 0) && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    No medications listed
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Dietary Restrictions</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {userProfile.medical.diet && userProfile.medical.diet.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      bgcolor: '#e3f2fd',
                      color: '#1976d2',
                      px: 2,
                      py: 1,
                      borderRadius: '16px',
                      fontSize: '0.875rem',
                    }}
                  >
                    {item}
                  </Box>
                ))}
                {(!userProfile.medical.diet || userProfile.medical.diet.length === 0) && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    No dietary restrictions listed
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            ...summaryStyles,
            bgcolor: '#e3f2fd',
            borderRadius: '8px',
            '&:hover': { 
              bgcolor: '#bbdefb',
              transform: 'translateX(5px)',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FavoriteIcon sx={{ mr: 1, color: '#1976d2' }} />
            <Typography sx={{ fontWeight: 'bold' }}>Emergency Contact</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                p: 1,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}>
                <PersonIcon sx={{ mr: 1, color: '#2196F3' }} />
                <Typography variant="body1">{userProfile.emergency.name}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                p: 1,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}>
                <PhoneIcon sx={{ mr: 1, color: '#2196F3' }} />
                <Typography variant="body1">{userProfile.emergency.phone}</Typography>
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default Profile;