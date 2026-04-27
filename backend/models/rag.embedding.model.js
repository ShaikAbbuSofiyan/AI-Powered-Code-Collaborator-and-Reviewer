import mongoose from "mongoose";

const embeddingSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },

    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
    },

    chunkText: String,

    embedding: [Number] // vector

});

export default mongoose.model("Embedding", embeddingSchema);