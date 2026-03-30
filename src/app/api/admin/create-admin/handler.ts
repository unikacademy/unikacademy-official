import Admin from "@/models/Admin";
import { ok, err } from "@/lib/api";

export async function createAdmin(body: {
  username?: string;
  password?: string;
  secretKey?: string;
}) {
  const { username, password, secretKey } = body;

  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    return err("Unauthorized", 401);
  }

  if (!username || !password) {
    return err("Username and password are required", 400);
  }

  const existing = await Admin.findOne({ username });
  if (existing) {
    return err("Admin user already exists", 400);
  }

  await new Admin({ username, password }).save();

  return ok({ message: "Admin user created successfully" }, 201);
}
