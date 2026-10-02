import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, PermissionsAndroid, Animated, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Linking } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useAuth } from "../../contexts/Auth";
import { Avatar, List } from 'react-native-paper';
import { getActivePortalForStudents, markAttendance } from '../../actions/authActions';

export const ScreenTwo = ({ navigation }) => {

  const { authData } = useAuth();
  const subjects = authData?.user?.studentData?.subjects;
  const subjectType = authData?.user?.studentData?.subjectType;
  const batches = authData?.user?.studentData?.batch;
  const [selectedClass, setSelectedClass] = useState(null);

  const [refresh, setRefresh] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [locationDistance, setLocationDistance] = useState('');

  const animatedHeight = React.useRef(new Animated.Value(0)).current;

  const toggleAccordion = () => {
    const initialValue = expanded ? 500 : 0;
    const finalValue = expanded ? 0 : 500;
    setExpanded(expanded => !expanded);

    animatedHeight.setValue(initialValue);
    Animated.timing(animatedHeight, {
      toValue: finalValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const targetLatitude = 19.072591; //Baskaracharya coordinates
  const targetLongitude = 72.900493; //Baskaracharya coordinates
  const radiusInMeters = 50; // Adjust the radius as needed (e.g., 500 meters)

  const [isInLocation, setIsInLocation] = useState(false);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180; // Convert degrees to radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };

  const checkIfInRadius = (userLatitude, userLongitude, targetLatitude, targetLongitude, radiusInMeters) => {
    const distance = calculateDistance(userLatitude, userLongitude, targetLatitude, targetLongitude);
    console.log('Distance:', distance, 'Radius:', radiusInMeters);
    setLocationDistance(distance)
    return distance <= radiusInMeters;
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

  const onRefresh = () => {
    console.log("Refreshing...");
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  };

  const handleRefresh = () => {
    setRefresh(true);
    getLocation();
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  };

  useEffect(() => {
    getLocation();
  }, []);

  const [location, setLocation] = useState(null);
  const [activeAttendance, setActiveAttendance] = useState(null);
  const [attendanceError, setAttendanceError] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [portalLocation, setPortalLocation] = useState(null);

  const getLocation = () => {
    setIsLocationLoading(true);
    setSelectedClass(null);
    setErrorMessage('');
    setActiveAttendance(null);
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            setLocation(position);
            setIsLocationLoading(false);
          },
          error => {
            console.log(error.code, error.message);
            setErrorMessage(error.message);
            setLocation(null);
            setIsLocationLoading(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
        setRefresh(false);
      }
    });
  };

  const getActivePortal = () => {
    getActivePortalForStudents({ course: authData?.user?.studentData?.course, subjectType: authData?.user?.studentData?.subjectType, semester: authData?.user?.studentData?.semester, ...selectedClass }).then(res => {
      if (res === undefined) {
        console.log('Server Down, Contact Dev Cell');
      }
      if (res.success) {
        setActiveAttendance(res.attendance);
        setPortalLocation(res.attendance.portalLocation);
        const isInRadius = checkIfInRadius(location.coords.latitude, location.coords.longitude, res.attendance.portalLocation.latitude, res.attendance.portalLocation.longitude, radiusInMeters);
        console.log(location?.coords?.latitude, location?.coords?.longitude, res.attendance.portalLocation?.latitude, res.attendance.portalLocation?.longitude, radiusInMeters);
        if (isInRadius) {
          setErrorMessage('');
          console.log('User In Radius')
          setIsInLocation(true);
        } else {
          setErrorMessage("User is outside the target radius.");
          console.log('User Outside Radius')
          setIsInLocation(false);
        }
      } else {
        setAttendanceError(res.message);
      }
    });
  };

  const markStudentAttendance = () => {
    const isInRadius = checkIfInRadius(location.coords.latitude, location.coords.longitude, portalLocation.latitude, portalLocation.longitude, radiusInMeters);
    console.log(location?.coords?.latitude, location?.coords?.longitude, portalLocation?.latitude, portalLocation?.longitude, radiusInMeters);
    if (isInRadius) {
      setErrorMessage('');
      markAttendance({ attendanceId: activeAttendance._id, course: authData?.user?.studentData?.course, semester: authData?.user?.studentData?.semester, ...selectedClass, seatNumber: authData?.user?.studentData?.seatNumber }).then(res => {
        if (res.success) {
          setAttendanceMarked(true);
          setActiveAttendance(null);
        }
      });
    } else {
      setErrorMessage("User is outside the target radius.");
      setIsInLocation(false);
    }
  };

  const openAppSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      {!location ?
        <View>
          <Text style={{ color: 'black', fontSize: 50 }}>Location not Detected!</Text>
          <Text style={{ color: 'black', fontSize: 50 }}>Click Below to get location</Text>
          {isLocationLoading ?
            <View>
              <Text style={{ textAlign: 'center', color: 'black' }}>Fetching your location</Text>
              <ActivityIndicator color={'#000'} animating={true} size="small" /></View>
            : <Text style={{ color: 'black' }}>Got Location</Text>}
          <View style={{ paddingBottom: 10 }}>
            <Button onPress={handleRefresh} title='Refresh' />
          </View>
          <View style={{
            paddingVertical: 5
          }}>
            <Text style={{ color: 'black', textAlign: 'center' }}>Go to settings if unable to fetch location</Text>
            <View style={{ paddingTop: 15 }}>
              <Text style={{ color: 'black' }}>{`Open Settings > Permissions > Location > Allow the app to use location`}</Text>
            </View>
            <TouchableOpacity
              style={{
                borderRadius: 5,
                borderWidth: 2,
                borderColor: '#d9534f',
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
              onPress={openAppSettings}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#d9534f', textAlign: 'center' }}>
                Open Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        :
        <View style={{ paddingBottom: 10, width: '90%' }}>
          <Button color='#d9534f' onPress={handleRefresh} title='Refresh Location' />
        </View>
      }
      {!location ? null : <View style={{ width: '90%' }}>
        <TouchableOpacity onPress={toggleAccordion}>
          <List.Accordion
            title="Select Subject"
            expanded={expanded}
            style={{ margin: -10, marginHorizontal: 5 }}
            onPress={() => { toggleAccordion() }}
          />
        </TouchableOpacity>
        <Animated.View style={{ height: animatedHeight, overflow: 'scroll' }}>
          <ScrollView style={{ height: 100 }}>
            {subjects ? subjects.map((el, i) => (
              <List.Item key={i} onPress={() => {
                toggleAccordion();
                setAttendanceError('');
                setAttendanceMarked(false);
                setSelectedClass({ subject: el, subjectType: subjectType[i], batch: batches[i] });
              }} title={() => (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', borderBottomColor: 'black', borderBottomWidth: 1}}>
                  <Text style={{ flexShrink: 1, fontSize: 18, color: 'black' }}>{`${el} (${subjectType[i]}) (${batches[i]})`}</Text>
                </View>
              )} />
            )) : null}
          </ScrollView>
        </Animated.View>
      </View>}

      {selectedClass !== null ?
        <View style={{ marginVertical: 20 }}>
          <Text style={{ color: 'black', fontSize: 20 }}>{selectedClass?.subject}({selectedClass?.subjectType}) (Batch: {selectedClass?.batch})</Text>
        </View>
        : null}
      {!location ? null : <View
        style={{ marginTop: 10, padding: 10, borderRadius: 10, width: '50%' }}>
        <Button color='#d9534f' onPress={() => getActivePortal()} title='Get Portal' />
      </View>}
      {activeAttendance !== null ? <View style={{}} >
        <Text style={{ color: 'black', fontSize: 18 }}>Portal Open For: </Text>
        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 22 }}>{activeAttendance.subject} ({activeAttendance.subjectType}) (Batch: {activeAttendance.batch})</Text>
        {errorMessage === '' ? <Button onPress={() => markStudentAttendance()} title='Mark Attendance' /> : <View>
          <Text style={{ color: '#d9534f', textAlign: 'center', fontSize: 20 }}>{errorMessage}</Text>
          <Text style={{ color: '#d9534f', textAlign: 'center', fontSize: 20 }}>{locationDistance}</Text>
          <Text style={{ color: '#0275d8', textAlign: 'center', fontSize: 20 }}>Try refreshing location!</Text>
        </View>}
      </View> : null}
      {attendanceMarked ? <View style={{ width: '90%' }} >
        <Text style={{ color: '#5cb85c', textAlign: 'center', fontSize: 20 }}>Attendance Marked</Text>
      </View> : null}
      <View>
        <Text style={{ color: 'red' }}>{attendanceError}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: 'black',
    padding: 10
  },
});