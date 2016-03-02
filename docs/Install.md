# Installing decorators

## With RN >= 0.20.0 (Babel 6)

- `npm i --save-dev babel-plugin-transform-decorators-legacy babel-preset-react-native` in your projet
- Create a .babelrc file at the root of your project :

```json
{
  "presets": ["react-native"],
  "plugins": ["transform-decorators-legacy"]
}
```


## With RN >= 0.16.0 && <= 0.19.0 (Babel 6)

Looking for your help. The RN 0.20.0 might be working, please let me know ;)

## With RN <0.16.0 (Babel 5)

Use a .babecrc file at the root of your projet that contains :

```json
{
    "optional": ["es7.decorators"],
}
```
