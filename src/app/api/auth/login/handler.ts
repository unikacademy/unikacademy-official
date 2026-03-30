import Admin from "@/models/Admin";
import { ok, err } from "@/lib/api";

export async function loginAdmin(body: {
  username?: string;
  password?: string;
}) {
  const { username, password } = body;

  if (!username || !password) {
    return err("Username and password are required", 400);
  }

  const admin = await Admin.findOne({ username });
  if (!admin) {
    return err("Invalid credentials", 401);
  }

  const isPasswordValid = await admin.comparePassword(password);
  if (!isPasswordValid) {
    return err("Invalid credentials", 401);
  }

  return ok({
    message: "Login successful",
    admin: { username: admin.username },
  });
}
