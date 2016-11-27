import React from 'react';
import Meteor, {createContainer} from 'react-native-meteor';
import EditItem from '../routes/editItem';

export default EditItemContainer = createContainer((props) => {
    Meteor.subscribe('items');
    return {
        item: Meteor.collection('items').findOne()
    }
}, EditItem);
