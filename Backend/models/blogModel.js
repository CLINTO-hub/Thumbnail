import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    images: [
        {
            originalImage: { 
                type: String, 
                required: true 
            },
            thumbnails: [
                {
                    type: String,
                }
            ]
        }
    ],
}, { timestamps: true });

export default mongoose.model("Blog", blogSchema);
