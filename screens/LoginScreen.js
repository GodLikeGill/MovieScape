import { useState} from 'react';
import { StyleSheet, Text, View, TextInput, Pressable} from 'react-native';
import { StackActions } from "@react-navigation/native";
import { auth } from '../FirebaseApp';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';

const LoginScreen = ({navigation}) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [showError, setShowError] = useState(false)

    const createAccountPressed = async() => {
        try{
            const userInfo = await createUserWithEmailAndPassword(auth, email, password)
            setShowError(false)
            navigation.dispatch(StackActions.pop(1));
            console.log(userInfo.user.uid)

        }catch(err){
            console.log(err)
            setShowError(true)
            setErrorMsg(`Firebase: ${err.message}`)
        }
    }

    const LoginPressed = async() => {
        try{
            const userInfo = await signInWithEmailAndPassword(auth, email, password)
            setShowError(false)
            navigation.dispatch(StackActions.pop(1));
            console.log(userInfo.user.uid)

        }catch(error){
            console.log(error)
            setShowError(true)
            setErrorMsg(`Firebase: ${error.message}`)
        }
    }


    return(
        <View style={styles.container}>
            <Text style={styles.title}>Login to Your Account</Text>
            <Text style={styles.text3}>You must be logged in to use this feature.</Text>
            <Text>Email Address:</Text>
            <TextInput placeholder='Enter Email'
                autoCapitalize='none'
                style={styles.inputText}
                value={email}
                onChangeText={setEmail}></TextInput>
            <Text>Password:</Text>
            <TextInput placeholder='Enter Password'
                autoCapitalize='none'
                secureTextEntry={true}
                style={styles.inputText}
                value={password}
                onChangeText={setPassword}></TextInput>
            {showError && (
                <Text style={styles.error}>{errorMsg}</Text>
            )} 
            <Pressable onPress={LoginPressed} style={styles.button}>
                <Text style={styles.text}>Login</Text>
            </Pressable>
            <Pressable onPress={createAccountPressed} style={styles.button2}>
                <Text style={styles.text2}>Create New Account</Text>
            </Pressable>
        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding:10,
        justifyContent: 'center',
      },

    title: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20   
    },
    text3: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 15   
      },
    error:{
        padding:4,
        backgroundColor:"red",
        color:"white"
    },
    inputText: {
        padding: 5,
        borderWidth: 1,
        borderColor:"#888",
        marginTop: 10,
        marginBottom: 10
    },
    button: {
        backgroundColor:"blue",
        padding:10,
        marginTop:10,
        marginBottom: 5
    },
    button2: {
        backgroundColor:"white",
        borderWidth: 1,
        borderColor:"blue",
        padding:10,
        marginTop:10,
        marginBottom: 5
    },
    text:{
        textAlign:'center',
        color:"white"
    },
    text2:{
        textAlign:'center',
        color:"blue"
    }

  });

  
export default LoginScreen