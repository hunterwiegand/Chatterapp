import React from 'react';
import { View, TextInput, Button, StyleSheet,Text } from "react-native"

export default class MessageScreen extends React.Component {
  state = {
    messages: [],
    message: "",
  }

  static navigationOptions = {
    title: 'Messages',
  };

  handleSend = () => {
    let arr = this.state.messages.slice();
    let value = "   fgh      "

    if (this.state.message) {
      arr.push(this.state.message);
      this.setState({
        messages: arr,
        message: ""
      })
    }

    if(value){
      console.log("true")
    }
    else{console.log("false")}
  }

  render() {
    return (
      <View>
        <TextInput
          value={this.state.message}
          onChangeText={message => this.setState({message: message})}
          placeholder="Message"
          placeholderTextColor="#FFF"
          style={styles.input}
        />

        <Button title="Send" onPress={this.handleSend} />

        <Text>{this.state.messages.join(" ")}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },

  input: {
    height: 40,
    backgroundColor: "rgba(000,000,000,0.2)",
    marginBottom: 20,
    color: "#000",
    paddingHorizontal: 10
  }
});