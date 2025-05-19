import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
    },
    desc: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [5, "Description must be at least 5 characters"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    status:{
      type: String,
      enum: ["inprogress", "waiting", "finshed"],
      required:false
  

    },
    dueDate: {
      type: Date,
      required: true,
    },
    user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const Task = mongoose.model("Task", taskSchema);
export default Task;
