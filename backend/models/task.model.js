import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },

    title: {
        type: String,
        required: true
    },

    description: String,

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    status: {
        type: String,
        enum: ["todo", "in-progress", "completed"],
        default: "todo"
    },

    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },

    dueDate: Date,
}, {timestamps: true});

export default mongoose.model("Task", taskSchema);