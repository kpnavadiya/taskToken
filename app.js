require('dotenv').config();

const express = require('express') 
const app = express();

const appRouter = require('./version1/router/index')

var bodyParser = require('body-parser')

app.use(bodyParser.json());


// console.log('Server ??')
app.use('/version1', appRouter); 

// process.env.EXPRESS_PORT
app.listen(process.env.EXPRESS_PORT, function () {  // listening to port 3000 for client request
    console.log('Listening on port 3000')
  })  