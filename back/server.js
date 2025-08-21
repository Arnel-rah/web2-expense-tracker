import express from "express";
import pool from "./config/database.js";

const app = express();
const port = 3000;

app.use(express.json());
app.get("/users", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur :", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
