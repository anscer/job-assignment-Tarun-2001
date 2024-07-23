const express = require('express');
const { dbConnection } = require('./Config/db.config');
const dotenv = require('dotenv').config()
const stateRoute = require('./route/stateRoute')

const app = express();
const port = process.env.PORT||3000;

const USERNAME = process.env.MONGO_USERNAME
const PASSWORD = process.env.MONGO_PASSWORD

const url = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.oktfzry.mongodb.net/stateDB?retryWrites=true&w=majority`

app.use(express.json());
app.use(express.static('public'));


app.use('/api/state',stateRoute)

app.get('/', (req, res) => {
 res.send('Hello, World!');
});

app.get('/api/test', (req, res) => {
 res.json({ message: 'This is an test endpoint' });
});




app.listen(port, () => {
    dbConnection(url)
 console.log(`Server is running on port: ${port}`);
});

