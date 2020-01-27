const express = require('express');
const router = express.Router();
const controller = require("../controllers/placesController");

router.get('/visited', controller.get);
router.get('/visited/:id', controller.getById);
router.post('/visited', controller.add);
router.put('/visited/:id', controller.update)
router.delete('/visited/:id', controller.remove);

module.exports = router;