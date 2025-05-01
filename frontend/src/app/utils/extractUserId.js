import { jwtVerify } from "jose";

const SECRET = new process.env.JWT_SECRET;

export async function extractUserId(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.userId || null;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
