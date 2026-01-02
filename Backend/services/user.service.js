import db from "../db/index.js";
import { userTable } from "../models/index.js";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email) {
  const [existingUser] = await db
    .select({
      id: userTable.id,
      firstname: userTable.firstname,
      lastname: userTable.lastname,
      email: userTable.email,
      salt: userTable.salt,
      password: userTable.password,
    })
    .from(userTable)
    .where(eq(userTable.email, email));

  return existingUser;
}

export async function getUserById(id) {
    const [user] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, id));
    
    return user;
}
