import fileModel from "../models/file.model.js";
import projectModel from "../models/project.model.js";

export async function updateFiles(req, res)
{
    try {
        
        const projectId = req.params.id;
        const {dirtyFiles} = req.body;
    
        const project = await projectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }
    
        const modifiedFiles = await fileModel.bulkWrite(
            dirtyFiles.map(file => ({
                updateOne:{
                    filter:{_id:file._id},
                    update:{
                        $set:{
                            content: file.content,
                            lastEditedBy: req.userId,
                        },
                        $inc:{
                            version:1
                        }
                    }
                }
            }))
        )
        return res.status(200).json({
            message: "Project saved successfully",
            modifiedFiles
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }

}