import { View, Text, ScrollView, RefreshControl, Button, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { closePortalById, deletePortalById, getActivePortalsForTeachers } from '../../actions/authActions'
import { useAuth } from '../../contexts/Auth'
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';

export default function PortalsScreen() {

  const [attendanceData, setAttendanceData] = useState([])

  const navigation = useNavigation();

  const route = useRoute()

  const receivedData = route.params?.data;


  const { authData } = useAuth()

  const [refresh, setRefresh] = useState(true)
  const [loading, setLoading] = useState(true)

  const onRefresh = () => {
    setRefresh(true);

    // Simulate a time-consuming task
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  };

  useEffect(() => {
    getActivePortalsForTeachers(authData?.user?.teacherData?._id).then(res => {
      // console.log(res)
      if (res !== undefined) {
        setAttendanceData(res.activePortals.reverse())
        setLoading(false)
      } else {
        console.log("ERROR", JSON.stringify(res));
      }
      // console.log(res)
    })
    setRefresh(false)
  }, [refresh, receivedData === 'FROM_CREATE'])

  const formatNumberToTime = (number) => {
    const paddedNumber = String(number).padStart(4, '0'); // Pad the number with zeros to ensure it has 4 digits
    const hours = paddedNumber.slice(0, 2); // Extract the first two digits as hours
    const minutes = paddedNumber.slice(2); // Extract the last two digits as minutes
    return `${hours}:${minutes}`; // Combine hours and minutes with a colon separator
  };

  const formatDate = (mDate) => {
    const date = new Date(mDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
}

  return (
    <View style={{ paddingHorizontal: 10, flex: 1 }}>
      {attendanceData.length === 0 ? <Text style={{ color: 'black', fontSize: 50 }}>No Portals</Text> : <Text style={{ color: 'black', fontSize: 50 }}>Portals</Text>}
      {loading ? <ActivityIndicator color={'#000'} animating={true} size="large" />
        :
        <ScrollView style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={onRefresh}
              colors={['#0087ff']}
              progressBackgroundColor="#ffffff"
            />
          }>
          {/* <Text>{JSON.stringify(attendanceData[0])}</Text> */}
          {attendanceData.length === 0 ? <><View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            
          </View></> : <>{attendanceData.map((a, i) => (
            <View key={i} style={{
              padding: 5,
              borderColor: '#0275d8',
              borderWidth: 2,
              borderRadius: 5,
              marginVertical: 5
            }}>
              <View style={{ paddingVertical: 5 }}>
                <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold" }}>
                  Programme:
                </Text>
                <Text style={{ fontSize: 16, color: 'black', fontWeight: 'normal' }}>
                  {a.course}
                </Text>
              </View>
              <View style={{ paddingVertical: 5 }}>
                <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold" }}>
                  Course:
                </Text>
                <Text style={{ fontSize: 16, color: 'black', fontWeight: 'normal' }}>
                  {a.subject} ({a.subjectType}) (Batch: {a.batch})
                </Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ paddingVertical: 5 }}>
                  <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold" }}>
                    No of Lectures:
                  </Text>
                  <Text style={{ color: 'black', fontWeight: 'normal' }}>
                    {a.noOfLectures}
                  </Text>
                </View>
                <View style={{ paddingVertical: 5 }}>
                  <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold" }}>
                    Date:
                  </Text>
                  <Text style={{ color: 'black', fontWeight: 'normal' }}>
                    {formatDate(a.createdAt)}
                  </Text>
                </View>
                <View style={{ paddingVertical: 5 }}>
                  <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold" }}>
                    Duration:
                  </Text>
                  <Text style={{ color: 'black', fontWeight: 'normal' }}>
                    {formatNumberToTime(a.startTime)} - {formatNumberToTime(a.endTime)}
                  </Text>
                </View>
              </View>
              <View style={{ padding: 1, marginVertical: 5, backgroundColor: 'grey' }}></View>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap'
              }}>
                {/* <Button color="#0275d8" title="View Portal" onPress={() => navigation.navigate('Single Portal')} /> */}
                <TouchableOpacity
                  style={{
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: '#0275d8',
                    backgroundColor: '#0275d8',
                    paddingVertical: 5,
                    marginHorizontal: 5,
                    paddingHorizontal: 10,
                    alignItems: 'center', // Center the button horizontally
                    alignSelf: 'flex-start'
                  }}
                  onPress={() => navigation.navigate('Single Portal', { data: a })}
                >
                  <Text style={{ color: 'white', textAlign: 'center' }}>View Portal</Text>
                </TouchableOpacity>
                {a.accepting ?
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                  }}>
                    <TouchableOpacity
                      style={{
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: '#d9534f',
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        backgroundColor: '#d9534f',
                        marginHorizontal: 5,
                        alignItems: 'center', // Center the button horizontally
                        alignSelf: 'flex-start'
                      }}
                      onPress={() => {
                        closePortalById(a._id)
                        setRefresh(true)
                      }}
                    >
                      <Text style={{ color: 'white', textAlign: 'center' }}>Close Portal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: '#d9534f',
                        paddingVertical: 5,
                        marginHorizontal: 5,
                        backgroundColor: '#d9534f',
                        paddingHorizontal: 10,
                        alignItems: 'center', // Center the button horizontally
                        alignSelf: 'flex-start'
                      }}
                      onPress={() => {
                        deletePortalById(a._id)
                        setRefresh(true)
                      }}
                    >
                      <Text style={{ color: 'white', textAlign: 'center' }}>Delete Portal</Text>
                    </TouchableOpacity>
                  </View>
                  : null}
              </View>
            </View>
          ))}</>}
        </ScrollView>
      }
    </View>
  )
}