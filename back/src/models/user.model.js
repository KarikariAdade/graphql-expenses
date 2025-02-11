import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ["Male", "Female"]
    },
}, { timestamps: true})

export const User = mongoose.model("User", userSchema);