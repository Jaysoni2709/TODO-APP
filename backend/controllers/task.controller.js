const Task = require("../models/Task");
const cloudinary = require("cloudinary").v2;

class TaskController {
  async createTask(req, res) {
    try {
      console.log("req.user",req.user)
      const { title, description } = req.body;
      const image = req.file;
      let imageUrl = "";

      if (image) {
        console.log("image==>>>",image);
        imageUrl = req.file.filename;
      }

      const task = await Task.create({
        title,
        description,
        imageUrl,
        userId: req.user.id,
      });

      res.status(201).json(task);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Task creation failed" });
    }
  }

  async getTasks(req, res) {
    try {
      const { search = "", sort = "createdAt" } = req.query;
      const tasks = await Task.find({
        userId: req.user.id,
        title: { $regex: search, $options: "i" },
      }).sort({ [sort]: -1 });

      res.json(tasks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Failed to fetch tasks" });
    }
  }

  async updateTask(req, res) {
    try {
      const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
      if (!task) return res.status(404).json({ msg: "Task not found" });

      const { title, description } = req.body;
      if (req.file) {
        const uploadRes = await cloudinary.uploader.upload(req.file.path);
        task.imageUrl = uploadRes.secure_url;
      }

      task.title = title;
      task.description = description;
      await task.save();

      res.json(task);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Update failed" });
    }
  }

  async deleteTask(req, res) {
    try {
      const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
      if (!task) return res.status(404).json({ msg: "Task not found" });
      res.json({ msg: "Task deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Delete failed" });
    }
  }

  async getTaskById(req,res){
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }
      res.json(task);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to fetch task' });
    }
  }
}

module.exports = new TaskController();