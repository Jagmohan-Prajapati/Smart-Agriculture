require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["farmer", "contractor", "buyer"], required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Register a new user
async function registerUser(userData) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = new User({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
    });

    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
  } catch (error) {
    throw new Error("Registration failed: " + error.message);
  }
}

// Login an existing user
async function loginUser(email, password) {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email or password");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
}

module.exports = {
  registerUser,
  loginUser,
};
