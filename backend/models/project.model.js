import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["owner", "contributor", "viewer"],
          default: "contributor",
        },
      },
    ],
    
    files: [
      {
        file: {
          type: String,
          ref: 'File'
        }
      }
    ],

    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "private"
    },
  },
  { timestamps: true },
);

export default mongoose.model("Project", projectSchema);
