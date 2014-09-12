Flickr Public Feed Client [![Build Status](https://travis-ci.org/ColorfullyMe/flickr-potato.svg)](https://travis-ci.org/ColorfullyMe/flickr-potato)
====
*Just a potato web app :)*

Let's see, how do you feel about potatos... and/or... today? You can use this app to find out or just for fun. Works direct in the browser and delivers public content from Flickr.

### How to use it?
- There is a demo [here](). But please, do not abuse it! This link is hits limited and just to see what this app is all about.
- Clone or download this repo. Put the content inside some folder of your webserver and go to: `yourwebserver.com/the-path-copied-to/dist`
- If you know what you are doing type `[sudo] gulp serve` in the CLI and point a browser to `localhost:8000`

### Contributing
This app is made with Angularjs, some modules for ng, Bootstrap and gulp. To hack on it you will need node.js, npm, bower and gulp installed on the system.

The tasks you probably want to run:

1. `[sudo] gulp [--dev]` - to make a build into the `./dist` folder. Use `--dev` when you develop and the tasks will run on file changes.
2. `[sudo] gulp serve` - will start a webserver listening on `localhost:8000` and serve the app (remember to build it first).
3. `[sudo] gulp docs` - will build the docs into the `./docs` folder.

Anotated source code is [here]().

### License
MIT
