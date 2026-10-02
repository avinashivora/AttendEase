import { TouchableOpacity, View } from 'react-native'
import { Text } from '@rneui/base'
import { TextInput } from 'react-native-paper'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../contexts/Auth';
import { updatePassword } from '../../actions/authActions'
import { Alert } from 'react-native'

export const ResetPassword = () => {

    const [prevPass, setPrevPass] = useState('')
    const [newPass, setnewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [error, setError] = useState('')
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const { authData, authError, setAuthError, signOut } = useAuth()

    const handleResetPassword = (data) => {
        console.log(data)
        updatePassword(data).then(res => {
            console.log(res)
            if (!res.status) {
                setError(res.error)
            } else {
                Alert.alert(
                    'Your password is updated',
                    'You will be logged out',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                signOut();
                                console.log(res);
                            },
                        },
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
                flexWrap: 'wrap',
                paddingTop: 10,
                justifyContent: 'center'
            }}>
                <Text style={{ color: 'black', fontSize: 50 }}>Reset Password</Text>
                {/* <Text style={{ color: 'black', fontSize: 40, paddingLeft:20 }}>for {authData.user.firstName} {authData.user.lastName}</Text> */}
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
                        label="Old password"
                        secureTextEntry={secureTextEntry}
                        value={prevPass}
                        onChangeText={prevPass => {
                            setPrevPass(prevPass)
                            setAuthError(null)
                            setError('')
                        }}
                        theme={{ colors: { primary: '#d9534f', underlineColor: 'transparent' } }}
                        right={
                            <TextInput.Icon
                                icon={secureTextEntry ? 'eye' : 'eye-off'}
                                onPress={() => {
                                    setSecureTextEntry(!secureTextEntry);
                                    return false;
                                }}
                            />
                        }
                    />
                    <TextInput
                        mode='outlined'
                        label="New password"
                        secureTextEntry={secureTextEntry}
                        value={newPass}
                        onChangeText={newPass => {
                            setnewPass(newPass)
                            setAuthError(null)
                            setError('')
                        }}
                        theme={{ colors: { primary: '#d9534f', underlineColor: 'transparent' } }}
                        right={
                            <TextInput.Icon
                                icon={secureTextEntry ? 'eye' : 'eye-off'}
                                onPress={() => {
                                    setSecureTextEntry(!secureTextEntry);
                                    return false;
                                }}
                            />
                        }
                    />
                    <TextInput
                        mode='outlined'
                        label="Confirm your new password"
                        secureTextEntry={secureTextEntry}
                        value={confirmPass}
                        onChangeText={confirmPass => {
                            if (newPass !== confirmPass) {
                                setConfirmPass(confirmPass)
                                setError('Confirm password does not match')
                            } else {
                                setConfirmPass(confirmPass)
                                setAuthError(null)
                                setError('')
                            }
                        }}
                        theme={{ colors: { primary: '#d9534f', underlineColor: 'transparent' } }}
                        right={
                            <TextInput.Icon
                                icon={secureTextEntry ? 'eye' : 'eye-off'}
                                onPress={() => {
                                    setSecureTextEntry(!secureTextEntry);
                                    return false;
                                }}
                            />
                        }
                    />
                    {authError !== null ? <View style={{ alignSelf: 'center' }}><Text style={{
                        color: 'red',
                        justifyContent: 'center'
                    }}>{authError.message}</Text></View> : null}
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
                                borderColor: `${confirmPass !== newPass ? '#e17572' : '#d9534f'}`,
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                backgroundColor: `${confirmPass !== newPass ? '#e17572' : '#d9534f'}`,
                            }}
                            disabled={confirmPass !== newPass}
                            onPress={() => handleResetPassword({ email: authData.user.email, prevPass, newPass, confirmPass })}
                        >
                            <Text style={{ fontWeight: 'bold', fontSize: 18, color: `${confirmPass !== newPass ? '#f7f7f7' : 'white'}`, textAlign: 'center' }}>Reset Password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
}