import React from 'react';
import Meteor, {withTracker} from 'react-native-meteor';
import EditItem from '../routes/editItem';

export default withTracker((props) => {
    Meteor.subscribe('items');
    return {
        item: Meteor.collection('items').findOne()
    }
})(EditItem);
