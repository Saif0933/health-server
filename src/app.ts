import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware";
import router from "./routes";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://zyra-ai-web.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// Logging middleware (equivalent to logger())
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "implemented ci cd", success: true });
});

app.use("/api/v1", router);

// Error Handler
app.use(errorHandler);

export default app;
