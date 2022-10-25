import { useEffect, useState } from "react";
import { StyleSheet, FlatList, Text, View, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const NowPlayingScreen = ({navigation, route}) => {

    const [movieData, setMovieData] = useState([]);

    useEffect( () => {getMoviesFromAPI()}, []);

    const getMoviesFromAPI = async () => {
        const apiURL = `https:/api.themoviedb.org/3/movie/now_playing?api_key=7f67afae9e694ba284fc686d0d2393ce&language=en-US&page=1&region=CA`;
        console.log(apiURL);

        try {
            const response = await fetch(apiURL);
            try {
                const jsonData = await response.json();
                setMovieData(jsonData.results);
                console.log(`Response JSON Data : ${jsonData.results.length}`);
            } catch (error) {
                console.log(`Error while getting json from response : ${error}`);
            }
        } catch (error_1) {
            console.log(`Error while getting response from server : ${error_1}`);
        }
    }

    const renderMovies = ( {item} ) => (
        <Pressable onPress={ () => {

            navigation.navigate("MovieDetails", {
                movieId: `${item.id}`,
                movieName:`${item.original_title}`,
                movieDesc:`${item.overview}`,
                movieImage:`${item.backdrop_path}`,
                movieReleaseDate:`${item.release_date}`,
                movieRating:`${item.vote_average}`
              })
            console.log(`${item.original_title} Details Screen `);
        }
        }>
            <View style={styles.container}>
                <View>
                    <Text style={styles.textName}> {item.original_title} </Text>
                    <Text style={styles.textDate}> Release Date: {item.release_date} </Text>
                </View>
                
                <Icon style={{paddingTop:14}} name={"chevron-right"} size={10} color={"blue"}/>
            </View>
        </Pressable>
    );

    return(
        <View>
            <FlatList 
                data={movieData}
                keyExtractor={ (item) => {return item.id}}
                renderItem={ renderMovies }
                />
        </View>
    );
}


const styles = StyleSheet.create({
    textName:{
        fontSize:16
    },
    textDate:{
        fontSize:13
    },
    container:{
        flexDirection: 'row',
        justifyContent: "space-between",
        padding:10,
        borderBottomWidth: StyleSheet.hairlineWidth,
    }
});

export default NowPlayingScreen