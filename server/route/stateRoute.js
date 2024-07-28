const express = require('express')
const stateController = require('../controller/stateController')
const { protect } = require('../middlewares/authentication')
const route = express.Router()


route.get('/', stateController.getStates)
route.post('/createState',protect,stateController.createState)
route.put('/updateState/:stateID',protect, stateController.updateState)
route.delete('/deleteState/:stateID',protect,stateController.deleteState)
route.post('/aggregateState',protect,stateController.aggregateStates)

module.exports = route