# How To ?

## react-native-router-flux

* You can use Switch with createContainer. Example :

```javascript
  componentWillMount() {
    this.scenes = Actions.create(
        <Scene key="root" component={createContainer(this.composer, Switch)} selector={this.selector} tabs={true}>
            <Scene key="loading" hideNavBar={true} component={Loading} />
            <Scene key="login" hideNavBar={true}>
              <Scene key="loginbis" component={Login} />
            </Scene>

            <Scene key="loggedIn" component={Layout}>
                <Scene key="main" hideNavBar={true}>
                    //...
                </Scene>
            </Scene>
        </Scene>
    );
  }
  composer() {
    return {
      connected: Meteor.status().connected,
      user: Meteor.user()
    }
  }
  selector(data, props) {
    if(!data.connected) {
      return "loading";
    } else if (!data.user) {
      return "login";
    } else {
      return "loggedIn";
    }
  }
```
