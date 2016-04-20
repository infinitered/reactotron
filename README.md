# Reactotron

A console program to monitor & control React Native apps as they get built.

# Before Showing Anyone Checklist

* [] Get the vocab right (everything is a "command")
* [] Refactor clients to organize commands

# Wishlist

* [] Allow commands to be extended on client & server
* [] Allow a .reactotron sub-folder for project-specific things
* [] Does router need to exist anymore?
* [] Api size metrics
* [] Pages for logging
* [] Show what the profile shows
* [] Track saga effect chains
* [] Provide a way to drive the navigator
* [] Allow simple scripts to be written that send commands
* [] Strategy for dealing with multiple apps connecting

# Getting Started

1. Copy client/client.js into your project
1. Import reactotron in your index.ios.js and index.android.js and add `reactotron.connect()`
1. Navigate to your reactotron/server directory in your terminal
1. npm install
1. npm start

*Hint:* Add an alias to your .bashrc and/or .zshrc to start your reactotron server from anywhere:
`alias reactotron='cd /path/to/reactotron/server && npm start'`
