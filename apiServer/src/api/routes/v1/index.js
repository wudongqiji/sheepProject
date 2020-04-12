const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const scheduleRoutes = require('./schedule.route');
const roomRoutes = require('./room.route');
const displayRoutes = require('./display.route');
const mediaRoutes = require('./media.route');
const companyRoutes = require('./company.route');
const deviceRoutes = require('./device.route');
const branchRoutes = require('./branch.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/schedule', scheduleRoutes);
router.use('/room', roomRoutes);
router.use('/display', displayRoutes);
router.use('/media', mediaRoutes);
router.use('/company', companyRoutes);
router.use('/device', deviceRoutes);
router.use('/branch', branchRoutes);

module.exports = router;
