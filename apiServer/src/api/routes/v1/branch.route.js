const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/branch.controller');
const { authorize } = require('../../middlewares/auth');
const {
  listBranch,
  getBranch,
  createBranch,
  updateBranch,
  removeBranch,
} = require('../../validations/branch.validation');

const router = express.Router();

router.param('branchId', controller.load);

router
  .route('/')
  .get(validate(listBranch), controller.list)
  .post(validate(createBranch), controller.create);

router
  .route('/:branchId')
  .get(validate(getBranch), controller.get)
  .put(validate(updateBranch), controller.update)
  .delete(validate(removeBranch), controller.remove);

module.exports = router;