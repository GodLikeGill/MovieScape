import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { auth } from "../FirebaseApp"
import { onAuthStateChanged } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome';

const MovieDetailsScreen = ({navigation, route}) => {
    
    const movieId = route.params.movieId
    const movieName = route.params.movieName
    const movieDesc = route.params.movieDesc
    const movieImage = route.params.movieImage
    const movieReleaseDate = route.params.movieReleaseDate
    const movieRating = route.params.movieRating
    const [loggedInUser, setLoggedInUser] = useState(null);

    console.log(movieName)

    useEffect(()=>{
        const listener = onAuthStateChanged(auth, (user) => {
            if (user) {
              setLoggedInUser(user);      
            }
            else {
              setLoggedInUser(null);
            }
          })
          return listener
      }, [])


    return(
        <View>
            <Image style={styles.Image} source={ {uri: `https://image.tmdb.org/t/p/w500${movieImage}`}}/>
            <View  style={styles.flexView}>
                <Text style={{fontWeight: 'bold', fontSize: 18, flex:9}}> {movieName}</Text>
                <Text style={{fontSize: 18,flex:1}}> {movieRating}</Text>
                <Icon style={{flex:1}} name='star' size={22} color='gold'/>
            </View>

            <Text style={styles.textDate}> {movieReleaseDate}</Text>
            <Text style={styles.bold}>Plot Summary</Text>
            <Text style={styles.textDesc}> {movieDesc}</Text>

            {(loggedInUser===null) && (

                <View style={styles.container}>
                    <Text style={styles.text}>You must be logged in to use this feature</Text>
                    <Pressable style={styles.plainButton}>
                        <Text style={{color:'#9a9c9c'}}>Buy Tickets</Text>
                    </Pressable>
                    <Pressable style={styles.orangeButton} onPress={() => { navigation.navigate("Login")}}>
                        <Text style={{color:'white'}}>Login or Create New Account</Text>                
                    </Pressable>
                </View>
            )}

            { !(loggedInUser===null) && (

                <View style={styles.container}>                
                    <Pressable style={styles.orangeButton} onPress={() => { navigation.navigate("BuyTickets", { movieName:`${movieName}`, movieId:`${movieId}`})}}>
                        <Text style={{color:'white'}}>Buy Tickets</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    Image: {
        width: '100%',
        height: 200,
        borderRadius: 5,     
    },
    flexView: {
        flexDirection: 'row',
        paddingTop:5,
        paddingLeft:5
    },
    textDate: {
        paddingLeft:10,
    },
    textDesc: {
        paddingLeft:10,
        fontSize:13
    },
    bold:{
        fontWeight: 'bold',
        fontSize: 15,
        paddingLeft: 10,
        marginTop:10,
        marginBottom:3
    },
    text:{
        marginTop:30,
        textAlign: 'center',
        fontSize:12.5    
    },
    container:{ 
       padding:8  
    },

    orangeButton:{
        height: 50,
        margin: 5,
        padding: 5,
        backgroundColor:'blue',
        borderColor:'#b7bdbd',
        borderWidth:1,
        borderRadius: 10,
        justifyContent:'center',
        alignItems:'center',
    },
    plainButton:{
        height: 50,
        margin: 5,
        padding: 5,
        backgroundColor:'#ebeded',
        borderColor:'#b7bdbd',
        borderWidth:1,
        borderRadius: 10,
        justifyContent:'center',
        alignItems:'center',
    }
});

export default MovieDetailsScreen;