import express from 'express';
import { isOwner, isUserAuth } from '../middleware/auth.middleware.js';
import { addCollaborator, createProject, deleteProject, getProject, getProjects,updateProject } from '../controllers/project.controller.js';

const projectRouter = express.Router();

// api/projects/
projectRouter.post('/', isUserAuth, createProject);
// api/projects/
projectRouter.get('/',isUserAuth, getProjects);
// api/projects/delete/:id
projectRouter.delete('/:id', isUserAuth, isOwner,deleteProject);
// api/projects/:id/add-collaborator
projectRouter.post('/:id/add-collaborator', isUserAuth, isOwner, addCollaborator);

//api;/projects/update
projectRouter.put('/:id', isUserAuth, isOwner, updateProject);
projectRouter.get('/:id', isUserAuth, isOwner, getProject);

export default projectRouter;