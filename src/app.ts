import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import hpp from "hpp";

import AppError from "./utils/AppError";
import ErrorController from "./controllers/ErrorController";
import taskRouter from "./routes/taskRouter";

// Create express app
const app = express();

// Enable trust proxy
app.enable("trust proxy");

// Enable cors
app.use(
	cors({
		origin: "http://localhost:5173",
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		credentials: true,
	}),
);

// Development logging requests
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Set security http
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				connectSrc: ["'self'", "http://127.0.0.1:5000"],
			},
		},
	}),
);

// Limit amount of requests
app.use(
	"/api",
	rateLimit({
		max: 100,
		windowMs: 1000 * 15, // 15 seconds
		message: "Too many requests from this IP. Try again later",
		validate: { trustProxy: false },
	}),
);

// Enable json responses
app.use(express.json({ limit: "100kb" }));

// Prevent parameters pollution
app.use(hpp());

// Compress responses
app.use(compression());

// Routes
app.use("/api/v1/tasks", taskRouter);

// Route not found
app.all(/.*/, (req, res, next) => next(new AppError(404, `${req.originalUrl} not found`)));

// Middleware to handle errors
app.use(ErrorController.handler);

// Default export the app
export default app;
