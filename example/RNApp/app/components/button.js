import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

export default class Button extends Component {
  render() {
    const { text, onPress } = this.props;
    return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

Button.defaultProps = {
  text: "Button Text",
  onPress: () => console.log('Button Pressed')
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: '500',
    textAlign: 'center',
    padding: 5,
    borderRadius: 5,
  }
});
