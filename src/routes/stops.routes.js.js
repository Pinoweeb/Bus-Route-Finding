const express = require('express');
const router = express.Router();
const stopsController = require('../controllers/stops.controller');

router.get('/nearby', stopsController.getStopsNearby);

router.get('/', stopsController.getAllStops);

router.get('/:id', stopsController.getStopById);

module.exports = router;