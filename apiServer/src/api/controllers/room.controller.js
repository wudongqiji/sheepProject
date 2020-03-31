const httpStatus = require('http-status');
// const { omit } = require('lodash');
const Room = require('../models/room.model');
//const Media = require('../models/media.model');
const { handler: errorHandler } = require('../middlewares/error');
const { uploadPath } = require('../../config/vars');

/**
 * Load room and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const room = await Room.get(id);
    req.locals = { room };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get room
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const room = req.locals.room.transform();
    res.json(room);
  } catch (error) {
    next(error);
  }
};
// res.json(req.locals.room.transform());


/**
 * Create new room
 * @public
 */
exports.create = async (req, res, next) => {
  try {
   // req.body.userId = req.user.email;
    const room = new Room(req.body);
    const savedroom = await room.save();
    res.status(httpStatus.CREATED);
    res.json(savedroom);
  } catch (error) {
    next(error);
  }
};

/**
 * Get room list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
      let room = await Room.list(req.query);
      if (room.length === 0) {
        room = [
          {
            total: 0,
            results: [],
          },
        ];
      }
      room[0].page = req.query.page;
      room[0].perPage = req.query.perPage;
      const results = room[0];
  
      res.json(results);
    } catch (error) {
      next(error);
    }
};

/**
 * Replace existing room PATCH
 * @public
 */
exports.replace = async (req, res, next) => {
    try {
      const { room } = req.locals;
      const newRoom = new Room(req.body);
  
      await room.update(newRoom, { override: true, upsert: true });
      const savedRoom = await Room.findById(room._id);
  
      res.json(savedRoom.transform());
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Update existing room PUT
   * @public
   */
  exports.update = (req, res, next) => {
    const updatedRoom = req.body;
    const room = Object.assign(req.locals.room, updatedRoom);
  
    room.save()
      .then(savedRoom => res.json(savedRoom))
      .catch(e => next(e));
  };

  /**
 * Delete room
 * @public
 */
exports.remove = (req, res, next) => {
    const { room } = req.locals;
    room.remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch(e => next(e));
  };