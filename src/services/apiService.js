import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

/**
 * API service for external services to query patient data
 * This service is designed to be used by authorized external services
 */

/**
 * Get all patients data for use by healthcare providers
 * @returns {Promise<Array>} Array of patients with their sensor data
 */
export const getAllPatientsData = async () => {
  try {
    const patientsSnapshot = await getDocs(collection(db, 'latest_sensor_data'));
    const patientsData = [];
    
    // For each patient's latest sensor data, get their profile information
    for (const patientDoc of patientsSnapshot.docs) {
      const userId = patientDoc.id;
      const sensorData = patientDoc.data();
      
      // Get the user profile
      const userProfileRef = doc(db, 'users', userId);
      const userProfileSnap = await getDoc(userProfileRef);
      
      if (userProfileSnap.exists()) {
        const userProfile = userProfileSnap.data();
        
        // Combine the data
        patientsData.push({
          userId,
          profile: userProfile,
          sensorData: {
            ...sensorData,
            timestamp: sensorData.timestamp?.toDate?.() || null
          }
        });
      }
    }
    
    return patientsData;
  } catch (error) {
    console.error('Error fetching all patients data:', error);
    throw error;
  }
};

/**
 * Get a specific patient's data by userId
 * @param {string} userId - The user ID of the patient
 * @returns {Promise<Object>} Patient data including profile and latest sensor readings
 */
export const getPatientData = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    // Get the latest sensor data
    const sensorDataRef = doc(db, 'latest_sensor_data', userId);
    const sensorDataSnap = await getDoc(sensorDataRef);
    
    // Get the user profile
    const userProfileRef = doc(db, 'users', userId);
    const userProfileSnap = await getDoc(userProfileRef);
    
    if (!sensorDataSnap.exists() || !userProfileSnap.exists()) {
      throw new Error('Patient data not found');
    }
    
    const sensorData = sensorDataSnap.data();
    const userProfile = userProfileSnap.data();
    
    // Get the sensor history (last 10 readings)
    const historyQuery = query(
      collection(db, 'sensor_data'),
      where('userId', '==', userId)
    );
    
    const historySnapshot = await getDocs(historyQuery);
    const history = [];
    
    historySnapshot.forEach(doc => {
      history.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || null
      });
    });
    
    // Sort history by timestamp (newest first)
    const sortedHistory = history.sort((a, b) => {
      const timeA = a.timestamp || new Date(0);
      const timeB = b.timestamp || new Date(0);
      return timeB - timeA;
    }).slice(0, 10);
    
    // Combine the data
    return {
      userId,
      profile: userProfile,
      sensorData: {
        ...sensorData,
        timestamp: sensorData.timestamp?.toDate?.() || null
      },
      history: sortedHistory
    };
  } catch (error) {
    console.error(`Error fetching patient data for userId ${userId}:`, error);
    throw error;
  }
};

/**
 * Get a specific type of sensor data for all patients
 * @param {string} sensorType - The type of sensor data to retrieve (e.g., 'heartRate', 'oxygenLevel')
 * @returns {Promise<Array>} Array of patients with the specified sensor data
 */
export const getSensorTypeData = async (sensorType) => {
  try {
    if (!sensorType) {
      throw new Error('Sensor type is required');
    }
    
    const patientsSnapshot = await getDocs(collection(db, 'latest_sensor_data'));
    const sensorData = [];
    
    patientsSnapshot.forEach(patientDoc => {
      const userId = patientDoc.id;
      const data = patientDoc.data();
      
      // Only include the requested sensor type in the results
      if (data[sensorType] !== undefined) {
        sensorData.push({
          userId,
          value: data[sensorType],
          timestamp: data.timestamp?.toDate?.() || null
        });
      }
    });
    
    return sensorData;
  } catch (error) {
    console.error(`Error fetching ${sensorType} data for all patients:`, error);
    throw error;
  }
};