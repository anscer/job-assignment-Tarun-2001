const express = require('express')
const stateController = require('../controller/stateController')
const route = express.Router()


route.get('/', stateController.getStates)
route.post('/createState',stateController.createState)
route.get('/updateState', stateController.updateState)
route.post('/deleteState',stateController.deleteState)

module.exports = route