/* global ReactMeteorData */
import React, {Component} from 'react';
import reactMixin from 'react-mixin';

import { ImagesFiles } from 'collections';

@reactMixin.decorate(ReactMeteorData)
export default class TodosComponent extends Component {
  getMeteorData() {
    return {
      image: ImagesFiles.findOne()
    };
  }
  render() {
    const { image } = this.data;
    console.log(image);
    return (
      <div>
        <img src={image && image.url({store: 'anotherStore'})} alt=""/>
      </div>
    );
  }
}
