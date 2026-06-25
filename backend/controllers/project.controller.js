  import fileModel from "../models/file.model.js";
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

  export const addCollaborator = async (req, res) => {
    try {
      const projectId = req.params.id;
      const { email } = req.body;
      const project = await projectModel.findById(projectId);
      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      if (project.members.includes(user._id)) {
        return res.status(400).json({
          message: "User is already a collaborator",
        });
      }
      project.members.push({user: user._id});
      await project.save();
      res.status(200).json({
        project,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Add Collaborator error: ${error}`,
      });
    }
  };

  export const updateProject = async (req, res) => {
    try {
      
      const projectId = req.params.id;
      const { title, description, visibility } = req.body;
      const project = await projectModel.findById(projectId);
      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }
      project.title = title || project.title;
      project.description = description || project.description;
      project.visibility = visibility || project.visibility;
      await project.save();
      res.status(200).json({
        project,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Update Project error: ${error}`,
      });
    }
  }

  function buildTree(files, parent = null){
    return files.filter(file => String(file.parent) === String(parent)).map(
      file => ({
        _id:file._id,
        name: file.fileName,
        isFolder:file.isFolder,
        ext: file.extension,
        content: file.content,
        children: buildTree(files, file._id)
      })
    )
  }

  export const getProject = async (req, res) =>{
    try {
      const projectId = req.params.id;
      const project = await projectModel.findById(projectId);
      if(!project){
        return res.status(404).json({
          message: "project not found"
        });
      }
      const files = await fileModel.find({project:projectId});
      const tree = buildTree(files);



      res.status(200).json({project, tree});
    } catch (error) {
      return res.status(500).json({
        message:`Get Project errro:${error}`
      });
    }
  }

  export const addFile = async (req, res) => {
    try {
      const {project,fileName, content} = req.body;
      if(!fileName){
        return res.status(400).json({
          message: "file name is required"
        })
      }
      
      const  f = await fileModel.create({
        fileName,
        content,
        project:project,
        createdBy:req.userId
      });
      let p = await projectModel.findById(project || req.project);
      p.files.push(f._id);
      p.save();
      return res.status(201).json(f);

    } catch (error) {
      return res.status(500).json({
        message: `Add Files error ${error}`
      })
    }
  }

  export const getFilesNames = async(req, res)=>{
    try {
      const projectId = req.params.id;
      const project = await projectModel.findById(projectId);
      if(!project){
        return res.status(504).json({
          message:"No such of project is available"
        })
      }
      const files = project.files;
      
      let retrievedFileNames = files.map(async (fileId)=>{
        const file = await fileModel.findById(fileId);
        return file.fileName;
      })
    } catch (error) {
      return res.status(500).json({
        message: `getFiles error ${error}`
      })
    }
  }