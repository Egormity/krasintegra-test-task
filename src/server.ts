import path from "path";
import dotenv from "dotenv";

// Handle uncaughtException
process.on("uncaughtException", err => {
	console.log("uncaughtException", err);
	console.log("uncaughtException 💥 Shutting down the server...");
	process.exit(1);
});

// Configure environment variables
const result = dotenv.config({ path: path.resolve(__dirname, "../.env") });
if (result.error) console.error("Error loading .env file:", result.error);
else console.log(".env file loaded successfully");

// Import the app after loading environment variables
import app from "./app";

// Start the server
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
	console.log(`App running on port ${PORT} with ${process.env.NODE_ENV} mode`);
});

// Handle unhandledRejection
process.on("unhandledRejection", err => {
	console.log("unhandledRejection:", err);
	console.log("unhandledRejection 💥 Shutting down the server...");
	server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on("SIGTERM", err => {
	console.log("SIGTERM:", err);
	console.log("SIGTERM 👍 Shutting down the server...");
	server.close(() => console.log("Process terminated"));
});
