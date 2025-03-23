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
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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

const steps = ['User Account', 'Contact Information', 'Medical Information', 'Emergency Contact'];

const SignUp = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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
      const response = await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSnackbarOpen(true);
      // Handle successful signup (e.g., redirect to login)
    } catch (err) {
      setError(err.message);
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
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="Registration successful!"
      />
    </Container>
  );
};

export default SignUp; 