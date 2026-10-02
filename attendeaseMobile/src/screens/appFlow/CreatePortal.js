import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Platform, Button, PermissionsAndroid, Animated, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Linking } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import _ from 'lodash';
import Geolocation from 'react-native-geolocation-service';
import { useAuth } from "../../contexts/Auth"
import { List } from 'react-native-paper';
import { getActivePortalsForTeachers, openAttendancePortal } from '../../actions/authActions';
import { SelectList } from 'react-native-dropdown-select-list'
import { useNavigation } from '@react-navigation/native';

export const CreatePortal = () => {

  const { authData } = useAuth()

  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedOption, setSelectedOption] = useState('option1'); // Initial value for select
  const [attendanceData, setAttendanceData] = useState([])
  const [expanded, setExpanded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const [refresh, setRefresh] = useState(false)

  const [noOfLectures, setNoOfLectures] = useState(1);
  const [portalTime, setPortalTime] = useState(10);

  const animatedHeight = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  const [selectedClass, setSelectedClass] = useState(null)
  const [location, setLocation] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(true)
  const [portalLocation, setPortalLocation] = useState(null)

  useEffect(() => {
    setSelectedTime(new Date());
  }, []); // Set initial selectedTime when component mounts

  useEffect(() => {
    getLocation()
    // getLocationLocal()
  }, [])

  const getLocation = () => {
    setIsLocationLoading(true)
    setErrorMessage('')
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            const userLatitude = position.coords.latitude;
            const userLongitude = position.coords.longitude;
            console.log(position.coords);
            setLocation(position)
            setPortalLocation({ longitude: userLongitude, latitude: userLatitude })
            setIsLocationLoading(false)
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setErrorMessage(error.message)
            // setIsLocationLoading(false)
            setLocation(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
        setRefresh(false)
      } else {
        // setIsLocationLoading(false)
      }
    });
    console.log(location);
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
    setRefresh(true);
    getLocation();
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  };

  const onChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      // Handle case when the picker is dismissed
      setShowTimePicker(false);
      return;
    }

    setSelectedTime(selectedDate);
    if (Platform.OS === 'ios') {
      setShowTimePicker(false); // Hide picker on iOS after selection
    }
    setErrorMessage('')
    setShowTimePicker(false)
  };

  useEffect(() => {
    getActivePortalsForTeachers(authData?.user?.teacherData?._id).then(res => {
      // console.log(res === undefined)
      if (res !== undefined) {
        setAttendanceData(res.activePortals.reverse())
      } else {
        console.log("ERROR")
      }
      // console.log(res)
    })
  }, [refresh])

  const debouncedShowPicker = _.debounce(() => setShowTimePicker(true), 300); // Debounce for 300ms

  const formattedTime = selectedTime
    ? `${selectedTime.getHours().toString().padStart(2, '0')}${selectedTime.getMinutes().toString().padStart(2, '0')}`
    : '';

  const toggleAccordion = () => {
    const initialValue = expanded ? 300 : 0;
    const finalValue = expanded ? 0 : 300;
    setExpanded(expanded => !expanded);

    animatedHeight.setValue(initialValue);
    Animated.timing(animatedHeight, {
      toValue: finalValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleCreateNewPortal = () => {
    if (!selectedTime || !selectedClass || !noOfLectures) {
      console.log('Required')
      setErrorMessage('Fields Required')
    } else {
      console.log(selectedTime, selectedClass, noOfLectures, formattedTime)
      openAttendancePortal({
        teacherId: authData?.user?.teacherData?._id,
        course: selectedClass.course,
        semester: selectedClass.semester,
        subjects: selectedClass.subjects,
        subjectType: selectedClass.subjectType,
        batch: selectedClass.batch,
        portalLocation: portalLocation,
        startTime: parseInt(formattedTime),
        endTime: parseInt(formattedTime) + noOfLectures * 100,
        noOfLectures: noOfLectures,
        portalTime: portalTime,
        date: new Date()
      })
        .then(res => {
          console.log(res)
          if (res.success) {
            navigation.navigate('View Portals', { data: 'FROM_CREATE' })
            // console.log(res)
          } else {
            setShowError(true)
            setErrorMessage(res.message)
          }
          console.log(res)
        })
        .catch(err => console.log(err))

    }
  }

  const noOfLecturesData = [
    { key: '1', value: 1 },
    { key: '2', value: 2 },
    { key: '3', value: 3 },
    { key: '4', value: 4 }
  ]
  const portalTimeData = [
    { key: '1', value: 5 },
    { key: '2', value: 10 },
    { key: '3', value: 15 },
    { key: '4', value: 20 }
  ]

  const openAppSettings = () => {
    Linking.openSettings();
  };


  return (
    <View style={{ flex: 1 }}>
      {!location ? <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ color: 'black', fontSize: 50 }}>Location not Detected!</Text>
        <Text style={{ color: 'black', fontSize: 50 }}>Click Below to get location</Text>
      </View> :
      <>
        <View style={{ padding: 20, paddingBottom: 10 }}>
          <Button color='#d9534f' onPress={handleRefresh} title='Refresh Location' />
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={{ color: 'black', fontSize: 50 }}>New Portal</Text>
        </View>
      </>}
      <View style={{ flex: 1, padding: 10, alignItems: 'center', }}>
        {isLocationLoading ?
          <View>
            <Text style={{ textAlign: 'center', color: 'black' }}>Fetching your location</Text>
            <ActivityIndicator color={'#000'} animating={true} size="small" /></View>
          : null}
        {!location ? <View>
          <View style={{
            paddingVertical: 5
          }}>
            <TouchableOpacity
              style={{
                borderRadius: 5,
                borderWidth: 2,
                borderColor: '#d9534f',
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
              onPress={handleRefresh}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#d9534f', textAlign: 'center' }}>
                Get Location
              </Text>
            </TouchableOpacity>
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
          <View>
            <View style={{ padding: 2 }}>
              <View style={{ width: '100%' }}>
                <View>
                  <View style={{ paddingVertical: 5 }}>
                    <TouchableOpacity style={{ borderRadius: 10 }} onPress={toggleAccordion}>
                      <List.Accordion
                        title="Select Subject"
                        expanded={expanded}
                        style={{ margin: -10, marginHorizontal: 5 }}
                        onPress={() => { toggleAccordion() }}
                      />
                    </TouchableOpacity>
                    <Animated.View style={{ height: animatedHeight, overflow: 'scroll' }}>
                      <ScrollView style={{}}>
                        {authData?.user?.teacherData?.selectQuery ? authData?.user?.teacherData?.selectQuery.map((el, i) => (
                          <List.Item key={i} onPress={() => {
                            toggleAccordion()
                            setSelectedClass(el)
                            setErrorMessage('')
                          }} title={() => (
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', borderBottomColor: 'black', borderBottomWidth: 1 }}>
                              <Text style={{ flexShrink: 1, fontSize: 15, color: 'black' }}>
                                {`${el.subjects}(${el.subjectType}), Batch:${el.batch}, ${el.course}, Semester: ${el.semester}`}
                              </Text>
                            </View>
                          )} />
                        )) : null}
                      </ScrollView>
                    </Animated.View>

                  </View>
                </View>
                <View style={{ paddingVertical: 5 }}>
                  {/* <Button color="#d9534f" onPress={debouncedShowPicker} title="Select time of lecture as per TT" /> */}
                  <View style={{
                    paddingVertical: 5
                  }}>
                    <TouchableOpacity
                      style={{
                        borderRadius: 5,
                        borderWidth: 2,
                        borderColor: '#d9534f',
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                      }}
                      onPress={() => debouncedShowPicker()}
                    >
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#d9534f', textAlign: 'center' }}>
                        {!selectedTime ? `Select time of lecture as per TT` : `Selected Time: ${selectedTime.toLocaleTimeString()}`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {showTimePicker && (
                    <DateTimePicker
                      value={selectedTime}
                      mode="time"
                      is24Hour={false} // Optional: Set to false for 12-hour format
                      display="spinner"
                      onChange={onChange}
                    />
                  )}
                </View>
                <View style={{ paddingVertical: 5 }}>
                  <Text style={{ textAlign: 'center', color: 'black' }}>Select No of Lectures (Default to 1)</Text>
                  <SelectList
                    placeholder='Select No of Lectures (Default to 1)'
                    dropdownItemStyles={{ color: 'black' }}
                    boxStyles={{ borderRadius: 5 }}
                    inputStyles={{ color: 'black' }}
                    dropdownTextStyles={{ color: 'black' }}
                    defaultOption={1}
                    searchicon={<Text></Text>}
                    searchPlaceholder=''
                    setSelected={(val) => {
                      setNoOfLectures(val)
                      setErrorMessage('')
                    }}
                    data={noOfLecturesData}
                    save="value"
                  />
                </View>

                <View style={{ paddingVertical: 5 }}>
                  <Text style={{ textAlign: 'center', color: 'black' }}>Select portal duration</Text>
                  <SelectList
                    placeholder='Select portal duration'
                    dropdownItemStyles={{ color: 'black' }}
                    boxStyles={{ borderRadius: 5 }}
                    inputStyles={{ color: 'black' }}
                    dropdownTextStyles={{ color: 'black' }}
                    defaultOption={1}
                    searchicon={<Text></Text>}
                    searchPlaceholder=''
                    setSelected={(val) => {
                      setPortalTime(val)
                      setErrorMessage('')
                    }}
                    data={portalTimeData}
                    save="value"
                  />
                </View>
                {errorMessage !== '' ?
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: 'red' }}>{errorMessage}</Text>
                  </View>
                  : null}
              </View>
            </View>
            {!selectedClass ?
              null
              :
              <View style={{
                borderColor: '#d9534f',
                borderWidth: 2,
                padding: 5,
                marginVertical: 20,
                borderRadius: 8
              }}>
                <Text style={{ color: 'black', fontSize: 20 }}>Portal Info</Text>
                <View style={{ backgroundColor: 'grey', padding: 1 }}></View>
                {selectedClass !== null ?
                  <>
                  <View style={{ paddingVertical: 5 }}>
                    <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold" }}>
                      Programme:
                    </Text>
                    <Text style={{ fontSize: 16, color: 'black', fontWeight: 'normal' }}>
                      {`${selectedClass?.course}`}
                    </Text>
                  </View>
                  <View style={{ paddingVertical: 5 }}>
                    <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold" }}>
                      Course:
                    </Text>
                    <Text style={{ fontSize: 16, color: 'black', fontWeight: 'normal' }}>
                      {`${selectedClass?.subjects} (${selectedClass?.subjectType}) (Batch: ${selectedClass?.batch})`}
                    </Text>
                  </View>
                  </>
                  : null}
                <View style={{ paddingVertical: 5 }}>
                  <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold", }}>
                    Selected Time:
                  </Text>
                  <Text style={{ color: 'black', fontWeight: 'normal' }}>
                    {`${selectedTime.toLocaleTimeString()}`}
                  </Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ paddingVertical: 5 }}>
                    <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold" }}>
                      No of Lectures:
                    </Text>
                    <Text style={{ color: 'black', fontWeight: 'normal' }}>
                      {noOfLectures}
                    </Text>
                  </View>
                  <View style={{ paddingVertical: 5 }}>
                    <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold" }}>
                      Portal duration:
                    </Text>
                    <Text style={{ color: 'black', fontWeight: 'normal' }}>
                      {portalTime} Mins
                    </Text>
                  </View>
                </View>
                <View style={{ paddingVertical: 10 }}>
                  <Button color="#d9534f" title="Create Portal" onPress={() => {
                    handleCreateNewPortal()
                  }} />
                </View>
              </View>
            }
          </View>
        }
      </View>
    </View>
  );
};
