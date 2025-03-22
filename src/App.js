import React from 'react';
import { Container, Typography, Card, CardContent, Grid, CardMedia } from '@mui/material';
import './App.css';

const patients = [
  { id: 1, name: 'John Doe', age: 65, condition: 'Diabetes' },
  { id: 2, name: 'Jane Smith', age: 70, condition: 'Hypertension' },
  { id: 3, name: 'Sam Johnson', age: 80, condition: 'Arthritis' },
];

function App() {
  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom align="center" style={{ marginTop: '20px' }}>
        Welcome to the Caregiver App
      </Typography>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {patients.map((patient) => (
          <Grid item xs={12} sm={6} md={4} key={patient.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`https://via.placeholder.com/150?text=${patient.name}`}
                alt={patient.name}
              />
              <CardContent>
                <Typography variant="h5" component="h2">
                  {patient.name}
                </Typography>
                <Typography color="textSecondary">
                  Age: {patient.age}
                </Typography>
                <Typography color="textSecondary">
                  Condition: {patient.condition}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;