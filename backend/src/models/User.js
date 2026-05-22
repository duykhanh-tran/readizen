import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
    },
    avatarId: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    phone: {
        type: String,
        sparse: true,
    }
},
    {
        timestamps: true,
    });

const User = mongoose.model("User", userSchema);
export default User;