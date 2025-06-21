import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponce } from "../utils/api-responce.js";
import { Project } from "../models/project.models.js";
import { User } from "../models/user.models.js";
import { ProjectMember } from "../models/projectMember.models.js";
import { UserRoleEnum , AvialableUserRoles  } from "../utils/constant.js";




  const createProject = asyncHandler(async (req, res) => {
    
    const {name , description}=  req.body;

    if(!name){
      res.status(400).json(new ApiError (400 , "Project name is mandetory"))
    }

    const isExistProject = await Project.findOne({name});

    if(isExistProject){
      res.status(400).json(new ApiError (400 , "Project with this name already exists"))
    }

    const project = await Project.create({
      name,
      description,
      createdBY : req.user._id 
    })

    await ProjectMember.create({
     user:req.user._id ,
     project:project._id,
     role:"project_admin"
    })

    console.log(project)
    res.status(200).json( new ApiResponce(200 , " project has been created successfully"))

  });


  const getProjects = asyncHandler(async (req, res) => {
    // get all projects
    const {name} = req.body

    if(!name){
      res.status(400).json(new ApiError (400 , "name is required"))

    }

    const project = await Project.findOne({name}).populate("createdBY" , "username email" )

    if(!project){
      res.status(400).json(new ApiError (400 , "project not found"))
    }

    console.log(project)

    res
    .status(200)
    .json(new ApiResponce(200 , project , "success"))
  });

  
  const updateProject = asyncHandler(async (req, res) => {

    // fetch project id from params
    //find project
    //check if the corrent user is the authentic user of the project
    //if yes then allow the updation

  
    const {project_id} = req.params

    const{name , description} = req.body

    if(!project_id){
      res.status(404).json(404 , "project_id required")
    }


    if(!name || !description){
      res.status(404).json(new ApiError(404 , "name or description field is missing"))
    }

    const project = await Project.findById(project_id)

    if(!project){
      return res.status(404).json(new ApiError(404 , "project not found"))
    }

    const member = await ProjectMember.findOne({
      user:req.user._id,
      project:project_id
    })

    if(!member || member.role !== "project_admin"){
      return res.status(400).josn(new ApiError(400 , "you are not authorised to update the project"))
    }

    project.name = name;
    project.description = description;

    await Project.save()

    res
    .status(200)
    .json(new ApiResponce(200 , project , "project updated successfully"))
    
  });

 
  const getProjectById = async (req, res) => {
    // get project by id
  };
  
  
  const deleteProject = asyncHandler(async (req, res) => {
    // delete project
    const {project_id} = req.params

    if(!project_id){
      res.status(404).json(new ApiError(404 , "project_id required"))
    }

    const member= await ProjectMember.findOne({
      user:req.user._id , 
      project:project_id
    })

    if(!member || member.role !== "project_admin"){
      return res.status(400).json(new ApiError(400 , "you are not authorised to delete the project"))
    }

    const DeletedProject = await Project.findByIdAndDelete(project_id)
    
    if(!DeletedProject){
      res.status(404).json(new ApiError(404 , "project not found"))
    }

    res.status(200).json(new ApiResponce(200 , deleteProject, "project deleted successfully"))

  });
  
  const getProjectMembers = async (req, res) => {

    
  };
  
  const addMemberToProject = async (req, res) => {
    // add member to project

    const {role , project_id , user_id}= req.body

    if(!AvialableUserRoles.includes(role)){
      return res.status(400).json( new ApiError(400 , "role  is missing"))
    }

    if(!project_id || !user_id ){
      return res.status(400).json( new ApiError(400 , "role , project_id , user_id  among something is missing"))
    }

    if(role !== UserRoleEnum.MEMBER){
      return res.status(400).json(new ApiError(400 , "Only member can be added this way"))
    }
  
    const Admin = await ProjectMember.findOne({
      user:req.user._id ,
      project:project_id
    })

    if(!Admin || Admin.role !== UserRoleEnum.PROJECT_ADMIN){
      return res.status(400).json(new ApiError(400 , "you are not authorised to add members in  the project"))
    }

    const project= await Project.findById(project_id)
    if(!project ){
      return res.status(400).json( new ApiError(400 , "project not found"))
    }
  
    const Existing_Member = await ProjectMember.findOne({
      user:user_id,
      project:project_id
    })

    if(Existing_Member){
      return res.status(400).json(new ApiError(400 , "user already existed"))
    }

    const New_member = await ProjectMember.create({
      user:user_id,
      project:project_id,
      role
    })

    
    res.status(201).json(new ApiResponce(201 , New_member , "New member add successfully") )


  };
  
  
  const deleteMember = async (req, res) => {
    // delete member from project
  };
  
  const updateMemberRole = async (req, res) => {
    // update member role
    const {project_id , user_id} = req.body;

    if(!project_id){
      return res.status(400).json(new ApiError(400 , " project_id required"))
    }

    const Admin = await ProjectMember.findOne({
      user:req.user._id,
      project:project_id
    })

    if(!Admin || Admin.role !== UserRoleEnum.PROJECT_ADMIN){
      return res.status(400).json(new ApiError(400 , "you are not authorised to access further"))
    }

    const member = await ProjectMember.findOne({
      user: user_id ,
      project:project_id
    })

    if(!member){
      return res.status(400).json( new ApiError(400 , "this user is not member of this project"))
    }

    if(member.role === UserRoleEnum.MEMBER){
      member.role = UserRoleEnum.PROJECT_ADMIN;
      Admin.role = UserRoleEnum.MEMBER
    } else {
      return res.status(404).json(new ApiResponce(400 , "member is already admin"))
    }

    const updated_member = await member.save()
    await Admin.save()

    res.status(200).json(new ApiResponce(200 , updated_member , "role of member updated successfully" ))

  };
  
  
  export {
    addMemberToProject,
    createProject,
    deleteMember,
    deleteProject,
    getProjectById,
    getProjectMembers,
    getProjects,
    updateMemberRole,
    updateProject,
  };
  