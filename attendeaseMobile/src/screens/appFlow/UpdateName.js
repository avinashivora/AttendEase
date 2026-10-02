import { TouchableOpacity, View } from 'react-native'
import { Text } from '@rneui/base'
import { TextInput } from 'react-native-paper'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../contexts/Auth';
import { updateName } from '../../actions/authActions'
import { Alert } from 'react-native'

export const ResetPassword = () => {

    const { authData, authError, setAuthError, signOut } = useAuth()

    const [firstName, setFirstName] = useState('')
    const [middleName, setMiddleName] = useState('')
    const [lastName, setLastName] = useState('')
    const [error, setError] = useState('')

    const handleUpdateName = (data) => {
        // console.log(data)
        updateName(data).then(res => {
            // console.log(res)
            if (!res.status) {
                setError(res.error)
            } else {
                Alert.alert(
                    'Name Update',
                    'You name has been updated.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                console.log(res);
                            }
                        }
                    ],
                    { cancelable: false }
                );
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <>
            <View style={{
                flexDirection: 'row',
                flex: 0.5,
                width: '100%',
                flexWrap: 'wrap'
            }}>
                <Text style={{ color: 'black', fontSize: 40 }}>Reset Name</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '100%'
            }}>
                <View style={{
                    width: '90%'
                }}>
                    <TextInput
                        mode='outlined'
                        label='First Name'
                        value={firstName}
                        onChangeText={name => {
                            if (name===''){
                                setFirstName(' ')
                                setError('First Name Required')
                            } else {
                                setFirstName(name)
                                setError('')
                            }
                        }}
                        theme={{ colors: { primary: '#d9534f', underlineColor: 'transparent' } }}
                    />
                    <TextInput
                        mode='outlined'
                        label='Middle Name'
                        value={middleName}
                        onChangeText={name => {
                            if (name===''){
                                setMiddleName(' ')
                                setError('')
                            } else {
                                setMiddleName(name)
                                setError('')
                            }
                        }}
                        theme={{ colors: { primary: '#d9534f', underlineColor: 'transparent' } }}
                    />
                    <TextInput
                        mode='outlined'
                        label='Last Name'
                        value={lastName}
                        onChangeText={name => {
                            if (name===''){
                                setLastName(' ')
                                setError('')
                            } else {
                                setLastName(name)
                                setError('')
                            }
                        }}
                        theme={{ colors: { primary: '#d9534f', underlineColor: 'transparent' } }}
                    />
                    {error !== '' ? <View style={{ alignSelf: 'center' }}><Text style={{
                        color: 'red',
                        justifyContent: 'center'
                    }}>{error}</Text></View> : null}
                    <View style={{
                        paddingVertical: 10
                    }}>
                        <TouchableOpacity
                            style={{
                                borderRadius: 50,
                                borderWidth: 2,
                                borderColor: `${error ? '#e17572' : '#d9534f'}`,
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                backgroundColor: `${error ? '#e17572' : '#d9534f'}`,
                            }}
                            disabled={error !== ""}
                            onPress={() => handleUpdateName({ firstName: firstName, middleName: middleName, lastName: lastName })}
                        >
                            <Text style={{ fontWeight: 'bold', fontSize: 18, color: `${error ? '#f7f7f7' : 'white'}`, textAlign: 'center' }}>Reset Name</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
}