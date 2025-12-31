import "dotenv/config";
import express from "express";
import userRouter from "./routes/users.routes.js";
import urlRouter from "./routes/url.routes.js";
import { authenticationMiddleware } from "./middlewares/auth.middleware.js";
import cors from "cors";

const app = express();
app.use(cors(
  {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
))
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(authenticationMiddleware);

app.get("/", (req, res) => {
  res.json("Server is running smoothly");
});

app.use("/user", userRouter);
app.use(urlRouter);
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
