const Project = require('../models/Project');
const User = require('../models/User');

exports.getProjects = async (req, res) => {
    const user = req.user.id; 
    try {
        const projects = await Project.find({ userId: user })
            .select('_id projectname createddate updatedAt'); 
        // console.log(projects);
        res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.postProjects = async (req, res) => {
    const { projectname, clientname, clientaddress, clientcontact } = req.body;

    if (!projectname || !clientname || !clientaddress || !clientcontact) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = req.user.id; 

    try {
        const newProject = new Project({
            projectname,
            clientname,
            clientaddress,
            clientcontact,
            userId: user
        });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.updateProject = async (req, res) => {
    const { projectId, projectname, clientname, clientaddress, clientcontact } = req.body;

    // Validate fields
    if (!projectId || !projectname || !clientname || !clientaddress || !clientcontact) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if the user is the owner of the project
        if (project.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to edit this project' });
        }

        // Update project details
        project.projectname = projectname;
        project.clientname = clientname;
        project.clientaddress = clientaddress;
        project.clientcontact = clientcontact;

        await project.save();
        res.status(200).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProject = async (req, res) => {
    const { projectId } = req.body;

    if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required' });
    }

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Delete the project
        await Project.findByIdAndDelete(projectId);

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSubworks = async (req, res) => {
    try {
      // Find the project by its ID
      const project = await Project.findById(req.params.pid);
      if (!project) {
        return res.status(404).json({ msg: 'Project not found' });
      }
  
      // Return the works section of the project
    //   console.log(project);
      res.json(project.works);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  
exports.updateSubworks = async (req, res) => {
    const { dimensions } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send('Project not found');

    // Update the project's dimensions in each category (e.g., foundation)
    project.works.foundation.earthwork = dimensions['1-Earthwork'];
    project.works.foundation.bedconcrete = dimensions['1-Bed Concrete'];
    // ...other updates

    await project.save();
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating project data');
  }
};

exports.updatePerticularSubwork = async (req, res) => {
    const projectId = req.params.pid;
    const { groupedData } = req.body;  // Destructure groupedData
  
   // console.log(groupedData); // To check the groupedData structure
  
    try {
      // Directly update only the "foundation" part of the project
      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId }, 
        { 
          $set: { "works.foundation": groupedData.foundation }, 
        },
        { new: true } 
      );
   
      if (!updatedProject) {
        return res.status(404).send('Project not found');
      }
  
      res.json(updatedProject);  
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating project data');
    }
  };
  