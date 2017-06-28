import React from 'react';
import Meteor, {createContainer} from 'react-native-meteor';
import ConnectionComponent from '../routes/connection';

export default ConnectionContainer = createContainer(ownProps => {
    return {
        status: Meteor.status()
    }
}, ConnectionComponent);