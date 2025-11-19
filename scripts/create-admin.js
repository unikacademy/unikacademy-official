/**
 * Script to create an admin user
 * Usage: node scripts/create-admin.js <username> <password>
 *
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = "";

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  const password = String(this.get("password"));
  this.set("password", await bcrypt.hash(password, salt));
  next();
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function createAdmin(username, password) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(`Admin user "${username}" already exists.`);
      await mongoose.connection.close();
      return;
    }

    // Create new admin
    const admin = new Admin({ username, password });
    await admin.save();
    console.log(`Admin user "${username}" created successfully!`);

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error creating admin:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Get arguments from command line
const username = "admin";
const password = "admin@2025";

if (!username || !password) {
  console.error("Usage: node scripts/create-admin.js <username> <password>");
  console.error("Or set MONGODB_URI environment variable if needed");
  process.exit(1);
}

createAdmin(username, password);
