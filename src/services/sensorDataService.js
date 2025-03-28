import { db } from '../firebase';
import { doc, setDoc, getDoc, collection, addDoc, updateDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * Service to handle sensor data storage and retrieval from Firestore
 */

/**
 * Save patient's sensor data to Firestore
 * @param {Object} sensorData - The sensor data to save
 * @returns {Promise<void>}
 */
export const saveSensorData = async (sensorData) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create a new document with a timestamp
    const sensorDataWithTimestamp = {
      ...sensorData,
      userId: user.uid,
      timestamp: serverTimestamp(),
    };

    // Add to the sensor_data collection
    const docRef = await addDoc(collection(db, 'sensor_data'), sensorDataWithTimestamp);
    
    // Also update the latest_sensor_data document for this user
    await setDoc(doc(db, 'latest_sensor_data', user.uid), sensorDataWithTimestamp);
    
    console.log('Sensor data saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving sensor data:', error);
    throw error;
  }
};

/**
 * Get the latest sensor data for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The latest sensor data
 */
export const getLatestSensorData = async (userId) => {
  try {
    if (!userId) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      userId = user.uid;
    }
    
    const docRef = doc(db, 'latest_sensor_data', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting latest sensor data:', error);
    throw error;
  }
};

/**
 * Get sensor data history for a user
 * @param {string} userId - The user ID
 * @param {number} limit - The maximum number of records to fetch
 * @returns {Promise<Array>} - Array of historical sensor data
 */
export const getSensorHistory = async (userId, limit = 20) => {
  try {
    if (!userId) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      userId = user.uid;
    }
    
    const q = query(
      collection(db, 'sensor_data'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const history = [];
    
    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort by timestamp, newest first
    return history.sort((a, b) => {
      const timeA = a.timestamp?.toDate?.() || new Date(0);
      const timeB = b.timestamp?.toDate?.() || new Date(0);
      return timeB - timeA;
    }).slice(0, limit);
  } catch (error) {
    console.error('Error getting sensor history:', error);
    throw error;
  }
};