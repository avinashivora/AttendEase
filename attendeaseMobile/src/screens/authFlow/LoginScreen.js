import { TouchableOpacity, View } from 'react-native'
import { Text } from '@rneui/base'
import { TextInput } from 'react-native-paper'
import { useState,useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../contexts/Auth';

export const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const navigation = useNavigation()

    const auth = useAuth();

    useEffect(() => {
        if (email) {
          setEmail(email.toLowerCase());
        }
      }, [email]);

    const emailRegex = /\S+@\S+\.\S+/;

    const handleSubmit = (user) => {
        if (email === '' || password === '') {
            return setError("All fields are required")
        }

        if (emailRegex.test(email)) {   
            // auth.signIn(user)
            // console.log('email',email)
            // console.log('user',user)
            auth.signIn(user)
            // console.log(auth.authError)
        } else {
            setError("Please Enter Valid Email")
        }
    }

    return (
        <>
            <View style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
            }}>
                <View style={{
                    width: '90%'
                }}>
                    <TextInput
                        style={{
                            borderColor: '#d9534f',
                            borderBlockColor: '#d9534f'
                        }}
                        mode='outlined'
                        label="Email"
                        autoCapitalize='none'
                        keyboardType='email-address'
                        value={email}
                        onChangeText={email => {
                            setEmail(email.toLowerCase())
                            setError('')
                        }}
                        theme={{ colors: { primary: '#d9534f', underlineColor: 'transparent' } }}
                    />
                    <TextInput
                        mode='outlined'
                        label="Password"
                        secureTextEntry={secureTextEntry}
                        value={password}
                        onChangeText={password => {
                            setPassword(password)
                            auth.setAuthError(null)
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
                    {auth.authError !== null ? <View style={{ alignSelf: 'center' }}><Text style={{
                        color: 'red',
                        justifyContent: 'center'
                    }}>{auth.authError.message}</Text></View> : null}
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
                                borderColor: '#d9534f',
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                backgroundColor: '#d9534f',
                            }}
                            onPress={() => handleSubmit(user = { email, password })}
                        >
                            <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white', textAlign: 'center' }}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{paddingBottom: 30, alignSelf: 'center'}}>
                <Text style={{color: '#d9534f', fontSize: 30, fontWeight: 'bold'}}>AttendEase <Text style={{fontSize: 18, fontWeight: 'bold'}}>v0.2.0</Text></Text>
                <Text style={{color: 'black', textAlign: 'center'}}>By Developers Cell Somaiya</Text>
            </View>
        </>
    )
}
