# React Native - Meteor Boilerplate

A starting point for integrating a React Native app with a Meteor app. I've used this file structure in large, multi-developer projects.

_Note #1:_ This project only specifies an opinion on the *React Native* project architecture.

## Getting started with Meteor

1. Make sure you have [Meteor](https://www.meteor.com/) installed.
2. After cloning the repo, `cd MeteorApp/ && meteor`


## Getting started with React Native

1. Make sure you have [React Native](https://facebook.github.io/react-native/) installed.
2. After cloning the repo, `cd RNApp/ && npm install`

## Running on iOS

### In the Simulator

From the `RNApp/` directory you can run `npm run ios`. This will start the react native packager and open up Xcode. The default configurations in `app/config.js` should work fine for you. The press the play button in Xcode.

### On a Device

In `RNApp/ios/RNApp/AppDelegate.m` change the the `jsCodeLocation` line and swap out `localhost` for your machine's IP Address. You can get your IP Address by running `ipconfig getifaddr en1`.

You'll also have to change the `host` option in `app/config.js` to be your machine's IP Address.

Then `npm run ios` to open Xcode.

Then plug your phone into your machine and select your device in Xcode. Press the play button in Xcode. Make sure you device is unlocked

## Running on Android

### In the Simulator

First you'll have to change the `host` option in `RNApp/app/config.js` to your Meteor server's IP address. While developing this will likely be your machine. On OSX you can get your IP address by running `ipconfig getifaddr en1` in a terminal window.

Once you've done that (and following successful completion of the [React Native Android Installation](https://facebook.github.io/react-native/docs/android-setup.html#content)) you can run `react-native run-android` to get the app running.

_Note:_ You have to have the android simulator running before running `react-native run-android`.

### On a Device

__HELP REQUESTED__: I don't have an Android device so I can't test this out.
