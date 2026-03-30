/**
 * Script to create an admin user
 * Usage: node scripts/create-admin.js
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://thitainfo:thitainfo@thitainfo.alekr.mongodb.net/unik-academy";

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

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(
        `Admin "${username}" already exists. Deleting and recreating...`,
      );
      await Admin.deleteOne({ username });
    }

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

const username = "admin";
const password = "admin@2026";

createAdmin(username, password);
