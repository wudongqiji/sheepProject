const fs = require('fs');
const upload = require('jquery-file-upload-middleware');

exports.upload = (req, res, next) => {
  upload.fileHandler({
    uploadDir() {
      return `${__dirname}/../../public/uploads/${req.params.type}`;
    },
    uploadUrl() {
      return `/v1/media/upload/${req.params.type}`;
    },
  })(req, res, next);
};

exports.remove = (req, res, next) => {
  try {
    const { media } = req.locals;
    if (media.filename) {
      fs.unlinkSync(`${__dirname}/../../public/uploads/audio/${media.filename}`);
    }
    if (media.thumbnail) {
      fs.unlinkSync(`${__dirname}/../../public/uploads/picture/${media.thumbnail}`);
    }
    next();
  } catch (err) {
    console.log(err);
  }
};
