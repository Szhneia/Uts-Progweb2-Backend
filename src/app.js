const express = require("express");
const logger = require("./middleware/logger");
const tasksRouter = require("./routes/tasks");

const app = express();

app.use(logger);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Task Manager API is running",
  });
});

app.use("/tasks", tasksRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint tidak ditemukan.",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.statusCode || 500).json({
    message: error.message || "Terjadi kesalahan pada server.",
  });
});

module.exports = app;
