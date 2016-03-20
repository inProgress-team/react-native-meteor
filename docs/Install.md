# Android

Add this to your AndroidManifest.xml file to autoreconnect fastly to DDP server if your device reconnects to network

```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```



# Installing decorators

## With RN >= 0.16.0 (Babel 6)

- `npm i --save-dev babel-plugin-transform-decorators-legacy babel-preset-react-native` in your project
- Create a .babelrc file at the root of your project :

```json
{
  "presets": ["react-native"],
  "plugins": ["transform-decorators-legacy"]
}
```

## With RN <0.16.0 (Babel 5)

Use a .babelrc file at the root of your project that contains :

```json
{
    "optional": ["es7.decorators"],
}
```
