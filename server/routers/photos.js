const express = require('express');
const multer = require('multer');
const Photo = require('../model/Photo');
const Router = express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000, //max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
  	if (!file.originalname.match(/\.(jpeg|jpg)$/)) {
  	  cb(new Error('only upload files with jpg or jpeg format.'));
  	}
  	cb(undefined, true); // continue with the upload
  }
});

Router.post('/photos', upload.single('photo'), async (req, res) => {
    try {
      const photo = new Photo(req.body);
      const file = req.file.buffer;
      photo.photo = file;

      await photo.save();
      res.status(201).send({ _id: photo._id });
    } catch (err) {
      res.status(500).send({
        upload_error: 'Error while uploading file..',
      });
    }
  }, (err, req, res, next) => {
  	if (err) {
  	  res.status(500).send({
  	    upload_error: err.message,
  	  });
  	}
});

Router.get('/photos', async (req, res) => {
  try {
    console.log('sup');
    const photos = await Photo.find();
    //res.set('Content-Type', 'image/jpeg');
    res.send(photos);
  } catch (err) {
    res.status(500).send({ get_error: err.message });
  }
});

Router.get('/photos/:id', async (req, res) => {
  try {
    const result = await Photo.findById(req.params.id);
    res.set('Content-Type', 'image/jpeg');
    res.send(result.photo);
  } catch (error) {
    res.status(400).send({ get_error: 'Error while getting photo' });
  }
});

module.exports = Router;