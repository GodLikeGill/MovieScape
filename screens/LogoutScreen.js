import { StyleSheet, Text, View, Pressable } from 'react-native';
import { auth, db } from "../FirebaseApp"
import { signOut } from 'firebase/auth';

const LogoutScreen = () => {

    const LogoutPressed = async() => {
        try{
            await signOut(auth)
            
        }catch(err){
            console.log(err)
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Are you ready to Logout?</Text>
            <Pressable onPress={LogoutPressed} style={styles.button}>
                <Text style={styles.text}>Logout</Text>
            </Pressable>            
        </View>
    );
}

export default LogoutScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding:10,
        justifyContent: 'center',
    },
    button: {
        backgroundColor:"blue",
        width:"100%",
        padding:7,
        borderRadius: 10,
        margin:10
    },
    text:{
        textAlign:'center',
        color:"white",
        fontSize: 17
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20   
      },
})