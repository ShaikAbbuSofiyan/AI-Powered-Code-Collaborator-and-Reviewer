import express from 'express';
import { isOwner, isUserAuth } from '../middleware/auth.middleware.js';
import { createProject, deleteProject, getProjects } from '../controllers/project.controller.js';

const projectRouter = express.Router();

// api/project/create
projectRouter.post('/create', isUserAuth, createProject);
// api/project/projects
projectRouter.get('/projects',isUserAuth, getProjects);
// api/project/delete/:id
projectRouter.delete('/delete/:id', isUserAuth, isOwner,deleteProject)

export default projectRouter;