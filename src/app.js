const express = require('express')
const engine = require('./services/stories/classes');

require ('./db/mongoose')

//User Router
const storyRouter = require('./services/stories/stories.js')

//Router for stories
app.use(storyRouter)

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    next()
}

const app = express()

app.use(allowCrossDomain)
app.use(express.json())

engine();

module.exports = app