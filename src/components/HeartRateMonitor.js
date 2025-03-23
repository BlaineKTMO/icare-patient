import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const FITBIT_CLIENT_ID = '23Q53D';
const FITBIT_REDIRECT_URI = 'http://localhost:3000/callback';
const FITBIT_AUTH_URI = 'https://www.fitbit.com/oauth2/authorize';
const FITBIT_TOKEN_URI = 'https://api.fitbit.com/oauth2/token';

const HeartRateMonitor = () => {
  const [heartRate, setHeartRate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeHeartRateSensor = async () => {
      try {
        // Check if we have access to the heart rate sensor
        if (HeartRateSensor) {
          const hrm = new HeartRateSensor();
          
          hrm.addEventListener("reading", () => {
            setHeartRate(hrm.heartRate);
            setIsLoading(false);
          });

          hrm.addEventListener("error", (error) => {
            setError("Error reading heart rate data");
            setIsLoading(false);
          });

          hrm.start();
        } else {
          setError("Heart rate sensor not available on this device");
          setIsLoading(false);
        }
      } catch (err) {
        setError("Failed to initialize heart rate sensor");
        setIsLoading(false);
      }
    };

    initializeHeartRateSensor();
  }, []);

  const handleFitbitAuth = () => {
    const scope = 'heartrate';
    const authUrl = `${FITBIT_AUTH_URI}?client_id=${FITBIT_CLIENT_ID}&response_type=code&redirect_uri=${FITBIT_REDIRECT_URI}&scope=${scope}`;
    window.location.href = authUrl;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Heart Rate Monitor
      </Typography>
      
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <FavoriteIcon color="error" />
          <Typography variant="h4">
            {heartRate} BPM
          </Typography>
        </Box>
      )}

      <Typography variant="body2" sx={{ mt: 2 }}>
        Last updated: {new Date().toLocaleTimeString()}
      </Typography>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Note: This feature requires a compatible device with heart rate monitoring capabilities.
      </Typography>
    </Paper>
  );
};

export default HeartRateMonitor; 