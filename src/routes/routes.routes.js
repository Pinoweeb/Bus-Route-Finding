const express = require('express');
const routesController = require('../controllers/routes.controller');

const router = express.Router();

router.get('/status', routesController.getStatus);
router.get('/', routesController.getRoutes);
router.get('/:id', routesController.getRouteById);

module.exports = router;
