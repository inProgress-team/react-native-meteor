import Meteor from 'react-native-meteor';

export default function() {
    const url = 'ws://localhost:3000/websocket';
    Meteor.connect(url);
}
