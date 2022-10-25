import { useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert} from 'react-native';
import { db,auth } from "../FirebaseApp"
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

const BuyTicketsScreen = ({navigation, route}) => {

    const movieId = route.params.movieId
    const movieName = route.params.movieName
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [numOfTickets, setNumOfTickets] = useState(0)
    const [subTotal, setSubTotal] = useState(0)
    const [tax, setTax] = useState(0)
    const [total, setTotal] = useState(0)
    const [showSummary, setShowSummary] = useState(false)

    useEffect(()=>{
        const listener = onAuthStateChanged(auth, (user) => {
            if (user) {
              setLoggedInUser(user);
              setEmail(user.email);
            }
            else {
              setLoggedInUser(null);
            }
          })
          return listener
      }, [])

    const AddPressed = () => {
        let num = numOfTickets + 1
        setNumOfTickets(num)
        setShowSummary(true)
        Calculate(num)
    }

    const SubPressed = () => {
        if(numOfTickets !== 0){
            let num = numOfTickets - 1
            setNumOfTickets(num)
            setShowSummary(true)
            Calculate(num)
        }else if(numOfTickets === 0){
            Alert.alert("Number of Tickets cannot be less than 0")
            setShowSummary(false)
        }
    }

    const Calculate = (number) => {

        let subtotal = number * 12
        setSubTotal(subtotal)
        let tax = subtotal * .13
        setTax(tax)
        let total = subtotal + tax
        setTotal(total)
    }

    const ConfirmPurchasePressed = async () => {

        if(email == '' || name == '')
        {
            Alert.alert("Email and name cannot be blank");
            return;
        }

        if(numOfTickets === 0)
        {
            Alert.alert("Invalid Number Of tickets");
            return;
        }
        
        
        const ticketToAdd = {
            movieId: movieId,
            name: name,
            email: email,
            movieName: movieName,
            numOfTickets: numOfTickets,
            totalPaid: total,
            userId:loggedInUser.uid
        }
        try {
            const insertedDocument = await addDoc(collection(db, "tickets"), ticketToAdd)
            Alert.alert('Purchase Success')
            navigation.navigate("NowPlaying");
        } catch (err) {
            console.log(`Error: ${err.message}`)
        }
    }


    return(
        <View style={styles.container}>
            <Text style={styles.title}>{movieName}</Text>
            <Text>Your Email Address:</Text>
            <TextInput placeholder='Enter Email'
                autoCapitalize='none'
                style={styles.inputText}
                value={email}
                onChangeText={setEmail} />
            <Text>Your Name:</Text>
            <TextInput placeholder='Enter Name'
                autoCapitalize='none'
                style={styles.inputText}
                value={name}
                onChangeText={setName}/>

            <Text>Number of Tickets:</Text>
            <View style={styles.ticketContainer}>
                <Pressable onPress={SubPressed} style={styles.button2}>
                    <Text style={styles.text2}>-</Text>
                </Pressable>
                <Text style = {styles.number}>{numOfTickets}</Text>
                <Pressable onPress={AddPressed} style={styles.button2}>
                    <Text style={styles.text2}>+</Text>
                </Pressable>

            </View>
            {showSummary && (
                <View>
                    <Text>Order Summary:</Text>
                    <View style={styles.summaryContainer}>
                        <Text style={styles.text4}>{movieName}</Text>
                        <Text style={styles.text4}>Number of Tickets: {numOfTickets}</Text>
                        <Text style={styles.text4}>Subtotal: ${subTotal}</Text>
                        <Text style={styles.text4}>Tax: ${tax.toFixed(2)}</Text>
                        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
                    </View>                 
                </View>    
            )}
            
            <Pressable onPress={ConfirmPurchasePressed} style={styles.button}>
                <Text style={styles.text}>Confirm Purchase</Text>
            </Pressable>
            
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding:10,
    },
    ticketContainer:{
        flexDirection:'row'
    },
    summaryContainer:{
        padding: 10,
        borderWidth: 1,
        borderColor:"#888",
    },
    title: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
      marginBottom: 20, 
      marginTop:10 
    },
    text4:{
        fontSize: 15,
    },
    totalText:{
        padding:10,
        backgroundColor:"gold",
        fontWeight:'bold',
        fontSize:15
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
        marginTop:40,
        marginBottom: 5,
        borderRadius: 10,
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
    },
    number: {
        marginLeft: 7,
        marginTop: 20,
        marginRight: 7,
    },

  });

export default BuyTicketsScreen