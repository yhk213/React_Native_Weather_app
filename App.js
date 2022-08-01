import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { 
  Text, View, StyleSheet, ScrollView, Dimensions, ActivityIndicator
} from "react-native";
import * as Location from "expo-location";
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "82b35ab8a778507ca514595efe87ff0c"; 
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Rain: "rains",
  Snow: "snow",
  Drizzle: "rain",
  Atmosphere: "cloudy-gusts",
  Thunderstorm: "lightning"
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    } 
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude}, 
      {useGoogleMaps: false}
    );
    setCity(`${location[0].district} ${location[0].street}`);
    console.log(city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily); 
  }
  useEffect(() => {
    getWeather();
  }, []);

  return (   
    <View style={styles.container}> 
      <StatusBar style="dark" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      
      <ScrollView 
        pagingEnabled
        horizontal 
        showsHorizontalScrollIndicator= {false}
        contentContainerStyle={styles.weather}
      >
        {days.length ===0 ? (
          <View style={styles.day}>
            <ActivityIndicator 
              color="white" 
              size="large"
              style={{marginTop: 10}} 
            />
          </View>
        ) : (
          days.map((day, index) => 
          <View key={index} style={styles.day}>
            <View 
              style={{
                flexDirection:"row", 
                alignItems:"center", 
                width:"100%", 
                justifyContent:"space-between"
            }}>
              <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(1)}C
              </Text>
              <Fontisto name={icons[day.weather[0].main]} size={60} color="white" />
            </View>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
          </View>)
        )}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex:1, 
    backgroundColor:"orange"
  },
  city : {
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  cityName : {
    color:"white",
    fontSize :50,
    fontWeight : "500"
  },
  weather : {

  },
  day: {

    width: SCREEN_WIDTH,
  },
  temp: {
    color: "white",
    marginTop: 50,
    fontSize: 80
  },
  description: {
    color: "white",
    marginTop: -10,
    fontSize: 35
  },
  tinyText: {
    color: "white",
    fontSize: 20,
  }
})








//     <View style={styles.container}>
//       <Text style={styles.text}>Hellooooooo!!!!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text: {
//      fontSize: 28,
//      color:"blue"
//   },
// });
