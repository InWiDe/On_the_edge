const express = require('express')

require ('./db/mongoose')

// //User Router
// const userProjectRouter = require('./services/user/user-project')

// //Router for login/signup/
// app.use(authRouter)

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    next()
}

const app = express()

app.use(allowCrossDomain)
app.use(express.json())

module.exports = app