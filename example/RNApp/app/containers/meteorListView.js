import Meteor, {createContainer} from 'react-native-meteor';
import React from 'react';
import MeteorListViewComponent from '../routes/meteorListView';

export default MeteorListViewContainer = createContainer(ownProps => {
    const itemsHandle = Meteor.subscribe('items');
    return {
        itemsReady: itemsHandle.ready()
    };
}, MeteorListViewComponent);
