import asyncHandler from "express-async-handler";
import Task from "../models/task.model.js";
import ApiError from "../utils/apiError.js";

// @desc    Create new task
// @route   POST /todos
export const createTask = asyncHandler(async (req, res,next) => {
    const { title, desc, priority, dueDate } = req.body;
    const userId = req.user.userId;

    // check task duplicated 
    const taskDuplicated=await Task.findOne({title,desc})
    if(taskDuplicated){
      return next(new ApiError('task duplicated , please change title or desc',409))
    }
  
    const image = req.file
      ? req.file.path
      : null;
  
    if (!image) return next(new ApiError('Image is required'))
    const task = await Task.create({
      image,
      title,
      desc,
      priority,
      dueDate,
      user: userId,
    });
  
    res.status(201).json({ message: 'task created sucessfully' });
  });

// @desc    Get all tasks
// @route   GET /todos
export const getUserTasks = asyncHandler(async (req, res,next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const tasks = await Task.find({ user: req.user.userId }).sort({ dueDate: 1 }).skip(skip).limit(limit);
  if(!tasks){return next(new ApiError("no tasks yet", 404)) }
  res.status(200).json({ data: tasks });
});

// @desc    Get single task
// @route   GET /todos/:id
export const getTask = asyncHandler(async (req, res,next) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.userId }).select('-__v -updatedAt -createdAt -user -_id');
  if (!task) return next(new ApiError("Task not found", 404)) 
  res.status(200).json({ data: task });
});

// @desc    Update task
// @route   PUT /todos/:id
export const updateTask = asyncHandler(async (req, res,next) => {
  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updated) return next (new ApiError("Task not found", 404));
  res.status(200).json({ message: 'task updated sucessfully' });
});

// @desc    Delete task
// @route   DELETE /todos/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const deleted = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId,
  });
  if (!deleted) return next (new ApiError("Task not found", 404));
  res.status(200).json({ message: "task deleted successfully" });
});