import { View, Text, ScrollView, ActivityIndicator, Button, RefreshControl, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAttendanceById, markAttendanceByTeacher } from '../../actions/authActions';
import moment from 'moment-timezone';

export default function SinglePortal() {

    const route = useRoute();
    const receivedData = route.params?.data;

    const navigation = useNavigation()

    const [attendanceData, setAttendanceData] = useState({})
    const [loading, setLoading] = useState(true)
    const [present, setPresent] = useState(0)
    const [disabled, setDisabled] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [searchText, setSearchText] = useState('')

    const onRefresh = () => {
        setRefresh(true);

        // Simulate a time-consuming task
        setTimeout(() => {
            setRefresh(false);
        }, 2000);
    };

    useEffect(() => {
        // setLoading(true)
        if (!receivedData) {
            return navigation.navigate('Create Portal', { data: 'No New Portal Created' })
        }

        getAttendanceById(receivedData._id).then(res => {
            console.log(res?.attendance?.createdAt)
            setAttendanceData(res.attendance)
            const utcMoment = moment?.utc(res?.attendance?.createdAt)
            const istMoment = utcMoment?.tz("Asia/Kolkata")
            const currentDate = new Date()

            if (istMoment.date() === currentDate.getDate() && istMoment.month() === currentDate.getMonth()
                && istMoment.year() === currentDate.getFullYear()) {
                setDisabled(false)
            } else {
                setDisabled(true)
            }

            let numbers = 0
            res.attendance.attendanceRecords.map(student => {
                if (student.present) {
                    numbers += 1
                }
            })
            setPresent(numbers)
            setLoading(false)
            setRefresh(false)
        })

    }, [receivedData, refresh])

    const markAbsentBySeatNumber = (seatNumber) => {
        markAttendanceByTeacher(receivedData._id, seatNumber, false).then(res => {
            setRefresh(prev => !prev)
        })
    }

    const markPresentByTeacherBySeatNumber = (seatNumber) => {
        markAttendanceByTeacher(receivedData._id, seatNumber, true).then(res => {
            setRefresh(prev => !prev)
        })
    }

    const filteredRecords = attendanceData?.attendanceRecords?.filter(a => {
        const seatNumberLastThree = a.seatNumber.toString().slice(-3);
        return a.name.toLowerCase().includes(searchText.toLowerCase()) || seatNumberLastThree.includes(searchText);
    });

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <Text style={{ color: 'black', fontSize: 18 }}>Portal for:</Text>
            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>{receivedData.subject} ({receivedData.subjectType}) (Batch: {receivedData.batch})</Text>
            <View style={{ marginVertical: 5, padding: 1, backgroundColor: 'black' }}></View>
            <Text style={{ color: 'black', fontSize: 20 }}>Present: {present}</Text>

            <TextInput
                placeholder="Search by Name or Last 3-digits of Seat Number"
                value={searchText}
                onChangeText={text => setSearchText(text)}
                style={{
                    padding: 10,
                    marginVertical: 10,
                    borderColor: '#000',
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                    color: 'black'
                }}
            />

            {loading ? <ActivityIndicator color={'#000'} animating={true} size="large" />
                :
                <ScrollView style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={onRefresh}
                            colors={['#0087ff']} // Customize the color of the refresh indicator
                            progressBackgroundColor="#ffffff" // Customize the background color of the refresh indicator
                        />
                    }>
                    {filteredRecords.length === 0 ? <Text>No Records Found</Text>
                        :
                        <View style={{ marginVertical: 10 }}>
                            {filteredRecords.map((a, i) => (
                                <View key={i} style={{
                                    padding: 5,
                                    backgroundColor: a.present ? '#5cb85c' : '#d9534f',
                                    marginVertical: 5,
                                    borderRadius: 5,
                                    elevation: 4
                                }}>
                                    {/* <Text style={{ color: 'black' }}>{JSON.stringify(a)}</Text> */}
                                    <Text style={{ fontSize: 15, color: a.present ? 'black' : 'white', fontWeight: 'bold' }}>Seat Number: {a.seatNumber}</Text>
                                    <View style={{ marginVertical: 5, padding: 1, backgroundColor: 'black' }}></View>
                                    <View style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Text style={{ fontSize: 15, color: a.present ? 'black' : 'white', fontWeight: 'bold' }}>{a.name}</Text>
                                        <Text style={{ fontSize: 15, color: a.present ? 'black' : 'white', fontWeight: 'bold' }}>{a.present ? 'Present' : 'Absent'}</Text>
                                    </View>
                                    <View style={{ padding: 5, marginTop: 10 }}>
                                        {a.present ?
                                            <Button title='Mark as Absent' color="#d9534f" onPress={() => markAbsentBySeatNumber(a.seatNumber)} disabled={disabled} />
                                            :
                                            <Button title='Mark as Present' color="#5cb85c" onPress={() => markPresentByTeacherBySeatNumber(a.seatNumber)} disabled={disabled} />
                                        }
                                    </View>
                                </View>
                            ))}
                        </View>
                    }
                </ScrollView>
            }
        </View>
    )
}
