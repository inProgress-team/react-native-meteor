# meteor-webpack-react

This is a Meteor project skeleton where the client (in React) and server get built by Webpack.  In dev mode,
webpack-dev-server is used with [react-transform](https://github.com/gaearon/babel-plugin-react-transform).  There are a bunch of run and build scripts to make things more convenient.

Meteor's builtin ES2015 support doesn't allow you to `import`(/`require`), but **with this project you can use all ES2015/ES7 features supported by Babel/corejs/regenerator on the client and server today**, thanks to Webpack.  ~~There are even source maps on the server thanks to https://github.com/evanw/node-source-map-support!~~ (better source map support will be reintegrated soon, or you can check out the `webpack-meteor-tools` branch!)

There is a port of the Meteor simple-todos tutorial to this stack on the `simple-todos` branch.

## Advantages of packaging with Webpack instead of Meteor

* `require`/ES2015 `import` let you avoid Meteor global variables/load order issues
* `react-transform` reloads React components without reloading the entire page
  when you make changes
* If you `require` your styles with Webpack, it will also reload them without
  reloading the entire page when you make changes to them
* Using an npm module in the browser is as simple as `npm install` and `require`
  * This puts a large part of the React ecosystem (which revolves around Webpack/npm)
    at your fingertips
* Other Webpack loaders are great too, for example:
  * you can break up your CSS into one file per React component, and then `require`
    them in your JSX files
  * or if you want to use Sass, you can `require` the Sass files
  * or you can use `url-loader` to `require` an image file and get a URL to stick in
    an `<img>` tag
* If you use Webpack for your server code too, both the server and the client can `require`
  shared code.  This way you can avoid creating global variables for Meteor collections or
  anything else

## How it works

The `dev.js`, `prod.js`, and `deploy.js` scripts will run Webpack, and symbolically link the generated bundles
into the `meteor_core` directory.

In prod mode, `meteor_core` gets the webpack client and server bundles via the soft links `meteor_core/client/client.bundle.js` and `meteor_core/server/server.bundle.js`.  Two instances of `webpack --watch` are running, one to make the client bundle and one to make the server bundle.

In dev mode, both `webpack-dev-server` and `meteor_core` run simultaneously on different ports (9090 and 3000, respectively), and a `webpack --watch` is also running to compile and output the server code.  A script in `meteor_core/client/loadClientBundle.html` inserts a `<script>` tag linking to the bundle from webpack-dev-server via port 9090 on the page's host.  (It's a bit weird I know, but one can't have a relative URL to a different port, and just putting a script tag to `http://localhost:9090/...` wouldn't work if you're testing on separate device from your dev box).

### Windows note

`meteor_core/client/client.bundle.js` is a soft link to `webpack/assets/client.bundle.js`.  
(Similarly for the server bundle.) I don't know
if the soft link will work on Windows.  If not, you can just copy the bundle in, but *make sure
to rename it to `main.js`* so that Meteor loads it after everything else.

## Requirements

There have been dependency issues with old versions of Node and NPM.  Please try at least Node v0.10.36 and npm v1.4.28 before repording any issues about missing dependencies.

## Running (dev mode)

**Note:** make sure you are forwarding port 9090 (as well as the Meteor port) if you want to test on other devices via LAN.

```
> npm install
> node dev.js
```
Make sure to wait for Meteor to say it's listening, for the client `webpack-dev-server` and server `webpack --watch` to print out module/bundle info.  The site won't work until all are ready.

## Debugging/Profiling Server (dev mode)

```
> npm install -g node-inspector
> npm install
> node debug.js
```
Then visit `http://127.0.0.1:8080/debug?port=5858` in your browser.

## Running (prod mode)
This runs the app as if it were in production, but it's still watching your files for changes.  You can Ctrl-C after it's finished starting up and use `./met deploy`, though.

```
> npm install
> node prod.js
```
Make sure to wait for Meteor to say it's listening, and for the client and server `webpack --watch` processes to print out module/bundle info.  The site won't work until all are ready.


## Karma testing

```
> npm run karma
```

## Deployment

You can set the project name in `projectName.js`.  It defaults to
the project folder name.

There is a deployment script that supports several common options:
```
node deploy.js meteor.com
```
The usual basic meteor.com deploy

```
node deploy.js modulus
```
Uses modulus (make sure to go into the deploy script and replace `your_app_proj_name` with a real value

```
node deploy.js mup
```
See `deploy.js` for some additional hints

```
node deploy.js demeteorizer
```
Builds with demeteorizer


## Meteor Settings

Put your settings in `settings/devel.json` & `settings/prod.json` and they will automatically load when running in development, production and build modes.


## Running Meteor Commands

As a convenience you can run `./met` in the root directory to run the `meteor` command. However you can still `cd meteor_core` and then run `meteor` from that directory as well.

```
./met  --version
./met search simple-schema
```

## Acknowledgements

(if I've forgotten anyone let me know!)

Thanks to:
* @AdamBrodzinski- for a lot of contributions (esp. deployment) and promotion
* Luigi Maselli (@grigio) - for writing the first scripts and showing me how to deal with the Meteor vs. ES2015 Number polyfill issue
* @jbbr - for presenting good workarounds for several issues
