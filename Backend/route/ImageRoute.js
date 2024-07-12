import express from 'express'
import { getAllGeneratedImages, getAllUploadedImages, uploadImage } from '../controllers/ImageController.js'
import { protectRoute } from '../middileware/VerifyToken.js'
import { ValidateApiKey } from '../middileware/ValidateApiKey.js'

const router = express.Router()


router.post('/upload/:id',protectRoute,ValidateApiKey,uploadImage)
router.get('/getalluploadimages',protectRoute,getAllUploadedImages)
router.get('/getthumbnails/:imageUrl', protectRoute, getAllGeneratedImages);

export default router