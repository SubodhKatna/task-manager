const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    dueDate: { type: Date, required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    attachments: [{ type: String }],
    todoChecklist: [todoSchema],
    progress: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate progress and status based on todoChecklist
taskSchema.pre("save", function (next) {
  const task = this;
  if (Array.isArray(task.todoChecklist) && task.todoChecklist.length > 0) {
    const total = task.todoChecklist.length;
    const completed = task.todoChecklist.filter((t) => t.completed).length;
    task.progress = Math.round((completed / total) * 100);
  } else {
    task.progress = 0;
  }

  if (task.progress >= 100) {
    task.status = "Completed";
  } else if (task.progress > 0) {
    task.status = "In Progress";
  } else {
    task.status = "Pending";
  }

  next();
});

module.exports = mongoose.model("Task", taskSchema);