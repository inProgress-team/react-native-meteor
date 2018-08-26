import React from 'react';
import Meteor, {withTracker} from 'react-native-meteor';
import MetorComplexListViewComponent from '../routes/meteorComplexListView';

export default ComplexListViewContainer = withTracker((ownProps) => {
    const itemsHandle = Meteor.subscribe('items');
    return {
        itemsReady: itemsHandle.ready()
    };
})(MetorComplexListViewComponent);
