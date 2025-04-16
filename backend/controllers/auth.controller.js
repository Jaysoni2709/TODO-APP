const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const tokenService = require("../utils/token");

class AuthController {
  async signup(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ msg: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword, role });

      const tokens = tokenService.generateTokens({ id: user._id, role: user.role });
      res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
      res.status(201).json({ user, accessToken: tokens.accessToken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Signup failed" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || user.isBlocked) return res.status(401).json({ msg: "Invalid credentials or blocked" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ msg: "Incorrect password" });

      const tokens = tokenService.generateTokens({ id: user._id, role: user.role });
      res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
      res.json({ user, accessToken: tokens.accessToken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Login failed" });
    }
  }

  async googleLogin(req, res) {
    try {
      const { name, email } = req.body;

      let user = await User.findOne({ email });
      
      if (!user) {
        user = await User.create({ name, email, provider: "google" });
      } else if (user.isBlocked) {
        return res.status(403).json({ msg: "User is blocked" });
      } else if (user.provider !== "google") {
        user.provider = "google";
        await user.save();
      }

      const tokens = tokenService.generateTokens({ id: user._id, role: user.role });

      res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });

      res.json({ user, accessToken: tokens.accessToken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Google login failed" });
    }
  }

  async refreshToken(req, res) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) return res.status(401).json({ msg: "No token provided" });

      const userData = tokenService.validateRefreshToken(token);
      if (!userData) return res.status(401).json({ msg: "Invalid refresh token" });

      const tokens = tokenService.generateTokens({ id: userData.id, role: userData.role });
      res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
      res.json({ accessToken: tokens.accessToken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Token refresh failed" });
    }
  }

  async logout(req, res) {
    res.clearCookie("refreshToken");
    res.json({ msg: "Logged out" });
  }

  async userProfile(req,res){
    try {
      const user = await User.findById(req.user.id).select('-password'); 
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      res.json(user); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
}

module.exports = new AuthController();
