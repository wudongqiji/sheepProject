const httpStatus = require('http-status');
// const { omit } = require('lodash');
const Media = require('../models/media.model');
const { handler: errorHandler } = require('../middlewares/error');
const { uploadPath } = require('../../config/vars');

/**
 * Load media and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const media = await Media.get(id);
    req.locals = { media };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get media
 * @public
 */
exports.get = (req, res) => {
  const media = req.locals.media.transform();
  media.url = encodeURI(`${uploadPath}/audio/${media.filename}`);
  delete media.filename;
  if (media.thumbnail) {
    media.thumbnail = encodeURI(`${uploadPath}/picture/${media.thumbnail}`);
  } else {
    media.thumbnail = '';
  }
  res.json(media);
};

/**
 * Create new media
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const media = new Media(req.body);
    const savedMedia = await media.save();
    res.status(httpStatus.CREATED);
    res.json(savedMedia);
  } catch (error) {
    next(error);
  }
};

/**
 * Replace existing media
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { media } = req.locals;
    const newMedia = new Media(req.body);

    await media.update(newMedia, { override: true, upsert: true });
    const savedMedia = await Media.findById(media._id);

    res.json(savedMedia.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing media
 * @public
 */
exports.update = (req, res, next) => {
  const updatedMedia = req.body;
  const media = Object.assign(req.locals.media, updatedMedia);

  media.save()
    .then(savedMedia => res.json(savedMedia))
    .catch(e => next(e));
};

/**
 * Get media list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    let mediaCollection = await Media.list(req.query);
    let results = [];
    let page;
    let perPage;
    if (req.query.page) {
      page = parseInt(req.query.page, 10);
    }
    if (req.query.perPage) {
      perPage = parseInt(req.query.perPage, 10);
    }
    if (mediaCollection[0] !== undefined) {
      if (mediaCollection[0].results.length > 0) {
        results = mediaCollection[0].results.map((media) => {
          const newData = JSON.parse(JSON.stringify(media));
          newData.url = encodeURI(`${uploadPath}/audio/${media.filename}`);
          delete newData.filename;
          if (media.thumbnail) {
            newData.thumbnail = encodeURI(`${uploadPath}/picture/${media.thumbnail}`);
          } else {
            newData.thumbnail = '';
          }
          return newData;
        });
      }

      mediaCollection[0].results = results;
      mediaCollection[0].page = page;
      mediaCollection[0].perPage = perPage;
    } else {
      mediaCollection = [];
      mediaCollection[0] = {
        results: [],
      };
    }

    res.json(mediaCollection[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete media
 * @public
 */
exports.remove = (req, res, next) => {
  const { media } = req.locals;

  media.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
