import React, { useState } from 'react';
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
  useTheme
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

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  // This would typically come from your backend/state management
  const userProfile = {
    name: "John Doe",
    age: 65,
    phone: "(555) 123-4567",
    email: "john.doe@example.com",
    address: "123 Main St, Anytown, USA",
    conditions: ["Hypertension", "Type 2 Diabetes"],
    medications: ["Lisinopril", "Metformin"],
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phone: "(555) 987-6543"
    },
    personalInfo: {
      bloodType: "A+",
      height: "5'10\"",
      weight: "170 lbs",
      lastCheckup: "2024-02-15",
      preferredLanguage: "English",
      dietaryRestrictions: ["Low Sodium", "Low Sugar"]
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action) => {
    console.log(`Selected action: ${action}`);
    handleMenuClose();
  };

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
              {userProfile.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Age: {userProfile.age}
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
                <Typography variant="body1">{userProfile.phone}</Typography>
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
                <Typography variant="body1">{userProfile.email}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                p: 1,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}>
                <LocationOnIcon sx={{ mr: 1, color: '#2196F3' }} />
                <Typography variant="body1">{userProfile.address}</Typography>
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
            bgcolor: '#f3e5f5',
            borderRadius: '8px',
            '&:hover': { 
              bgcolor: '#e1bee7',
              transform: 'translateX(5px)',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MedicalServicesIcon sx={{ mr: 1, color: '#7b1fa2' }} />
            <Typography sx={{ fontWeight: 'bold' }}>Medical Information</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                p: 1,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}>
                <BloodtypeIcon sx={{ mr: 1, color: '#2196F3' }} />
                <Typography variant="body2">Blood Type: {userProfile.personalInfo.bloodType}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                p: 1,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}>
                <HeightIcon sx={{ mr: 1, color: '#2196F3' }} />
                <Typography variant="body2">Height: {userProfile.personalInfo.height}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                p: 1,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}>
                <ScaleIcon sx={{ mr: 1, color: '#2196F3' }} />
                <Typography variant="body2">Weight: {userProfile.personalInfo.weight}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                p: 1,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}>
                <AccessTimeIcon sx={{ mr: 1, color: '#2196F3' }} />
                <Typography variant="body2">Last Checkup: {userProfile.personalInfo.lastCheckup}</Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Conditions:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {userProfile.conditions.map((condition, index) => (
              <Paper 
                key={index} 
                sx={{ 
                  px: 2, 
                  py: 1, 
                  bgcolor: '#e3f2fd',
                  color: '#1976d2',
                  borderRadius: '20px',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                  }
                }}
              >
                {condition}
              </Paper>
            ))}
          </Box>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Medications:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {userProfile.medications.map((medication, index) => (
              <Paper 
                key={index} 
                sx={{ 
                  px: 2, 
                  py: 1, 
                  bgcolor: '#f3e5f5',
                  color: '#7b1fa2',
                  borderRadius: '20px',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(123, 31, 162, 0.2)',
                  }
                }}
              >
                {medication}
              </Paper>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            ...summaryStyles,
            bgcolor: '#e8f5e9',
            borderRadius: '8px',
            '&:hover': { 
              bgcolor: '#c8e6c9',
              transform: 'translateX(5px)',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RestaurantIcon sx={{ mr: 1, color: '#2e7d32' }} />
            <Typography sx={{ fontWeight: 'bold' }}>Dietary Information</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {userProfile.personalInfo.dietaryRestrictions.map((restriction, index) => (
              <Paper 
                key={index} 
                sx={{ 
                  px: 2, 
                  py: 1, 
                  bgcolor: '#e8f5e9',
                  color: '#2e7d32',
                  borderRadius: '20px',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
                  }
                }}
              >
                {restriction}
              </Paper>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            ...summaryStyles,
            bgcolor: '#ffebee',
            borderRadius: '8px',
            '&:hover': { 
              bgcolor: '#ffcdd2',
              transform: 'translateX(5px)',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalHospitalIcon sx={{ mr: 1, color: '#c62828' }} />
            <Typography sx={{ fontWeight: 'bold' }}>Emergency Contact</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ 
            p: 2, 
            borderRadius: '8px',
            bgcolor: '#fff5f5',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(198, 40, 40, 0.1)',
            }
          }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {userProfile.emergencyContact.name} ({userProfile.emergencyContact.relationship})
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {userProfile.emergencyContact.phone}
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default Profile; 