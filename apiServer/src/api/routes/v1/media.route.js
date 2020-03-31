const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/media.controller');
const { authorize, ADMIN } = require('../../middlewares/auth');
const { upload, remove } = require('../../middlewares/file');
const {
  listMedia,
  createMedia,
  replaceMedia,
  updateMedia,
} = require('../../validations/media.validation');

const router = express.Router();

/**
 * Load user when API with mediaId route parameter is hit
 */
router.param('mediaId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/media List Media
   * @apiDescription Get a list of media
   * @apiVersion 1.0.0
   * @apiName ListMedia
   * @apiGroup Media
   *
   * @apiHeader {String} Authorization  Media's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=10]  Media per page
   * @apiParam  {String}             [title]      Media's title
   * @apiParam  {String}             [album]      Media's album
   * @apiParam  {String}             [artist]     Media's artist
   * @apiParam  {String}             [genre]      Media's genre
   * @apiParam  {Number}             [year]       Media's year
   *
   * @apiSuccess  {String}           title        Media's title
   * @apiSuccess  {String}           album        Media's title
   * @apiSuccess  {String}           artist       Media's artist
   * @apiSuccess  {String}           genre        Media's genre
   * @apiSuccess  {Number}           year         Media's year
   * @apiSuccess  {String}           thumbnail    Media's thumbnail
   * @apiSuccess  {String}           url          Media's url
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(), validate(listMedia), controller.list)
  /**
   * @api {post} v1/media Create Media
   * @apiDescription Create a new media
   * @apiVersion 1.0.0
   * @apiName CreateMedia
   * @apiGroup Media
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Media's access token
   *
   * @apiParam  {String}             title        Media's title
   * @apiParam  {String}             [album]      Media's title
   * @apiParam  {String}             [artist]     Media's artist
   * @apiParam  {String}             [genre]      Media's genre
   * @apiParam  {String}             [filename]   Media's filename
   * @apiParam  {Number}             [year]       Media's year
   *
   * @apiSuccess (Created 201) {String}  id         Media's id
   * @apiSuccess (Created 201) {String}  title      Media's title
   * @apiSuccess (Created 201) {String}  album      Media's album
   * @apiSuccess (Created 201) {String}  artist     Media's artist
   * @apiSuccess (Created 201) {String}  genre      Media's genre
   * @apiSuccess (Created 201) {Number}  year       Media's year
   * @apiSuccess (Created 201) {String}  thumbnail  Media's thumbnail
   * @apiSuccess (Created 201) {String}  url        Media's url
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createMedia), controller.create);

router
  .route('/:mediaId')
  /**
   * @api {get} v1/media Get Media
   * @apiDescription Get a details of media
   * @apiVersion 1.0.0
   * @apiName GetMedia
   * @apiGroup Media
   *
   * @apiHeader {String} Authorization  Media's access token
   *
   * @apiSuccess  {String}           title        Media's title
   * @apiSuccess  {String}           album        Media's title
   * @apiSuccess  {String}           artist       Media's artist
   * @apiSuccess  {String}           genre        Media's genre
   * @apiSuccess  {Number}           year         Media's year
   * @apiSuccess  {String}           thumbnail    Media's thumbnail
   * @apiSuccess  {String}           url          Media's url
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(), validate(listMedia), controller.get)
  /**
   * @api {put} v1/media/:id Replace Media
   * @apiDescription Replace the whole media document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceMedia
   * @apiGroup Media
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  Media's access token
   *
   * @apiParam  {String}             title       Media's email
   * @apiParam  {String}             album       Media's album
   * @apiParam  {String}             artist      Media's artist
   * @apiParam  {String}             genre       Media's genre
   * @apiParam  {Number}             year        Media's year
   * @apiParam  {String}             thumbnail   Media's thumbnail
   * @apiParam  {String}             filename    Media's filename
   *
   * @apiSuccess {String}  id         Media's id
   * @apiSuccess {String}  title      Media's title
   * @apiSuccess {String}  album      Media's album
   * @apiSuccess {String}  artist     Media's artist
   * @apiSuccess {String}  genre      Media's genre
   * @apiSuccess {Number}  year       Media's year
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only admin can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   */
  .put(authorize(ADMIN), validate(replaceMedia), controller.replace)
  /**
   * @api {patch} v1/media/:id Update Media
   * @apiDescription Update some fields of a user document
   * @apiVersion 1.0.0
   * @apiName UpdateMedia
   * @apiGroup Media
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}             title     Media's email
   * @apiParam  {String}             album     Media's album
   * @apiParam  {String}             artist    Media's artist
   * @apiParam  {String}             genre     Media's genre
   * @apiParam  {Number}             year      Media's year
   * (You must be an admin to change the user's role)
   *
   * @apiSuccess {String}  id         Media's id
   * @apiSuccess {String}  title      Media's title
   * @apiSuccess {String}  album      Media's album
   * @apiSuccess {String}  artist     Media's artist
   * @apiSuccess {String}  genre      Media's genre
   * @apiSuccess {Number}  year       Media's year
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only admin can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   */
  .patch(authorize(ADMIN), validate(updateMedia), controller.update)
  /**
   * @api {delete} v1/media/:id Delete Media
   * @apiDescription Delete a user
   * @apiVersion 1.0.0
   * @apiName DeleteMedia
   * @apiGroup Media
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only admin can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
   */
  .delete(authorize(ADMIN), remove, controller.remove);


router
  .route('/upload/:type')
  /**
   * @api {post} v1/media/:id Upload Media
   * @apiDescription Upload media (audio, thumbnail)
   * @apiVersion 1.0.0
   * @apiName UploadMedia
   * @apiGroup Media
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only admin can upload a file
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can upload a file
   */
  .post(authorize(ADMIN), upload);


module.exports = router;
