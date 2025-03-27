import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Link
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// Firebase imports
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const steps = ['User Account', 'Contact Information', 'Medical Information', 'Emergency Contact'];

const SignUp = ({ onLoginClick }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [formData, setFormData] = useState({
    user: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    contact: {
      name: '',
      age: '',
      number: '',
      email: ''
    },
    medical: {
      bloodtype: '',
      height: '',
      weight: '',
      lastcheckup: null,
      conditions: [],
      medications: [],
      diet: []
    },
    emergency: {
      name: '',
      phone: ''
    }
  });

  const [tempInputs, setTempInputs] = useState({
    condition: '',
    medication: '',
    diet: ''
  });

  const handleNext = () => {
    if (!validateStep()) return;
    
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayInput = (type, value) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        medical: {
          ...prev.medical,
          [type]: [...prev.medical[type], value.trim()]
        }
      }));
      setTempInputs(prev => ({ ...prev, [type]: '' }));
    }
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!formData.user.email || !formData.user.password) {
          setError('Please fill in all required fields');
          return false;
        }
        if (formData.user.password !== formData.user.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (formData.user.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return false;
        }
        break;
      case 1:
        if (!formData.contact.name || !formData.contact.email || !formData.contact.number) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 2:
        if (!formData.medical.bloodtype || !formData.medical.height || !formData.medical.weight) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 3:
        if (!formData.emergency.name || !formData.emergency.phone) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      default:
        return true;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.user.email, 
        formData.user.password
      );
      
      const userId = userCredential.user.uid;
      
      // Prepare patient data for Firestore
      const patientData = {
        contact: formData.contact,
        medical: {
          ...formData.medical,
          // Convert Date object to timestamp if it exists
          lastcheckup: formData.medical.lastcheckup ? formData.medical.lastcheckup.toISOString() : null
        },
        emergency: formData.emergency,
        createdAt: new Date().toISOString(),
      };
      
      // Store patient data in Firestore
      await setDoc(doc(db, "patients", userId), patientData);

      // Show success message
      setSnackbarMessage('Registration successful! You can now log in.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Redirect to login page after 2 seconds using the provided onLoginClick function
      setTimeout(() => {
        if (onLoginClick) onLoginClick();
      }, 2000);
      
    } catch (error) {
      let errorMessage = 'Registration failed';
      
      // Handle common Firebase error codes for authentication
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use. Please use a different email or login.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use a stronger password.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.user.email}
              onChange={(e) => handleInputChange('user', 'email', e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.user.password}
              onChange={(e) => handleInputChange('user', 'password', e.target.value)}
              margin="normal"
              required
              helperText="Password must be at least 6 characters"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={formData.user.confirmPassword}
              onChange={(e) => handleInputChange('user', 'confirmPassword', e.target.value)}
              margin="normal"
              required
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.contact.name}
              onChange={(e) => handleInputChange('contact', 'name', e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Age"
              type="number"
              value={formData.contact.age}
              onChange={(e) => handleInputChange('contact', 'age', e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.contact.number}
              onChange={(e) => handleInputChange('contact', 'number', e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.contact.email}
              onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
              margin="normal"
              required
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Blood Type"
                  value={formData.medical.bloodtype}
                  onChange={(e) => handleInputChange('medical', 'bloodtype', e.target.value)}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Height"
                  value={formData.medical.height}
                  onChange={(e) => handleInputChange('medical', 'height', e.target.value)}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight"
                  value={formData.medical.weight}
                  onChange={(e) => handleInputChange('medical', 'weight', e.target.value)}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Last Checkup"
                    value={formData.medical.lastcheckup}
                    onChange={(date) => handleInputChange('medical', 'lastcheckup', date)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Medical Conditions</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  value={tempInputs.condition}
                  onChange={(e) => setTempInputs(prev => ({ ...prev, condition: e.target.value }))}
                  placeholder="Add condition"
                  size="small"
                />
                <IconButton onClick={() => handleArrayInput('conditions', tempInputs.condition)}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {formData.medical.conditions.map((condition, index) => (
                  <Chip key={index} label={condition} onDelete={() => {
                    const newConditions = formData.medical.conditions.filter((_, i) => i !== index);
                    handleInputChange('medical', 'conditions', newConditions);
                  }} />
                ))}
              </Box>

              <Typography variant="subtitle1">Medications</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  value={tempInputs.medication}
                  onChange={(e) => setTempInputs(prev => ({ ...prev, medication: e.target.value }))}
                  placeholder="Add medication"
                  size="small"
                />
                <IconButton onClick={() => handleArrayInput('medications', tempInputs.medication)}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {formData.medical.medications.map((medication, index) => (
                  <Chip key={index} label={medication} onDelete={() => {
                    const newMedications = formData.medical.medications.filter((_, i) => i !== index);
                    handleInputChange('medical', 'medications', newMedications);
                  }} />
                ))}
              </Box>

              <Typography variant="subtitle1">Dietary Restrictions</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  value={tempInputs.diet}
                  onChange={(e) => setTempInputs(prev => ({ ...prev, diet: e.target.value }))}
                  placeholder="Add dietary restriction"
                  size="small"
                />
                <IconButton onClick={() => handleArrayInput('diet', tempInputs.diet)}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.medical.diet.map((diet, index) => (
                  <Chip key={index} label={diet} onDelete={() => {
                    const newDiet = formData.medical.diet.filter((_, i) => i !== index);
                    handleInputChange('medical', 'diet', newDiet);
                  }} />
                ))}
              </Box>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Emergency Contact Name"
              value={formData.emergency.name}
              onChange={(e) => handleInputChange('emergency', 'name', e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Emergency Contact Phone"
              value={formData.emergency.phone}
              onChange={(e) => handleInputChange('emergency', 'phone', e.target.value)}
              margin="normal"
              required
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Patient Registration
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </Box>
        
        {/* Add a "Back to Login" link */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link href="#" variant="body2" onClick={onLoginClick}>
            Already have an account? Sign In
          </Link>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage || 'Registration successful!'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignUp;