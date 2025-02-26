require("dotenv").config();
const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    // options: {
    //     encrypt: true,
    //     trustServerCertificate: true, // Set to false for production if SSL is configured
    // }
};

// Function to connect to SQL Server
const connectToDatabase = async () => {
    try {
        await sql.connect(config);
        console.log("Connected to SQL Server successfully!");
    } catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1); // Exit if DB connection fails
    }
};

connectToDatabase();

// API Route
app.get("/api/tcs", async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT * FROM emp");
        res.json(result.recordset);
        console.log("Fetched data successfully:", result.recordset);
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// ---------------------- Serve React Frontend ----------------------
const frontendPath = path.join(__dirname, "dist"); // Change to "build" if using Create React App
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Graceful Shutdown Handling
process.on("SIGINT", async () => {
    console.log("Shutting down server...");
    await sql.close();
    process.exit(0);
});

// ------------------------------------------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
