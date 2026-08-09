const express = require("express");
const graphRoutes = require("./routes/graphRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Parse incoming JSON requests
app.use(express.json());

// Basic health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "GraphImpact API is running"
    });
});

// API routes
app.use("/api", graphRoutes);

// Centralized error handler
// Must be registered after all routes
app.use(errorHandler);

module.exports = app;