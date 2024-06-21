import  mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
    type:String,
    required:true,
    unique:true,
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    photo: { 
        type: String, 
        required:true,
    },
    apiKey: { 
        type: String, 
        unique: true, 
    },
    gender:{
        type:String,
        required:true,
    },
    uploadimg:[{
        type:String,
    }],
    geneatedThumbnail:[{
        type:String
    }]
    
})


export default mongoose.model("User",userSchema);