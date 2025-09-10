import express from "express";
import { shortenPostRequestBodySchema } from "../validations/request.validation.js";
import { urlsTable } from "../models/index.js";
import { db } from "../db/index.js";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";

const urlRouter = express.Router();

urlRouter.post("/shorten", ensureAuthenticated, async function (req, res) {
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { url, code } = validationResult.data;
  const shortCode = code ?? nanoid(6);

  const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode,
      target: url,
      userId: req.user.id,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      target: urlsTable.target,
    });

  return res.status(201).json({
    id: result.id,
    shortCode: result.shortCode,
    target: result.target,
  });
});

urlRouter.get("/codes", ensureAuthenticated, async function (req, res) {
  const codes = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.userId, req.user.id));

  return res.json({ codes });
});

urlRouter.delete("/:id", ensureAuthenticated, async function (req, res) {
  const id = req.params.id;

  const result = await db
    .delete(urlsTable)
    .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, req.user.id)));

  return res.status(200).json({ deleted: true });
});

urlRouter.get("/:shortCode", async function (req, res) {
  const code = req.params.shortCode;
  const [result] = await db
    .select({ target: urlsTable.target })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));
  if (!result) {
    return res.status(401).json({ error: "Invalid URL" });
  }

  return res.redirect(result.target);
});

export default urlRouter;
