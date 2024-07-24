const request = require('supertest');
const { app, disconnectServer } = require('../index');
const { dbConnection, disConnectdbConnection } = require('../Config/db.config');
const User = require('../model/userModel');
const USERNAME = process.env.MONGO_USERNAME
const PASSWORD = process.env.MONGO_PASSWORD

const url = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.oktfzry.mongodb.net/stateDB?retryWrites=true&w=majority`
let recordId;

describe('Authentication Controller', () => {
    beforeAll(async () => {
        await dbConnection(url)
    });
    afterAll(async () => {
        await User.deleteOne({ _id: recordId })
        await disConnectdbConnection()
        await disconnectServer()
    });

    it('Register User', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: "dummyUser",
                password: "123",
                confirmpassword: "123"
            });

        expect(res.status).toBe(201);
        expect(res.body.register).toHaveProperty('_id');
        expect(res.body.register.username).toBe('dummyUser');
        recordId = res.body.register._id

    });

    it('Login User', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: "dummyUser",
                password: "123",
            });

        expect(res.status).toBe(200);
        expect(res.body.users).toHaveProperty('_id');
        expect(res.body.users.username).toBe('dummyUser');
        expect(res.body).toHaveProperty('token');
    });

});
