const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/company.controller');
const { authorize } = require('../../middlewares/auth');
const {
  listCompany,
  createCompany,
  replaceCompany,
  updateCompany
} = require('../../validations/company.validation');

const router = express.Router();

/**
 * Load user when API with mediaId route parameter is hit
 */
router.param('companyId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/company List company
   * @apiDescription Get a list of company
   * @apiVersion 1.0.0
   * @apiName ListCompany
   * @apiGroup Company
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]      List page
   * @apiParam  {Number{1-100}}      [perPage=1]   Company's per page
   * @apiParam  {String}             [title]       Company's Name
   *
   * @apiSuccess {String}  id         Company's id
   * @apiSuccess {String}  title      Company's Name
   * @apiSuccess {String}  info       Company's info
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(), validate(listCompany), controller.list)
  /**
   * @api {post} v1/company Create Company
   * @apiDescription Create a new Company
   * @apiVersion 1.0.0
   * @apiName CreateCompany
   * @apiGroup Company
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam   {String}  title      Company's Name
   * @apiParam   {String}  info   Company's info
   * 
   * @apiSuccess (Created 201) {String}  id         Company's id
   * @apiSuccess (Created 201) {String}  title      Company's Name
   * @apiSuccess (Created 201) {String}  info       Company's info 
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
  .post(authorize(), validate(createCompany), controller.create);

  router
  .route('/:companyId')
  /**
   * @api {put} v1/company/:id Get company
   * @apiDescription Get the company and media details
   * @apiVersion 1.0.0
   * @apiName GetCompany
   * @apiGroup Company
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Admin's access token
   *
   * @apiSuccess {String}  id         Company's id
   * @apiSuccess {String}  title      Company's title
   * @apiSuccess {String}  info       Company's info
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated admin can access the data
   */
  .get(authorize(), controller.get)
  /**
   * @api {put} v1/company/:id Replace company
   * @apiDescription Replace the whole company document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceCompany
   * @apiGroup Company
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Admin's access token
   *
   * @apiParam  {String}             title     Company's title 
   * @apiParam  {String}             info      Company's info
   *
   * @apiSuccess {String}  id         Company's id
   * @apiSuccess {String}  title      Company's title
   * @apiSuccess {String}  info       Company's info
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated admin can access the data
   */
  .put(authorize(), validate(replaceCompany), controller.replace)
  /**
   * @api {patch} v1/company/:id Update company
   * @apiDescription Update some fields of a company document
   * @apiVersion 1.0.0
   * @apiName UpdateCompany
   * @apiGroup Company
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization  Admin's access token
   *
   * @apiParam  {String}             title     Company's title 
   * @apiParam  {String}             info      Company's info
   *
   * @apiSuccess {String}  id         Company's id
   * @apiSuccess {String}  title      Company's title
   * @apiSuccess {String}  info       Company's info
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated admin can modify the data
   */
  .patch(authorize(), validate(updateCompany), controller.update)
  /**
   * @api {delete} v1/company/:id Delete company
   * @apiDescription Delete a company
   * @apiVersion 1.0.0
   * @apiName DeleteCompany
   * @apiGroup Company
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization  Admin's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated admin can modify the data
   */
  .delete(authorize(), controller.remove);

module.exports = router;
