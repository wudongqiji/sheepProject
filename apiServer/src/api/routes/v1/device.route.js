const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/device.controller');
const { authorize } = require('../../middlewares/auth');
const {
  listDevice,
  getDevice,
  registerDevice,
  updateDevice,
  removeDevice,
} = require('../../validations/device.validation');

const router = express.Router();

router.param('deviceId', controller.load);

router
  .route('/')
  .get(validate(listDevice), controller.list)
  .post(validate(registerDevice), controller.register);

router
  .route('/:deviceId')
  .get(validate(getDevice), controller.get)
  .put(validate(updateDevice), controller.update)
  .delete(validate(removeDevice), controller.remove);

module.exports = router;