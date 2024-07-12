import cloudinary from 'cloudinary';
import sharp from 'sharp';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv'
import User from '../models/userModel.js';
import Blog from '../models/blogModel.js';

dotenv.config()

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.VITE_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const downloadImage = async (url) => {
    const response = await axios({
        url,
        responseType: 'arraybuffer'
    });
    return response.data;
};

const uploadToCloudinary = async (buffer, options) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(options, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.secure_url);
            }
        }).end(buffer);
    });
};

const generateThumbnails = async (imageUrl) => {
    const sizes = [
        { aspectRatio: '1:1', width: 200, height: 200 },
        { aspectRatio: '4:3', width: 400, height: 300 },
        { aspectRatio: '16:9', width: 800, height: 450 },
        { aspectRatio: '3:2', width: 300, height: 200 }
    ];

    const imageBuffer = await downloadImage(imageUrl);
    const thumbnails = [];

    for (const size of sizes) {
        const buffer = await sharp(imageBuffer)
            .resize(size.width, size.height)
            .composite([{
                input: Buffer.from(`
                    <svg width="${size.width}" height="${size.height}">
                        <text x="10" y="20" font-size="20" fill="white"></text>
                    </svg>`),
                gravity: 'southeast'
            }])
            .png()
            .toBuffer();

        const uploadOptions = { folder: 'thumbnails', public_id: uuidv4() };
        const thumbnailUrl = await uploadToCloudinary(buffer, uploadOptions);
        thumbnails.push(thumbnailUrl);
    }

    return thumbnails;
};

export const uploadImage = async (req, res) => {
    try {
        const { imagePath } = req.body;
        if(!imagePath){
            return res.status(400).json({ message: 'Upload the Image' }); 
        }

        const thumbnails = await generateThumbnails(imagePath);

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

      
        let blog = await Blog.findOne({ user: user._id });

        if (!blog) {
           
            blog = new Blog({
                user: user._id,
                images: []
            });
        }

        
        blog.images.push({
            originalImage: imagePath,
            thumbnails
        });

        await blog.save();

        res.status(201).json({ message: 'Image uploaded and thumbnails generated', thumbnails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllUploadedImages = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('user', 'firstname lastname');

        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: 'No images found' });
        }

        const uploadedImages = blogs.flatMap(blog => 
            blog.images.map(image => ({
                originalImage: image.originalImage,
                username: `${blog.user.firstname} ${blog.user.lastname}`
            }))
        );

        return res.status(200).json({ uploadedImages });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const getAllGeneratedImages = async (req, res) => {
    try {
        const { imageUrl } = req.params;

        const blogs = await Blog.find();

        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: 'No images found' });
        }

        let generatedThumbnails = null;

        for (const blog of blogs) {
            const image = blog.images.find(img => img.originalImage === imageUrl);
            if (image) {
                generatedThumbnails = image.thumbnails;
                break;
            }
        }

        if (!generatedThumbnails) {
            return res.status(404).json({ message: 'Thumbnails not found for the provided image URL' });
        }

        return res.status(200).json({ generatedThumbnails });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

