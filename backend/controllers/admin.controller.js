const User = require("../models/User");

class AdminController {
  async getUsers(req, res) {
    try {
      const users = await User.find({ role: "user" }).select("-password");
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Failed to get users" });
    }
  }

  async toggleBlockUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user || user.role === "admin") return res.status(404).json({ msg: "User not found or invalid" });

      user.isBlocked = !user.isBlocked;
      await user.save();

      res.json({ msg: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Block/unblock failed" });
    }
  }
}

module.exports = new AdminController();
