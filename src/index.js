const app = require('./app')

app.listen(process.env.PORT || 5000,()=>{
    console.log('Server is up on the port '+process.env.PORT)
})
