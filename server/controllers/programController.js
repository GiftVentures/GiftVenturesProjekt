const cloudinary = require('cloudinary');
const Program = require('../models/programModel')
const User = require('../models/userModel')
const Themes = '../server/models/themes.json'
const fs = require('fs').promises;

cloudinary.v2.config({
  cloud_name: 'dqd9anzyv',
  api_key: '222231436833177',
  api_secret: 'MPMOkw2k7DEq7Ujn_ca5rpHcBaE',
  secure: true,
});

const uploadImage = async (req, res) => {
  // Access the uploaded file using req.file
  const imageBuffer = req.file.buffer.toString('base64');

  // Your existing code
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${imageBuffer}`, options);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Belső szerverhiba' });
  }
};

const getAllThemes = async (req, res) => {
  try {
    const themesData = await fs.readFile(Themes, 'utf-8');
    const themes = JSON.parse(themesData).themes;
    res.status(200).json(themes);
  } catch (error) {
    console.error('Hiba a témák lekérdezésekor:', error);
    res.status(500).json({ error: 'Belső szerverhiba' });
  }
};


const AddProgram = async (req, res) => {
    const { name, description, img, price, persons, location, theme, date } = req.body;
    const userId = req.user._id;
    try {
      const user = await User.findById(userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json("Ez a művelet csak admin felhaználónak engedélyezett!");
      }
      

      const program = await Program.add(name, description, img, price, persons, location, theme, date);
      if (program){
        res.status(201).json("Program sikeresen felvéve");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json("Belső szerverhiba történt");
    }
  };

  const DeleteProgram = async (req, res) => {
    const programId = req.params.id;
    console.log("Received programId:", programId);
    try {
      const user = await User.findById(req.user._id);
      if (!user || !user.isAdmin) {
        return res.status(403).json("Ez a művelet csak admin felhaználónak engedélyezett!");
      }
      const deletedProgram = await Program.delete(programId);
      if (!deletedProgram) {
        return res.status(404).json("A program nem található");
      }
      res.status(200).json("Sikeres törlés");
    } catch (error) {
      console.error(error);
      res.status(500).json("Belső szerverhiba történt");
    }
  };

  const getAllPrograms = async (req, res) => {
    try {
      const programs = await Program.find();
      res.status(200).json(programs);
    } catch (error) {
      console.error('Error fetching programs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  const getOneProgram = async (req, res) => {
    const programId = req.params.programId;
    try {
      const program = await Program.findById(programId);
      if (!program) {
        return res.status(404).json("A program nem található");
      }
      res.status(200).json(program);
    } catch (error) {
      console.error(error);
      res.status(500).json("Belső szerverhiba történt");
    }
  };
  
  module.exports = { AddProgram, DeleteProgram, getAllThemes, uploadImage, getAllPrograms, getOneProgram };
