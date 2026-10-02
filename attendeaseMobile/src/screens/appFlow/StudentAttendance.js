import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/Auth'
import { ActivityIndicator } from 'react-native-paper';
import { getStudentAttendance } from '../../actions/authActions';

export default function StudentAttendance() {

  const [attendanceData, setAttendanceData] = useState([])

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

  const email = authData?.user?.studentData?.email; 
  useEffect(() => {
    const fetchData = async () => {
      // Pass email to getStudentAttendance if it accepts parameters
      const fetchedData = await getStudentAttendance(email);  
      setAttendanceData(fetchedData);
      setLoading(false);
    };
    fetchData();
    setRefresh(false);
  }, [refresh])

  const formatTime = (time) => {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <View style={{ paddingHorizontal: 10, flex: 1 }}>
      {attendanceData.length === 0 ? <Text style={{ color: 'black', fontSize: 30 }}>No Attendance Data</Text> : <Text style={{ color: 'black', fontSize: 30 }}>Attendance Records</Text>}
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
          {/* Iterate over the attendance data */}
          {attendanceData.length === 0 ? <><View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}>

          </View></> : <>{attendanceData.map((record, i) => (
            <View key={i} style={{
              padding: 5,
              borderColor: '#0275d8',
              borderWidth: 2,
              borderRadius: 5,
              marginVertical: 5
            }}>
              <View style={{ paddingVertical: 5 }}>
                <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold" }}>
                  Date:
                </Text>
                <Text style={{ fontSize: 16, color: 'black', fontWeight: 'normal' }}>
                  {record.date}
                </Text>
              </View>
              <View style={{ paddingVertical: 5 }}>
                <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold" }}>
                  Time:
                </Text>
                <Text style={{ fontSize: 16, color: 'black', fontWeight: 'normal' }}>
                {formatTime(record.startTime)} - {formatTime(record.endTime)}
                </Text>
              </View>
              <View style={{ paddingVertical: 5 }}>
                <Text style={{ color: 'black', fontSize: 15, fontWeight: "bold" }}>
                  Course:
                </Text>
                <Text style={{ fontSize: 16, color: 'black', fontWeight: 'normal' }}>
                  {record.subject} (Batch: {record.batch})
                </Text>
              </View>

              {/* Iterate over the attendance for this record */}
              {record.attendance.map((student, index) => (
                <View key={index} style={{
                  paddingVertical: 5,
                  backgroundColor: student.present ? '#dff0d8' : '#f2dede', // Green for present, red for absent
                  borderRadius: 5,
                  marginTop: 10
                }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold", color: 'black' }}>
                    Seat Number: {student.seatNumber}
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: "bold", color: 'black' }}>
                    Name: {student.name}
                  </Text>
                  <Text style={{ fontSize: 16, color: student.present ? '#3c763d' : '#a94442' }}>
                    Status: {student.present ? 'Present' : 'Absent'}
                  </Text>
                </View>
              ))}

            </View>
          ))}</>}
        </ScrollView>
      }
    </View>
  )
}
