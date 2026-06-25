import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: null,
    },

    fileName: {
      type: String,
      required: true,
    },

    isFolder: {
      type: Boolean,
      default: false,
    },

    extension: {
      type: String,
    },

    language: {
      type: String,
      enum: ["javascript", "typescript", "python", "java", "cpp"],
    },

    content: {
      type: String,
      default: "",
    },


    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    version: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

export default mongoose.model("File", fileSchema);
