import React from 'react';
import { Container, Typography, Card, CardContent, Grid } from '@mui/material';
import './App.css';

const patients = [
  { id: 1, name: 'John Doe', age: 65, condition: 'Diabetes' },
  { id: 2, name: 'Jane Smith', age: 70, condition: 'Hypertension' },
  { id: 3, name: 'Sam Johnson', age: 80, condition: 'Arthritis' },
];

function App() {
  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to the Caregiver App
      </Typography>
      <Grid container spacing={3}>
        {patients.map((patient) => (
          <Grid item xs={12} sm={6} md={4} key={patient.id}>
            <Card>
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