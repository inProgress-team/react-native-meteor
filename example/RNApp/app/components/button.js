import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

export default class Button extends Component {
  render() {
    let { text, onPress } = this.props;
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#A7A7A7',
    margin: 5
  },
  buttonText: {}
});
