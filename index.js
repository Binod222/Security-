// // Packages
// import express from "express";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import path from "path";

// // Files
// import connectDB from "./backend/config/db.js";
// import userRoutes from "./backend/routes/userRoutes.js";
// import genreRoutes from "./backend/routes/genreRoutes.js";
// import moviesRoutes from "./backend/routes/moviesRoutes.js";
// import uploadRoutes from "./backend/routes/uploadRoutes.js";

// // Configuration
// dotenv.config();
// connectDB();

// const app = express();

// // middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// const PORT = process.env.PORT || 3000;

// // Routes
// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/genre", genreRoutes);
// app.use("/api/v1/movies", moviesRoutes);
// app.use("/api/v1/upload", uploadRoutes);

// const __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


// Packages
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";   // ✅ Import file system module
import https from "https"; // ✅ Import https module

// Files
import connectDB from "./backend/config/db.js";
import userRoutes from "./backend/routes/userRoutes.js";
import genreRoutes from "./backend/routes/genreRoutes.js";
import moviesRoutes from "./backend/routes/moviesRoutes.js";
import uploadRoutes from "./backend/routes/uploadRoutes.js";

// Configuration
dotenv.config();
connectDB();

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Define the port for HTTPS.
// It's common to use 3443 or similar locally to avoid conflicts with standard HTTP (80) or HTTPS (443).
const HTTPS_PORT = process.env.HTTPS_PORT || 3443; // Using HTTPS_PORT from .env or defaulting to 3443

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/upload", uploadRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

// --- HTTPS Server Configuration ---
// Ensure 'server.key' and 'server.crt' are in your project's root directory
try {
    const privateKey = fs.readFileSync(path.join(__dirname, 'server.key'), 'utf8');
    const certificate = fs.readFileSync(path.join(__dirname, 'server.crt'), 'utf8');

    const credentials = { key: privateKey, cert: certificate };

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(HTTPS_PORT, () => {
        console.log(`HTTPS Server is running on port ${HTTPS_PORT}`);
    });
} catch (error) {
    console.error("Failed to start HTTPS server. Make sure 'server.key' and 'server.crt' exist in the root directory.");
    console.error("Error:", error.message);
    // Optionally, fall back to HTTP if HTTPS fails, or exit the process
    console.log(`Attempting to start HTTP server on port ${process.env.PORT || 3000} as fallback.`);
    app.listen(process.env.PORT || 3000, () => console.log(`HTTP Server is running on port ${process.env.PORT || 3000} (Fallback)`));
}


// You can remove the old app.listen(PORT, ...) if you only want HTTPS
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
