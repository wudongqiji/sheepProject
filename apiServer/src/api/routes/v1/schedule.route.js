const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/schedule.controller');
const { authorize } = require('../../middlewares/auth');
const {
  listSchedule,
  createSchedule,
  replaceSchedule,
  updateSchedule
} = require('../../validations/schedule.validation');

const router = express.Router();

/**
 * Load user when API with mediaId route parameter is hit
 */
router.param('scheduleId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/schedule List Schedule
   * @apiDescription Get a list of Schedule
   * @apiVersion 1.0.0
   * @apiName ListSchedule
   * @apiGroup Schedule
   * @apiPermission public
   *
   *
   * @apiParam  {Number{1-}}         [page=1]      List page
   * @apiParam  {Number{1-100}}      [perPage=1]   Schedule's per page
   * @apiParam  {String}             [title]       Schedule's Name
   *
   * @apiSuccess {String}  id         Schedule's id
   * @apiSuccess {String}  title      Room's Name
   * @apiSuccess {Array}   list       List of User
   * @apiSuccess {String}  text       Schedule's description
   * @apiSuccess {Date}    dateFrom   Schedule's Date From
   * @apiSuccess {Date}    dateTo     Schedule's Date To
   * @apiSuccess {String}  company    Company's Name
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(validate(listSchedule), controller.list)
  /**
   * @api {post} v1/schedule Create Schedule
   * @apiDescription Create a new Schedule
   * @apiVersion 1.0.0
   * @apiName CreateSchedule
   * @apiGroup Schedule
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam   {String}  title      Schedule's Name
   * @apiParam   {Array}   list       List of User
  //  * @apiParam   {Date}    dateFrom   Schedule's Date From
  //  * @apiParam   {Date}    dateTo     Schedule's Date To
  //  * @apiParam   {String}  company    Company's Name
   * 
   * @apiSuccess (Created 201) {String}  id         Schedule's id
   * @apiSuccess (Created 201) {String}  title      Room's Name
   * @apiSuccess (Created 201) {Array}   list       List of User
   * @apiSuccess (Created 201) {String}  text       Schedule's description
   * @apiSuccess (Created 201) {Date}    dateFrom   Schedule's Date From
   * @apiSuccess (Created 201) {Date}    dateTo     Schedule's Date To
   * @apiSuccess (Created 201) {String}  company    Company's Name
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
  .post(authorize(), validate(createSchedule), controller.create);

  router
  .route('/:scheduleId')
  /**
   * @api {put} v1/schedule/:id Get schedule
   * @apiDescription Get the schedule and media details
   * @apiVersion 1.0.0
   * @apiName GetSchedule
   * @apiGroup Schedule
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Admin's access token
   *
   * @apiSuccess {String}  id         Schedule's id
   * @apiSuccess {String}  title      Room's Name
   * @apiSuccess {Array}   list       List of User
   * @apiSuccess {String}  text       Schedule's description
   * @apiSuccess {Date}    dateFrom   Schedule's Date From
   * @apiSuccess {Date}    dateTo     Schedule's Date To
   * @apiSuccess {String}  company    Company's Name
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated admin can access the data
   */
  .get(authorize(), controller.get)
  /**
   * @api {put} v1/schedule/:id Replace schedule
   * @apiDescription Replace the whole schedule document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceSchedule
   * @apiGroup Schedule
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Admin's access token
   *
   * @apiParam   {String}  title      Schedule's Name
   * @apiParam   {Array}   list       List of User
   * @apiParam   {Date}    dateFrom   Schedule's Date From
   * @apiParam   {Date}    dateTo     Schedule's Date To
   * @apiParam   {String}  company    Company's Name
   * 
   * @apiSuccess {String}  id         Schedule's id
   * @apiSuccess {String}  title      Room's Name
   * @apiSuccess {Array}   list       List of User
   * @apiSuccess {String}  text       Schedule's description
   * @apiSuccess {Date}    dateFrom   Schedule's Date From
   * @apiSuccess {Date}    dateTo     Schedule's Date To
   * @apiSuccess {String}  company    Company's Name
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated admin can access the data
   */
  .put(authorize(), validate(replaceSchedule), controller.replace)
  /**
   * @api {patch} v1/schedule/:id Update schedule
   * @apiDescription Update some fields of a schedule document
   * @apiVersion 1.0.0
   * @apiName UpdateSchedule
   * @apiGroup Schedule
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization  Admin's access token
   *
   * @apiParam   {String}  title      Schedule's Name
   * @apiParam   {Array}   list       List of User
   * @apiParam   {String}  text       Schedule's description
   * @apiParam   {Date}    dateFrom   Schedule's Date From
   * @apiParam   {Date}    dateTo     Schedule's Date To
   * @apiParam   {String}  company    Company's Name
   * 
   * @apiSuccess {String}  id         Schedule's id
   * @apiSuccess {String}  title      Room's Name
   * @apiSuccess {Array}   list       List of User
   * @apiSuccess {String}  text       Schedule's description
   * @apiSuccess {Date}    dateFrom   Schedule's Date From
   * @apiSuccess {Date}    dateTo     Schedule's Date To
   * @apiSuccess {String}  company    Company's Name
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated admin can modify the data
   */
  .patch(authorize(), validate(updateSchedule), controller.update)
  /**
   * @api {delete} v1/schedule/:id Delete schedule
   * @apiDescription Delete a schedule
   * @apiVersion 1.0.0
   * @apiName DeleteSchedule
   * @apiGroup Schedule
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
