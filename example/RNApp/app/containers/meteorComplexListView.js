import React from 'react';
import Meteor, {createContainer} from 'react-native-meteor';
import MetorComplexListViewComponent from '../routes/meteorComplexListView';

export default ComplexListViewContainer = createContainer((ownProps) => {
    const itemsHandle = Meteor.subscribe('items');
    return {
        itemsReady: itemsHandle.ready()
    };
}, MetorComplexListViewComponent);
