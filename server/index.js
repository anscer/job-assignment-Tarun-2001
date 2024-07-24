const express = require('express');
const { dbConnection } = require('./Config/db.config');
const dotenv = require('dotenv').config()
const stateRoute = require('./route/stateRoute');
const authRoute = require('./route/authRoute');

const NotFound = require('./middlewares/NotFound');
const { errorHandle } = require('./middlewares/errorHandle');

const app = express();
const port = process.env.PORT||3000;

const USERNAME = process.env.MONGO_USERNAME
const PASSWORD = process.env.MONGO_PASSWORD

const url = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.oktfzry.mongodb.net/stateDB?retryWrites=true&w=majority`

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.json({ message: 'This is an test endpoint' });
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'This is an test endpoint' });
});

app.use('/api/auth',authRoute)
app.use('/api/state',stateRoute)
app.use(NotFound)
app.use(errorHandle)


let server = app.listen(port, () => {
    dbConnection(url)
    console.log(`Server is running on port: ${port}`);
});

const  disconnectServer = async()=> {
    if(server){
        await server.close(() => {
            console.log('Server closed');
        });
    }
}

module.exports = {app,disconnectServer}