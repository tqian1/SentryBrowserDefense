Creation Date: April 1, 2019
Original author: tqian1/generator-angular-fullstack
Original author repository: https://github.com/angular-fullstack/generator-angular-fullstack 
Authors of modifications: Tony Qian, Wrote code after initial boilerplate generation
Contents: Contains the fullstack application/api for our Sentry heap snapshot profiler tool

# sentry-app

This is a fullstack application for our capstone, it is able to parse heap snapshots via web requests and present them for viewing via an API as well as a front end browser.

It was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 4.2.3.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

3. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `gulp build` for building and `gulp serve` for preview.

## Testing

Running `npm test` will run the unit tests with karma.
