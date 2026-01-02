import express from "express";
import db from "../db/index.js";
import { userTable } from "../models/index.js";
import {
  signupPostRequestBodySchema,
  loginPostRequestBodySchema,
} from "../validations/request.validation.js";
import { hashPasswordWithSalt } from "../utils/hash.js";
import { getUserByEmail, getUserById } from "../services/user.service.js";
import { createUserToken } from "../utils/token.js";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const validationResult = await signupPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { firstname, lastname, email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return res
      .status(400)
      .json({ error: `User with the email : ${email} already exists` });
  }

  const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

  const [user] = await db
    .insert(userTable)
    .values({
      email,
      firstname,
      lastname,
      salt,
      password: hashedPassword,
    })
    .returning({ id: userTable.id });

  return res.status(201).json({ data: { userId: user.id } });
});

userRouter.post("/login", async (req, res) => {
  const validationResult = await loginPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { email, password } = validationResult.data;

  const user = await getUserByEmail(email);

  if (!user) {
    return res
      .status(404)
      .json({ error: `User with the email ${email} does not exists` });
  }

  const { password: hashedPassword } = hashPasswordWithSalt(
    password,
    user.salt
  );

  if (user.password !== hashedPassword) {
    return res.status(400).json({ error: "The password is invalid" });
  }

  const token = await createUserToken({ id: user.id });

  return res.json({ token });
});

userRouter.get("/me", ensureAuthenticated, async (req, res) => {
    const user = await getUserById(req.user.id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Omit sensitive fields before sending the response
    const { password, salt, ...safeUser } = user;
    return res.json(safeUser);
});


export default userRouter;
