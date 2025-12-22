const express = require('express');
const routesController = require('../controllers/routes.controller');

const router = express.Router();

router.get('/status', routesController.getStatus);
router.get('/', routesController.getRoutes);

module.exports = router;
