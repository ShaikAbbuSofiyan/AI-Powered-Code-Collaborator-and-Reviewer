import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },

    fileName: String,
    content: String, // code stored as text
    language: String,

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // can be owner or contributor
    },

    lastEditedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // can be owner or contributor
    },

    version: {
        type: Number,
        default: 1
    },
}, {timestamps: true});

export default mongoose.model("File", fileSchema);