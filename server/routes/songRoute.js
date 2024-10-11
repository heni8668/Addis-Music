const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const songController = require('../controllers/songController');

//
const uploadFolderPath = path.join(__dirname, '../uploads');

//check if folder exists otherwise create
 if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath);
}

const fileFilter = (req, file, cb) => {
    console.log('Uploaded file:', file.originalname, 'Fieldname:', file.fieldname); // Debugging log

    if (file.fieldname === 'file') {
        // Check the file extension for song
        if (file.originalname.match(/\.(mp3|mp4)$/i)) {
            cb(null, true);
        } else {
            cb(new Error('Only MP3 and MP4 files are allowed!'));
        }
    } else if (file.fieldname === 'coverImage') {
        // Check the file extension for cover image
        if (file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPG, JPEG, and PNG files are allowed!'));
        }
    } else {
        // Ignore other file extensions
        cb(null, false);
    }
};


const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadFolderPath);
        },
        filename: function (req, file, cb) {
            // cb(null, Date.now() + '-' + file.originalname);
            cb(null, file.originalname);
        }
    }),
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 10 } // 10MB

});

// create song routes
router.route('/')
    .get(songController.getAllSongs)
    .post(upload.fields([{name: 'file', maxCount: 1}, {name: 'coverImage', maxCount: 1}]), songController.addSong)
    

    // delete route
    router
      .route("/:id")
      .put(
        upload.fields([
          { name: "file", maxCount: 1 },
          { name: "coverImage", maxCount: 1 },
        ]),
        songController.updateSong
      )
      .delete(songController.deleteSong);

    module.exports = router;