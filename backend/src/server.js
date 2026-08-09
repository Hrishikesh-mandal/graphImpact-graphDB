require("dotenv").config();

const app = require("./app");
const driver = require("./config/db");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 GraphImpact API running on port ${PORT}`);
});

async function shutdown() {
    console.log("\nShutting down server...");

    server.close(async () => {
        await driver.close();

        console.log("Database connection closed.");
        process.exit(0);
    });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);