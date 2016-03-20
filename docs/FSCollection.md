# Implementation for Meteor-CollectionFS

## Example usage

```javascript
@connectMeteor
export default class ImageFS extends Component {
  startMeteorSubscriptions() {
    Meteor.subscribe('imagesFiles');
  }
  getMeteorData() {
    return {
      image: Meteor.FSCollection('imagesFiles').findOne()
    }
  }
  render() {
    const { image } = this.data;

    if(!image) return null;

    return (
      <Image
        style={{height: 400, width: 400}}
        source={{uri: image.url()}}
      />
    );
  }
}
```

## Available methods on FSFile

All methods accept an optional parameter to choose another store. Example `file.url({store: 'thumbnail'})`

* url([store])
* isImage([store])
* isVideo([store])
* isAudio([store])
* isUploaded([store])
* name([store])
* extension([store])
* size([store])
* type([store])
* updatedAt([store])

## Something wrong or missing ?

Please create an issue or make a PR ;)

