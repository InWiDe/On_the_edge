const app = require('./app')

const port = process.env.PORT

app.listen(port || 5000,()=>{
    console.log('Server is up on the port '+port)
})
