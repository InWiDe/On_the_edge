const express = require('express')
const engine = require('./services/stories/classes');
var bodyParser = require('body-parser');
var cors = require('cors')
require ('./db/mongoose')

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    next()
}

const app = express()
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
//User Router
const storyRouter = require('./services/stories/stories.js')
//Router for stories
app.use(storyRouter)
app.use(cors());
app.use(allowCrossDomain)


engine();

module.exports = app