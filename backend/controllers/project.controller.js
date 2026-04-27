import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";

export const createProject = async (req, res) => {
  try {
    let { title, description, visibility } = req.body;
    let owner = req.userId;
    if (!owner) {
      return res.status(404).json({
        message: "Invalid user",
      });
    }
    if (!description) {
      description = `${title}`;
    }
    const project = await projectModel.create({
      title,
      owner,
      description,
      visibility,
    });
    res.status(200).json({
      project,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Create Project error: ${error}`,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await projectModel.find({ owner: req.userId });
    res.status(200).json({ projects });
  } catch (error) {
    return res.status(500).json({
      message: `Get Projects error: ${error}`,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await projectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    const deletedProject = await projectModel.deleteOne({ _id: projectId });
    res.status(200).json({
      message: "project deleted successfully",
      deleteProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Delete Project error: ${error}`,
    });
  }
};
