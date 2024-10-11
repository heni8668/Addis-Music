const mongoose = require('mongoose');
const Song = require('../models/Song')
const fs = require("fs");


const cloudinary = require('cloudinary').v2

//configure cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});


//add song
const addSong = async (req, res, ) => {
    try {
        const {title, artist, album, genre} = req.body;
        const files = req.files;

        //check the required fields
        if (!files || !files["file"] || !files["coverImage"] || !title || !artist || !album || !genre) {
          return res.status(400).json({ message: "All fields are required" });
        }

        const file = files["file"][0];
        const coverImage = files["coverImage"][0];

        // updater variable
        let songFileResult;
        let coverImageResult;

        //upload cover image to cloudinary
        coverImageResult = await new Promise(( resolve, reject ) => {
            cloudinary.uploader.upload(coverImage.path, {folder: 'coverImage', timeout: 60000}, (err, result) => {
                if(err) {
                    reject(new Error('Failed to upload cover image to cloudinary'))
                } else {
                    resolve(result)
                }
            });
        });


        //upload song file to cloudinary
        songFileResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(file.path, {folder: 'songFile', timeout: 60000, resource_type: 'video'}, (err, result) => {
                if(err) {
                    reject(new Error('Failed to upload song file to cloudinary'))
                } else {
                    resolve(result)
                }
            });
        });


        //save the song and the cover image to the database
        const newSong = await Song.create({
            title,
            artist,
            album,
            genre,
            coverImage: {
                public_id: coverImageResult.public_id,
                secure_url: coverImageResult.secure_url,
            },
            file: {
                public_id: songFileResult.public_id,
                secure_url: songFileResult.secure_url,
            },
        });

        // delete the local upload files
        fs.unlink(file.path, (error) => {
          if (error) {
            console.error(`Error deleting file ${file.path}:`, error);
          } else {
            console.log(`Successfully deleted file ${file.path}`);
          }
        });

        fs.unlink(coverImage.path, (error) => {
            if (error) {
                console.error(`Error deleting file ${coverImage.path}:`, error);
            } else {
                console.log(`Successfully deleted coverImage from ${coverImage.path}`);
                
            }
        });

        res.status(201).json({ message: 'Song Uploaded Successfully'});

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error uploading the song" });
    }
}


//get all songs
const getAllSongs = async (req, res, ) => {
    try {
        const songs = await Song.find({})
        res.json(songs)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


//update song by id
const updateSong = async (req, res) => {
    try {
        const { id } = req.params;
        const files = req.files;

        const music = await Song.findOne({ _id: id }).exec();

        if(!music) {
            return res.status(404).json({ message: `Song not found that match id ${id}` });
        }

        if(files) {
            const file = req.files['file'] ? req.files['file'][0] : null;
            const coverImage = req.files['coverImage'] ? req.files['coverImage'][0] : null;

            if(coverImage) {
                // upload cover image to clodinary
                const coverImageResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload(coverImage.path, {folder: 'coverImage', timeout: 60000}, (err, result) => {
                        if(err) {
                            reject(new Error('Failed to upload cover image to cloudinary'))
                        } else {
                            resolve(result)
                        }
                    });
                });

                await cloudinary.uploader.destroy(music.coverImage.public_id);

                music.coverImage = {
                    public_id: coverImageResult.public_id,
                    secure_url: coverImageResult.secure_url,
                };
            }

            if(file) {
                // upload song file to clodinary
                const songFileResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload(file.path, {folder:'songFile', timeout: 60000, resource_type: 'video'}, (err, result) => {
                        if(err) {
                            reject(new Error('Failed to upload song file to cloudinary'))
                        } else {
                            resolve(result)
                        }
                    });
                });

                await cloudinary.uploader.destroy(music.file.public_id);
                //update song by new song
                music.file = {
                    public_id: songFileResult.public_id,
                    secure_url: songFileResult.secure_url,
                };
            }

            // delete the uploaded local file
            if(file) {
                fs.unlink(file.path, (error) => {
                    if (error) {
                        console.error(`Error deleting file ${file.path}:`, error);
                    }
                });
            }

            if(coverImage) {
                fs.unlink(coverImage.path, (error) => {
                    if (error) {
                        console.error(`Error deleting file ${coverImage.path}:`, error);
                    }
                });
            }
        }

        if(req.body?.title) music.title = req.body.title
        if(req.body?.artist) music.artist = req.body.artist
        if(req.body?.album) music.album = req.body.album
        if(req.body?.genre) music.genre = req.body.genre

        const updatedSong = await music.save();

        res.status(201).json(updatedSong);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error updating the song" });
        
    }
}

// delete song by id

const deleteSong = async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid song ID" });
      }

      const music = await Song.findOneAndDelete({ _id: id }).exec();

      if (!music) {
        return res
          .status(404)
          .json({ message: `Song not found that match id ${id}` });
      }

      // delete the song from cloudinary
      await cloudinary.uploader.destroy(music.coverImage.public_id);
      await cloudinary.uploader.destroy(music.file.public_id);

      res.status(200).json();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error deleting the song" });
    }
}

module.exports = {addSong, getAllSongs, updateSong, deleteSong}