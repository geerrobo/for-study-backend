const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authMiddleware = require('./middleware/auth')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

const app = express()

dotenv.config()

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

app.use('', authRoutes)
app.use('/user', authMiddleware, userRoutes)

app.listen(5000, () => {
    console.log(`Server Running on Port: http://localhost:5000`);
})

const DB_USERNAME = process.env.DB_USERNAME || 'root'
const DB_PASSWORD = process.env.DB_PASSWORD || 'password'
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_NAME = process.env.DB_NAME || 'for_study'

const CONNECTION_URL = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:27017/${DB_NAME}?authSource=admin`;

mongoose.set('strictQuery', true)
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((error) => console.log(`${error} did not connect`))

const db = mongoose.connection

db.once("open", () => {
    console.log("MongoDB database connection established successfully");
})