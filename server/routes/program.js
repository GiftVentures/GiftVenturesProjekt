const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {AddProgram, DeleteProgram,  getAllThemes, uploadImage, getAllPrograms, getOneProgram, UpdateProgram} = require('../controllers/programController')

router.get("/get", getAllPrograms )
router.get("/theme", getAllThemes)
router.get("/getProgram/:programId", getOneProgram)

router.use(requireAuth)

router.post("/add", AddProgram)
router.post("/update/:programId", UpdateProgram)
router.delete("/delete/:id", DeleteProgram)


router.post("/img/upload", upload.single('image'), uploadImage)

module.exports = router
