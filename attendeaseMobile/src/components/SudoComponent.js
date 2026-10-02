
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, PermissionsAndroid, Linking } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const ScreenTwo = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      const granted = await requestLocationPermission();
      if (granted) {
        Geolocation.getCurrentPosition(
          position => {
            setLocation(position);
            setErrorMessage('');
          },
          error => {
            console.log('Error getting location:', error);
            setErrorMessage('Error getting location. Please try again.');
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        setErrorMessage('Location permission denied.');
      }
    } catch (err) {
      console.log('Error:', err);
      setErrorMessage('Error getting location. Please try again.');
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Error requesting location permission:', err);
      return false;
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLocation();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const openAppSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Location Status:</Text>
      {location ? (
        <Text style={styles.text}>
          Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}
        </Text>
      ) : (
        <Text style={styles.error}>{errorMessage}</Text>
      )}
      <Button title="Refresh" onPress={handleRefresh} disabled={refreshing} />
      {!location && (
        <View style={styles.settingsButton}>
          <Button title="Open Settings" onPress={openAppSettings} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  settingsButton: {
    marginTop: 20,
  },
});
