const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/room.controller');
const { authorize } = require('../../middlewares/auth');
const {
  listRoom,
  createRoom,
  replaceRoom,
  updateRoom
} = require('../../validations/room.validation');

const router = express.Router();

/**
 * Load user when API with mediaId route parameter is hit
 */
router.param('roomId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/room List room
   * @apiDescription Get a list of room
   * @apiVersion 1.0.0
   * @apiName ListRoom
   * @apiGroup Room
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]      List page
   * @apiParam  {Number{1-100}}      [perPage=1]   Room's per page
   * @apiParam  {String}             [title]       Room's Name
   *
   * @apiSuccess {String}  id         Room's id
   * @apiSuccess {String}  title      Room's Name
   * @apiSuccess {String}  location   Room's Location
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(), validate(listRoom), controller.list)
  /**
   * @api {post} v1/room Create Room
   * @apiDescription Create a new Room
   * @apiVersion 1.0.0
   * @apiName CreateRoom
   * @apiGroup Room
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam   {String}  title      Room's Name
   * @apiParam   {String}  location   Room's Location
   * 
   * @apiSuccess (Created 201) {String}  id         Room's id
   * @apiSuccess (Created 201) {String}  title      Room's Name
   * @apiSuccess (Created 201) {String}  location   Room's Location 
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
  .post(authorize(), validate(createRoom), controller.create);

  router
  .route('/:roomId')
  /**
   * @api {put} v1/room/:id Get room
   * @apiDescription Get the room and media details
   * @apiVersion 1.0.0
   * @apiName GetRoom
   * @apiGroup Room
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Admin's access token
   *
   * @apiSuccess {String}  id         Room's id
   * @apiSuccess {String}  title      Room's title
   * @apiSuccess {String}  location   Room's location
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated admin can access the data
   */
  .get(authorize(), controller.get)
  /**
   * @api {put} v1/room/:id Replace room
   * @apiDescription Replace the whole room document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceRoom
   * @apiGroup Room
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Admin's access token
   *
   * @apiParam  {String}             title     Room's title 
   * @apiParam  {String}             location  Room's location
   *
   * @apiSuccess {String}  id         Room's id
   * @apiSuccess {String}  title      Room's title
   * @apiSuccess {String}  location   Room's location
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated admin can access the data
   */
  .put(authorize(), validate(replaceRoom), controller.replace)
  /**
   * @api {patch} v1/room/:id Update room
   * @apiDescription Update some fields of a room document
   * @apiVersion 1.0.0
   * @apiName UpdateRoom
   * @apiGroup Room
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization  Admin's access token
   *
   * @apiParam  {String}             title     Room's title 
   * @apiParam  {String}             location  Room's location
   *
   * @apiSuccess {String}  id         Room's id
   * @apiSuccess {String}  title      Room's title
   * @apiSuccess {String}  location   Room's location
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated admin can modify the data
   */
  .patch(authorize(), validate(updateRoom), controller.update)
  /**
   * @api {delete} v1/room/:id Delete room
   * @apiDescription Delete a room
   * @apiVersion 1.0.0
   * @apiName DeleteRoom
   * @apiGroup Room
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
