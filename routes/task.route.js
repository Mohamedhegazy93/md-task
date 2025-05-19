import express from "express";
import {
  createTask,
  getUserTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js"; 
import { upload } from "../config/multer.js";
import {createTaskValidator,updateTaskValidator} from '../utils/validators/task.validator.js'


const router = express.Router();
router.use(protectedRoute);


router.route("/")
.post(upload.single("image"),createTaskValidator,createTask)
.get(getUserTasks);

router.route("/:id")
.get(getTask)
.put(updateTaskValidator,updateTask)
.delete(deleteTask);

export default router;