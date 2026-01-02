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

  // Check if this user has already shortened this exact URL
  if (!code) {
    const [existingUrl] = await db
      .select()
      .from(urlsTable)
      .where(and(eq(urlsTable.userId, req.user.id), eq(urlsTable.target, url)));

    if (existingUrl) {
      return res.status(409).json({
        error: "You have already shortened this URL.",
        existingUrl: {
          id: existingUrl.id,
          shortCode: existingUrl.shortCode,
          target: existingUrl.target,
        },
      });
    }
  }

  const shortCode = code ?? nanoid(6);

  try {
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

    return res.status(201).json(result);
  } catch (e) {
    // Handle unique constraint violation for custom codes
    if (e.code === "23505" && e.constraint.includes("urls_code_unique")) {
      return res
        .status(409)
        .json({ error: `The alias '${shortCode}' is already in use.` });
    }
    // For other unexpected database errors
    console.error(e);
    return res.status(500).json({ error: "An internal server error occurred." });
  }
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

  return res.status(204).send();
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
