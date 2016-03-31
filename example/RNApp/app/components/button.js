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
    margin: 5,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500'
  }
});
