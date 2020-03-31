const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/display.controller');
const { authorize } = require('../../middlewares/auth');
const {
  listDisplay,
  createDisplay,
  replaceDisplay,
  updateDisplay,
  mediaDisplay
} = require('../../validations/display.validation');

const router = express.Router();

/**
 * Load user when API with mediaId route parameter is hit
 */
router.param('displayId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/display List display
   * @apiDescription Get a list of display
   * @apiVersion 1.0.0
   * @apiName ListDisplay
   * @apiGroup Display
   * @apiPermission public
   *
   *
   * @apiParam  {Number{1-}}         [page=1]      List page
   * @apiParam  {Number{1-100}}      [perPage=1]   Display 's per page
   * @apiParam  {String}             [title]       Display 's Name
   *
   * @apiSuccess {String}  id         Display 's id
   * @apiSuccess {String}  title      Display 's Name
   * @apiSuccess {String}  text       Display 's Scrolling Text
   * @apiSuccess {Array}   list       Display 's Media
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get( validate(listDisplay), controller.list)
  /**
   * @api {post} v1/display Create Display 
   * @apiDescription Create a new Display 
   * @apiVersion 1.0.0
   * @apiName CreateDisplay
   * @apiGroup Display
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam   {String}  title      Display 's Name
   * @apiParam   {String}  text       Display 's Scrolling Text
   * @apiParam   {Array}   list       Display 's Media
   * 
   * @apiSuccess (Created 201) {String}  id         Display 's id
   * @apiSuccess (Created 201) {String}  title      Display 's Name
   * @apiSuccess (Created 201) {String}  text       Display 's Scrolling Text
   * @apiSuccess (Created 201) {Array}   list       Display 's Media
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
  .post(authorize(), validate(createDisplay), controller.create);

  router
  .route('/:displayId')
  /**
   * @api {put} v1/display/:id Get display
   * @apiDescription Get the display and media details
   * @apiVersion 1.0.0
   * @apiName GetDisplay
   * @apiGroup Display
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Admin's access token
   *
   * @apiSuccess {String}  id         Display 's id
   * @apiSuccess {String}  title      Display 's title
   * @apiSuccess {String}  text       Display 's Scrolling Text
   * @apiSuccess {Array}   list       Display 's Media
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated admin can access the data
   */
  .get(authorize(), controller.get)
  /**
   * @api {put} v1/display/:id Replace display
   * @apiDescription Replace the whole display document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceDisplay
   * @apiGroup Display
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Admin's access token
   *
   * @apiParam   {String}  title     Display 's title 
   * @apiParam   {String}  text       Display 's Scrolling Text
   * @apiParam   {Array}   list       Display 's Media
   *
   * @apiSuccess {String}  id         Display 's id
   * @apiSuccess {String}  title      Display 's title
   * @apiSuccess {String}  text       Display 's Scrolling Text
   * @apiSuccess {Array}   list       Display 's Media
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated admin can access the data
   */
  .put(authorize(), validate(replaceDisplay), controller.replace)
  /**
   * @api {patch} v1/display/:id Update display
   * @apiDescription Update some fields of a display document
   * @apiVersion 1.0.0
   * @apiName UpdateDisplay
   * @apiGroup Display
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization  Admin's access token
   *
   * @apiParam  {String}  title      Display 's title 
   * @apiParam  {String}  text       Display 's Scrolling Text
   * @apiParam  {Array}   list       Display 's Media
   *
   * @apiSuccess {String}  id         Display 's id
   * @apiSuccess {String}  title      Display 's title
   * @apiSuccess {String}  text       Display 's Scrolling Text
   * @apiSuccess {Array}   list       Display 's Media
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated admin can modify the data
   */
  .patch(authorize(), validate(updateDisplay), controller.update)
  /**
   * @api {delete} v1/display/:id Delete display
   * @apiDescription Delete a display
   * @apiVersion 1.0.0
   * @apiName Deletedisplay
   * @apiGroup Display
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

  router
  .route('/:displayId/media')
  /**
   * @api {post} v1/display/:id/media Display Add media
   * @apiDescription Add media to display document
   * @apiVersion 1.0.0
   * @apiName AddMediaDisplay
   * @apiGroup Display
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Array}              list      Display's list
   *
   * @apiSuccess {String}  id         Display's id
   * @apiSuccess {String}  title      Display's title
   * @apiSuccess {String}  text       Display's text
   * @apiSuccess {Array}   list       Display's list
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   */
  .post(authorize(), validate(mediaDisplay), controller.addmedia)
  /**
   * @api {delete} v1/display/:id/media Display Delete media
   * @apiDescription Delete media to display document
   * @apiVersion 1.0.0
   * @apiName DeleteMediaDisplay
   * @apiGroup Display
   * @apiPermission authenticated
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Array}              list      Display's list
   *
   * @apiSuccess {String}  id         Display's id
   * @apiSuccess {String}  title      Display's title
   * @apiSuccess {String}  text       Display's text
   * @apiSuccess {Array}   list       Display's list
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   */
  .delete(authorize(), validate(mediaDisplay), controller.deletemedia);

module.exports = router;
