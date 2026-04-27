import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"]
    },
    content: String
});

const chatSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },

    messages: [messageSchema],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Chat", chatSchema);