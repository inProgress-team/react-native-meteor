import React from 'react';
import Meteor, {withTracker} from 'react-native-meteor';
import ConnectionComponent from '../routes/connection';

export default withTracker(ownProps => {
    return {
        status: Meteor.status()
    }
})(ConnectionComponent);