import React from "react";
import { View, StyleSheet, TextInput, ActivityIndicator, Modal } from "react-native";
import { ExpoLinksView } from "@expo/samples";
import { MapView } from "expo";
import Coords from "../assets/nHoodCords";
import axios from "axios";

let initialReg = {
  latitude: 47.6062,
  longitude: -122.3321,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

//github issue on markers not returning key value
//https://github.com/react-native-community/react-native-maps/issues/218

export default class LinksScreen extends React.Component {
  state = {
    coords: {
      latitude:49.6062,
      longitude: -122.3321
    },
    error: null,
    stCoords: [],
    modalVisible: false
  }

  static navigationOptions = {
    title: "Maps"
  };

  handlePress = (e) => {
    this.setState({modalVisible:true}, () => {
    console.log("modal show val " + this.state.modalVisible)
    coordinates = [e.coordinate.longitude, e.coordinate.latitude]
    //HERE BE BAD CODEEEEEEE
          //but it works
    for (i=0; i<Coords.length; i++) {
      nHoodCoord = Coords[i].geometry.coordinates
      if (coordinates[0]===nHoodCoord[0] && coordinates[1]===nHoodCoord[1]) {
        console.log('nhood is ' + Coords[i].properties.neighborhood)
        this.props.navigation.navigate("MsgRoom", {pageToLoad : Coords[i].properties.neighborhood})
      }
    }
    nHoodList = this.state.stCoords
    for(j=0;j<nHoodList.length; j++) {
      nHoodCoord = nHoodList[j].location
      if (coordinates[0]===nHoodCoord.longitude && coordinates[1]===nHoodCoord.latitude) {
        console.log('nhood is ' + this.state.stCoords[j].title)
        this.props.navigation.navigate("MsgRoom", {pageToLoad : this.state.stCoords[j].title})
      }
    }
  })
  }


  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({coords:{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    axios.get("https://murmuring-sea-22252.herokuapp.com/chats").then((res, err) => {
      if (err) {
        console.log(err)
      }
      this.setState({stCoords: res.data})
    })

  }

  
  

  render() {
    return (
      <View style={styles.container}>
        <Modal
          style={styles.modal}
          animationType="slide"
          visible={this.state.modalVisible}
          onRequestClose={() => console.log('modal was backed out of')}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </Modal>
      <MapView style={{ flex: 1 }} initialRegion={initialReg}>
        <MapView.Marker
            coordinate={this.state.coords}
            // image={require("../assets/images/marker.png")}
            title={"This is your location!"}
            pinColor={'#cbf442'}
        />
        {Coords.map(coord => (
          <MapView.Marker
            onCalloutPress={e => this.handlePress(e.nativeEvent)}
            key={coord.properties.neighborhood}
            title={coord.properties.neighborhood + "- Press To Join Room!"}
            coordinate={{
              latitude: coord.geometry.coordinates[1],
              longitude: coord.geometry.coordinates[0]
            }}
          />
        ))}
        {this.state.stCoords.map(coord => {
            return coord.defaultRoom === false ? 
              <MapView.Marker
                  onCalloutPress={e => this.handlePress(e.nativeEvent)}
                  key={coord.title}
                  title={coord.title + "- Press To Join Room!"}
                  coordinate={coord.location}
                  pinColor={'#144ca8'}
              />
            : null
            })}
        
      </MapView>
      </View>
    );
  }
}

var styles = StyleSheet.create ({
  container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#F5FCFF'
  },
  modal: {
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 10
  }
})
