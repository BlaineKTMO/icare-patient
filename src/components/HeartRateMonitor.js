import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent,
  IconButton, 
  Grid,
  Divider,
  Button,
  Alert,
  LinearProgress,
  CircularProgress,
  Chip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShareIcon from '@mui/icons-material/Share';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SensorsIcon from '@mui/icons-material/Sensors';
import { saveSensorData, getLatestSensorData, getSensorHistory } from '../services/sensorDataService';
import { getAuth } from 'firebase/auth';

const HeartRateMonitor = () => {
  const [heartRate, setHeartRate] = useState(null);
  const [heartRateHistory, setHeartRateHistory] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [notification, setNotification] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const animationFrameRef = useRef();
  const intervalRef = useRef();
  const dataSaveIntervalRef = useRef();

  const [sensorData, setSensorData] = useState({
    heartRate: null,
    temperature: null,
    pressure: null,
    batteryLevel: null,
    connectionStatus: 'Disconnected',
    lastSyncTime: null,
    oxygenLevel: null,
    glucoseLevel: null,
    mentalState: null
  });

  useEffect(() => {
    // Get the current user ID
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      
      // Fetch the latest data if it exists
      const loadLatestData = async () => {
        try {
          const latestData = await getLatestSensorData(user.uid);
          if (latestData) {
            setSensorData(prevState => ({
              ...prevState,
              ...latestData,
              lastSyncTime: latestData.timestamp?.toDate?.().toLocaleTimeString() || new Date().toLocaleTimeString()
            }));
            
            // If we have a heart rate value, set it in the state
            if (latestData.heartRate) {
              setHeartRate(latestData.heartRate);
            }
            
            // Load the history data
            try {
              const history = await getSensorHistory(user.uid, 20);
              if (history && history.length > 0) {
                const formattedHistory = history.map(item => ({
                  value: item.heartRate,
                  timestamp: item.timestamp instanceof Date ? 
                    item.timestamp.toISOString() : 
                    (typeof item.timestamp === 'object' && item.timestamp?.toDate ? 
                      item.timestamp.toDate().toISOString() : new Date().toISOString())
                }));
                setHeartRateHistory(formattedHistory);
              }
            } catch (historyError) {
              console.error('Error loading history data:', historyError);
            }
          }
        } catch (error) {
          console.error('Error loading latest sensor data:', error);
          setError('Failed to load sensor data');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadLatestData();
    } else {
      setIsLoading(false);
    }

    // Simulate fetching sensor data if none exists
    setTimeout(() => {
      setSensorData(prevData => {
        // Only update if we don't have data yet
        if (!prevData.heartRate) {
          const initialData = {
            heartRate: 72,
            temperature: 98.6,
            pressure: 'Normal',
            batteryLevel: 'Full',
            connectionStatus: 'Connected',
            lastSyncTime: new Date().toLocaleTimeString(),
            oxygenLevel: 98,
            glucoseLevel: 110,
            mentalState: 'Calm'
          };
          
          setHeartRate(initialData.heartRate);
          setIsLoading(false);
          return initialData;
        }
        return prevData;
      });
    }, 1000);
    
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(dataSaveIntervalRef.current);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Simulate the heart rate monitoring
  const startHeartRateMonitoring = () => {
    setIsMonitoring(true);
    setIsConnected(true);
    
    // Show connecting message
    setNotification({
      type: 'info',
      message: 'Connecting to NeuroMove sensors...'
    });
    
    // Clear previous intervals if any
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (dataSaveIntervalRef.current) clearInterval(dataSaveIntervalRef.current);
    
    // Simulate connection delay
    setTimeout(() => {
      setNotification({
        type: 'success',
        message: 'Connected to NeuroMove sensors successfully!'
      });
      
      // Create a start value within normal range
      const startValue = Math.floor(Math.random() * (85 - 65) + 65);
      setHeartRate(startValue);
      
      // Update all sensor data with random values
      setSensorData(prevData => ({
        ...prevData,
        heartRate: startValue,
        oxygenLevel: Math.floor(Math.random() * 4) + 95, // 95-99
        glucoseLevel: Math.floor(Math.random() * 30) + 90, // 90-120
        mentalState: ['Calm', 'Alert', 'Relaxed', 'Focused'][Math.floor(Math.random() * 4)],
        connectionStatus: 'Connected',
        lastSyncTime: new Date().toLocaleTimeString()
      }));
      
      // Begin updating heart rate and other sensors
      intervalRef.current = setInterval(() => {
        setHeartRate(prevRate => {
          // Simulate small fluctuations in heart rate
          const fluctuation = Math.floor(Math.random() * 7) - 3; // -3 to +3
          const newRate = prevRate + fluctuation;
          
          // Keep within reasonable bounds
          const boundedRate = Math.min(Math.max(newRate, 55), 100);
          
          // Update sensorData with the new values
          setSensorData(prevData => {
            // Occasionally update other values as well
            const newData = { ...prevData, heartRate: boundedRate };
            
            if (Math.random() > 0.7) {
              newData.oxygenLevel = Math.floor(Math.random() * 4) + 95;
            }
            
            if (Math.random() > 0.8) {
              newData.glucoseLevel = Math.floor(Math.random() * 30) + 90;
            }
            
            if (Math.random() > 0.9) {
              newData.mentalState = ['Calm', 'Alert', 'Relaxed', 'Focused'][Math.floor(Math.random() * 4)];
            }
            
            newData.lastSyncTime = new Date().toLocaleTimeString();
            return newData;
          });
          
          // Add to history every 5 seconds (approximately)
          if (Math.random() > 0.8) {
            setHeartRateHistory(prev => {
              const newHistory = [...prev, {
                value: boundedRate,
                timestamp: new Date().toISOString()
              }];
              // Keep history limited to last 20 readings
              return newHistory.slice(-20);
            });
          }
          
          return boundedRate;
        });
      }, 1000);
      
      // Start saving data to Firebase every 30 seconds
      dataSaveIntervalRef.current = setInterval(async () => {
        try {
          if (userId) {
            await saveSensorData(sensorData);
            console.log('Sensor data saved to Firestore');
          }
        } catch (error) {
          console.error('Error saving sensor data:', error);
          setNotification({
            type: 'error',
            message: 'Failed to sync data with server'
          });
        }
      }, 30000); // Every 30 seconds
      
      // Immediately save initial data
      if (userId) {
        saveSensorData(sensorData).catch(error => {
          console.error('Error saving initial sensor data:', error);
        });
      }
      
      // Start the pulse animation
      animateHeartbeat();
      
    }, 2000);
  };
  
  const stopHeartRateMonitoring = () => {
    setIsMonitoring(false);
    clearInterval(intervalRef.current);
    clearInterval(dataSaveIntervalRef.current);
    cancelAnimationFrame(animationFrameRef.current);
    
    // Final save when stopping monitoring
    if (userId) {
      saveSensorData(sensorData).catch(error => {
        console.error('Error saving final sensor data:', error);
      });
    }
    
    setNotification({
      type: 'info',
      message: 'Monitoring paused. Data saved.'
    });
  };
  
  const animateHeartbeat = () => {
    // Pulse animation for the heart icon
    const heartIcon = document.getElementById('heart-icon');
    if (heartIcon) {
      const pulse = () => {
        heartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
          heartIcon.style.transform = 'scale(1)';
        }, 150);
        
        animationFrameRef.current = requestAnimationFrame(() => {
          setTimeout(pulse, 800 + Math.random() * 200);
        });
      };
      
      pulse();
    }
  };
  
  const getHeartRateDescription = (rate) => {
    if (!rate) return { text: 'Not available', color: 'text.secondary' };
    
    if (rate < 60) return { text: 'Below normal', color: '#ff9800' };
    if (rate >= 60 && rate <= 100) return { text: 'Normal', color: '#4caf50' };
    return { text: 'Above normal', color: '#f44336' };
  };
  
  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <Box sx={{ py: 2 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        {notification && (
          <Alert 
            severity={notification.type} 
            sx={{ mb: 2 }}
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </Alert>
        )}
        
        <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Wheelchair Monitor
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Real-time monitoring from your NeuroMove
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                    <FavoriteIcon sx={{ mr: 1, color: 'error.main' }} />
                    Heart Rate
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                    {sensorData.heartRate || '--'} BPM
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Rate
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                    <InfoOutlinedIcon sx={{ mr: 1, color: 'info.main' }} />
                    Oxygen Level
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                    {sensorData.oxygenLevel || '--'}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Level
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                    <InfoOutlinedIcon sx={{ mr: 1, color: 'success.main' }} />
                    Blood Glucose Level
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {sensorData.glucoseLevel || '--'} mg/dL
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Level
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                    <InfoOutlinedIcon sx={{ mr: 1, color: 'warning.main' }} />
                    Mental State
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {sensorData.mentalState || '--'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current State
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                    <InfoOutlinedIcon sx={{ mr: 1 }} />
                    Battery Status
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Current Status: {sensorData.batteryLevel}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                    <InfoOutlinedIcon sx={{ mr: 1 }} />
                    Connection Status
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Currently Connected: {sensorData.connectionStatus}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color={isMonitoring ? "error" : "success"}
            size="large"
            sx={{ 
              borderRadius: 28,
              px: 3,
              py: 1.5,
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
            startIcon={isMonitoring ? null : <SensorsIcon />}
            onClick={isMonitoring ? stopHeartRateMonitoring : startHeartRateMonitoring}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, p: 2, borderRadius: 1, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
            The NeuroMove sensors monitor your wheelchair in real-time. If abnormal patterns are detected, automatic alerts will be sent to your healthcare provider.
          </Typography>
        </Box>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Last Updated: {sensorData.lastSyncTime || new Date().toLocaleTimeString()}
          </Typography>
          {userId && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              User ID: {userId}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default HeartRateMonitor;