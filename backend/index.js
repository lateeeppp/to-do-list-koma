const http = require("http");
const { Pool } = require("pg");
const { URL } = require("url");
require("dotenv").config();

const PORT = process.env.PORT || 4000;
const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgres://todo_user:todo_password@localhost:5432/todo_db";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

// buat tabel
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT FALSE
    );
  `);
  console.log("Database ready.");
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method.toUpperCase();

  // handle preflight CORS
  if (method === "OPTIONS") {
    setCorsHeaders(res);
    res.writeHead(204);
    return res.end();
  }

  // GET /todos
  if (method === "GET" && pathname === "/todos") {
    try {
      const result = await pool.query(
        "SELECT id, title, completed FROM todos ORDER BY id DESC"
      );
      return sendJson(res, 200, result.rows);
    } catch (err) {
      console.error("Error fetching todos:", err);
      return sendJson(res, 500, { error: "Internal server error" });
    }
  }

  // POST /todos
  if (method === "POST" && pathname === "/todos") {
    try {
      const body = await parseBody(req);
      const title = body.title?.trim();
      if (!title) {
        return sendJson(res, 400, { error: "Title is required" });
      }
      const result = await pool.query(
        "INSERT INTO todos (title) VALUES ($1) RETURNING id, title, completed",
        [title]
      );
      return sendJson(res, 201, result.rows[0]);
    } catch (err) {
      console.error("Error creating todo:", err);
      return sendJson(res, 500, { error: "Internal server error" });
    }
  }

  // PATCH /todos/:id
  if (method === "PATCH" && pathname.startsWith("/todos/")) {
    const id = parseInt(pathname.split("/")[2], 10);
    if (Number.isNaN(id)) {
      return sendJson(res, 400, { error: "Invalid ID" });
    }
    try {
      const result = await pool.query(
        "UPDATE todos SET completed = NOT completed WHERE id = $1 RETURNING id, title, completed",
        [id]
      );
      if (result.rows.length === 0) {
        return sendJson(res, 404, { error: "Todo not found" });
      }
      return sendJson(res, 200, result.rows[0]);
    } catch (err) {
      console.error("Error updating todo:", err);
      return sendJson(res, 500, { error: "Internal server error" });
    }
  }

  // DELETE /todos/:id
  if (method === "DELETE" && pathname.startsWith("/todos/")) {
    const id = parseInt(pathname.split("/")[2], 10);
    if (Number.isNaN(id)) {
      return sendJson(res, 400, { error: "Invalid ID" });
    }
    try {
      const result = await pool.query("DELETE FROM todos WHERE id = $1", [id]);
      if (result.rowCount === 0) {
        return sendJson(res, 404, { error: "Todo not found" });
      }
      return sendJson(res, 200, { success: true });
    } catch (err) {
      console.error("Error deleting todo:", err);
      return sendJson(res, 500, { error: "Internal server error" });
    }
  }

  // 404 default
  sendJson(res, 404, { error: "Not found" });
});

initDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to init DB:", err);
    process.exit(1);
  });
