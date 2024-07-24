const request = require('supertest');
const { app, disconnectServer } = require('../index');
const State = require('../model/stateModel');
const { dbConnection, disConnectdbConnection } = require('../Config/db.config');
const { access_token } = require('../helper/generateAccessToken');
const USERNAME = process.env.MONGO_USERNAME
const PASSWORD = process.env.MONGO_PASSWORD

const url = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.oktfzry.mongodb.net/stateDB?retryWrites=true&w=majority`

let token;

describe('State Controller', () => {
    beforeAll(async () => {
        await dbConnection(url)
        token = access_token({
            token_payload: {
                userId: 123,
            }
        })

    });
    afterAll(async () => { 
        await disConnectdbConnection()
        await disconnectServer()
     });
    beforeEach(async () => { await State.deleteMany({}); });

    it('Create State', async () => {
        const res = await request(app)
            .post('/api/state/createState')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test State',
                description: 'A state for testing',
                status: 'active',
                createdBy: 'testUser'
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('Test State');
        expect(res.body.description).toBe('A state for testing');
        expect(res.body.status).toBe('active');
        expect(res.body.createdBy).toBe('testUser');
    });

    it('Incorrect Create State', async () => {
        const res = await request(app)
            .post('/api/state/createState')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: '',
                description: '',
                status: '',
                createdBy: ''
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('Message', 'Please provide all details');
    });
    it('get All States', async () => {

        await State.create({
            name: 'Test1',
            description: 'A state for testing 1',
            status: 'active',
            createdBy: 'testUser1'
        });

        const res = await request(app)
            .get('/api/state')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body[0].name).toBe('Test1');
    });

    test('Update State', async () => {

        const mockState = await State.create({
            name: 'Test1',
            description: 'A state for testing 1',
            status: 'active',
            createdBy: 'testUser1'
        });

        const res = await request(app)
            .put(`/api/state/updateState/${mockState._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'updateName'
            });

        expect(res.status).toBe(200);
    });
});
