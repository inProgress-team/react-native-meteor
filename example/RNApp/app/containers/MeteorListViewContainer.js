import Meteor, {withTracker} from 'react-native-meteor';
import React from 'react';
import MeteorListViewComponent from '../routes/MeteorListViewComponent';

export default withTracker(ownProps => {
    const itemsHandle = Meteor.subscribe('items');
    return {
        itemsReady: itemsHandle.ready()
    };
})(MeteorListViewComponent);
