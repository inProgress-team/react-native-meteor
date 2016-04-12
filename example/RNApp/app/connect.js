import Meteor from 'react-native-meteor';

export default function() {
    const url = 'http://localhost:3000/websocket';
    Meteor.connect(url);
}