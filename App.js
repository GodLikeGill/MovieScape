import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "./FirebaseApp"
import Icon from 'react-native-vector-icons/FontAwesome';
import NowPlayingScreen from './screens/NowPlayingScreen';
import MyPurchasesScreen from './screens/MyPurchasesScreen';
import MovieDetailsScreen from './screens/MovieDetailsScreen';
import BuyTicketsScreen from './screens/BuyTicketsScreen';
import LoginScreen from './screens/LoginScreen';
import LogoutScreen from './screens/LogoutScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {

  const [userLoggedIn, setUserLoggedIn] = useState(false)

    useEffect(()=>{
        const checkUser = onAuthStateChanged(auth, (userFromFirebase) => {
            if(userFromFirebase){
              setUserLoggedIn(true)
              
            }else{
              setUserLoggedIn(false)
            }
        })
        return checkUser
    },[])

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({route}) => ({
        "tabBarIcon": ({ color, size}) => {
          let iconName;

          if(route.name === "Home"){
            iconName = 'play'
          } else if(route.name === "MyPurchases"){
            iconName = 'ticket'
          } else if(route.name === "Logout"){
            iconName = 'user'
          }
          return<Icon name={iconName} size={size} color={color}/>
        }
      })}>

        <Tab.Screen component={Home} name="Home" options={{ headerShown: false }}/>
        <Tab.Screen component={MyPurchasesScreen} name="MyPurchases" options={{ title: "Your Tickets", headerTitleAlign: 'center'}}/>
        { (userLoggedIn === true ) && <Tab.Screen component={LogoutScreen} name="Logout" options={{ title: "Logout Screen", headerTitleAlign: 'center'}}/> }
        
      </Tab.Navigator>
    </NavigationContainer> 
  );
}

function Home() {
  return (
      <Stack.Navigator>
        <Stack.Screen component={NowPlayingScreen} name="NowPlaying" options={{ title: "Now Playing", headerTitleAlign: 'center'}}/>
        <Stack.Screen component={MovieDetailsScreen} name="MovieDetails" options={{ title: "Movie Details", headerTitleAlign: 'center'}}/>
        <Stack.Screen component={LoginScreen} name="Login" options={{ headerShown: false }}/>
        <Stack.Screen component={BuyTicketsScreen} name="BuyTickets" options={{ title: "Buy Tickets", headerTitleAlign: 'center', headerStyle: 'bold'}}/>
      </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});