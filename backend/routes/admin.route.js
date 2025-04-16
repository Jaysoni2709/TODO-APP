const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/users", authMiddleware(["admin"]), adminController.getUsers);
router.put("/block/:id", authMiddleware(["admin"]), adminController.toggleBlockUser);

module.exports = router;
