const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 9090;
const dbConnection = require('./db/conn')

//cors middleware all routes
app.use(cors())

//connect to mongod server
dbConnection()


// Middleware to parse JSON request bodies
app.use(express.json());


// music routes
app.use('/music', require('./routes/songRoute'))

// 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
