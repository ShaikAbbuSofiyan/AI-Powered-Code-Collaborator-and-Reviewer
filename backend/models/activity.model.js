import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },

    action: {
        type: String
        // e.g., "created_file", "updated_task"
    },

    metadata: Object,
    
}, {timestamps: true});

export default mongoose.model("Activity", activitySchema);