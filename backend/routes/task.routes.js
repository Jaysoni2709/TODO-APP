const express = require('express');
const router = express.Router();
const taskController = require("../controllers/task.controller");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer");
const upload = require('../middleware/upload.middleware');

router.post("/createTask", authMiddleware(), upload.single("image"), taskController.createTask);
router.get("/getTask", authMiddleware(), taskController.getTasks);
router.put("/updateTask/:id", authMiddleware(), upload.single("image"), taskController.updateTask);
router.delete("/deleteTask/:id", authMiddleware(), taskController.deleteTask);
router.get("/getTaskByID/:id", authMiddleware(), taskController.getTaskById);


module.exports = router;