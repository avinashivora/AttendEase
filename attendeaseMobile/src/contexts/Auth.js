import React, { createContext, useState, useContext, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import RNSecureStorage from 'rn-secure-storage';
//Create the Auth Context with the data type specified
//and a empty object
const AuthContext = createContext({});
const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState();
    //the AuthContext start with loading equals true
    //and stay like this, until the data be load from Async Storage
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null)

    useEffect(() => {
        //Every time the App is opened, this provider is rendered
        //and call de loadStorage function.
        loadStorageData();
    }, []);
    async function loadStorageData() {
        try {
            //Try get the data from Async Storage
            // authDataSerialized = await AsyncStorage.getItem('@AuthData')
            authDataSerialized = await RNSecureStorage.getItem("@AuthData").then((res) => {
                console.log(res);
                const authData = JSON.parse(res);
                setAuthData(authData);
            }).catch((err) => {
                console.log(err);
            });
            // if (authDataSerialized) {
            //     //If there are data, it's converted to an Object and the state is updated.
            //     const authData = JSON.parse(authDataSerialized);
            //     setAuthData(authData);
            // }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            //loading finished
            setLoading(false);
        }
    }
    const signIn = (data) => {
        //call the service passing credential (email and password)
        const user = fetch(`http://192.168.29.232:7000/api_v1/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if(data.status) {
                    setAuthData(data);
                    // AsyncStorage.setItem('@AuthData', JSON.stringify(data));
                    RNSecureStorage.setItem("@AuthData",  JSON.stringify(data)).then((res) => {
                        console.log(res);
                    }).catch((err) => {
                        console.log(err);
                    });
                    return data
                } else {
                    setAuthError(data)
                    return data
                }
            })
            .catch((error) => console.error('Login error:', error));
            
        //Set the data in the context, so the App can be notified
        //and send the user to the AuthStack
        //Persist the data in the Async Storage
        //to be recovered in the next user session.
    };

    const getActivePortalForStudents = ({ course, semester, subjectType, subject, batch }) => {
        const url = `http://192.168.29.232:7000/api_v1/get-active-portal-students?course=${course}&subjectType=${subjectType}&semester=${semester}&subject=${subject}&batch=${batch}`
        const activePortal = fetch(url, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
            .then(response => {
                console.log("vrb", response.json())
                return response.json()
            })
            .catch(err => {
                return console.log("vrsvbs", err)
            })
            // console.log(activePortal)
    }

    const signOut = () => {
        //Remove data from context, so the App can be notified
        //and send the user to the AuthStack
        setAuthData(undefined);
        // setQuestions(null)
        //Remove the data from Async Storage
        //to NOT be recoverede in next session.
        // AsyncStorage.removeItem('@AuthData');
        RNSecureStorage.removeItem("@AuthData").then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    };
    return (
        //This component will be used to encapsulate the whole App,
        //so all components will have access to the Context
        React.createElement(AuthContext.Provider, { value: { authData, loading, signIn, signOut, authError, setAuthError, getActivePortalForStudents } }, children));
};
//A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
export { AuthContext, AuthProvider, useAuth };