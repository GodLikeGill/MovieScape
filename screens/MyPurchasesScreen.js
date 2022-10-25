import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { db, auth } from "../FirebaseApp";
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const MyPurchasesScreen = ({navigation, route}) => {

    const [tickets, setTickets] = useState([])
    const [viewToRender, setViewToRender] = useState();
    const [loggedInUser, setLoggedInUser] = useState(null)
    const [fill, setFill] = useState(false);

    useEffect(()=>{
        onAuthStateChanged(auth, user => {
          if (user) {
            setLoggedInUser(user.uid);    
            getDocumentsFromFirestore();
            setFill(true);
          } else {
            setFill(false);
            setViewToRender(
              <View style={{flex: 1,alignItems:"center", justifyContent:"center"}}>
                 <Text style={styles.text1}> You must be logged in to view your Tickets.</Text>
                 <Pressable style={styles.button2} onPress={() => { navigation.navigate("Login")}}>
                    <Text style={styles.text2}> Login or Create New Account</Text>
                 </Pressable>
              </View>
            )
          }
        });
      
        return () => {
          setViewToRender(); 
        };
     }, [fill])

    const getDocumentsFromFirestore  = async() => {
        const querySnapshot = query(collection(db, "tickets"), where("userId", "==", loggedInUser));
        try{
            onSnapshot(querySnapshot, (data) => {
                if(data.size === 0){
                  setTickets([]);
                  setViewToRender(
                    <View style={{flex: 1,alignItems:"center", justifyContent:"center"}}>
                      <Text style={styles.text}> No tickets found!</Text>
                      <Text style={styles.text1}>Your tickets will show up here once you've purchased them. </Text>
                    </View>
                  )
              } else {
                setViewToRender();
                setTickets(data.docs.map((doc) => ({...doc.data(), id: doc.id}))); 
              }
          });
        } catch(err){
          console.log(`Error while fetching data from Firestore: ${err.message}`);
        }
      };

    const renderItem = ({item}) => (
        <View style={{padding: 5, borderBottomWidth: 1, flexDirection: 'row'}}>
            <Icon style={styles.iconStyle} name='ticket' size={45} color='grey'/>
            <View>
                <Text>{item.movieName}</Text>
                <Text>Number of Tickets: {item.numOfTickets}</Text>
                <Text style={{ color: '#FF3333'}}>Total Paid: {item.totalPaid}</Text>
            </View>
        </View>
    );

    return(
        <View style={styles.container}>
            {viewToRender}
            {
                fill ?  
                <FlatList style={styles.container} data={tickets} keyExtractor={ (item) => item.id} renderItem={renderItem}/>
                : null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding:10,
    },
    headline: {
        fontSize: 25,
        textAlign: 'center',
        marginBottom: 15,
    },
    iconStyle: {
        paddingTop: 10,
        paddingRight: 20,
        paddingBottom: 10,
    },
    button2: {
        backgroundColor:"blue",
        borderRadius: 10,
        padding:10,
        marginTop:20,
        marginBottom: 5
    },
    text:{
      textAlign:'center',
      fontSize: 20,
      fontWeight:'bold'
    },
    text1:{
      textAlign:'center',
      fontSize: 17,
      marginTop:20
    },
    text2:{
        textAlign:'center',
        color:"white"
    }
})

export default MyPurchasesScreen