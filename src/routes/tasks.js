const express = require("express");
const pool = require("../db");
const { isBlank, parseId } = require("../utils/validation");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, title, description, is_completed, created_at FROM tasks ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const taskId = parseId(req.params.id);

  if (!taskId) {
    return res.status(404).json({
      message: "Task dengan ID tersebut tidak ditemukan.",
    });
  }

  try {
    const result = await pool.query(
      "SELECT id, title, description, is_completed, created_at FROM tasks WHERE id = $1",
      [taskId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Task dengan ID tersebut tidak ditemukan.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { title, description } = req.body;

  if (isBlank(title)) {
    return res.status(400).json({
      message: "Field title tidak boleh kosong atau hanya berisi spasi.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description)
       VALUES ($1, $2)
       RETURNING id, title, description, is_completed, created_at`,
      [title.trim(), description ?? null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const taskId = parseId(req.params.id);

  if (!taskId) {
    return res.status(404).json({
      message: "Task dengan ID tersebut tidak ditemukan.",
    });
  }

  const { title, description, is_completed } = req.body;
  const updates = [];
  const values = [];

  if (title !== undefined) {
    if (isBlank(title)) {
      return res.status(400).json({
        message: "Field title tidak boleh kosong atau hanya berisi spasi.",
      });
    }

    updates.push(`title = $${updates.length + 1}`);
    values.push(title.trim());
  }

  if (description !== undefined) {
    updates.push(`description = $${updates.length + 1}`);
    values.push(description);
  }

  if (is_completed !== undefined) {
    if (typeof is_completed !== "boolean") {
      return res.status(400).json({
        message: "Field is_completed harus bernilai boolean.",
      });
    }

    updates.push(`is_completed = $${updates.length + 1}`);
    values.push(is_completed);
  }

  if (updates.length === 0) {
    return res.status(400).json({
      message: "Tidak ada data yang dapat diupdate.",
    });
  }

  values.push(taskId);

  try {
    const result = await pool.query(
      `UPDATE tasks
       SET ${updates.join(", ")}
       WHERE id = $${values.length}
       RETURNING id, title, description, is_completed, created_at`,
      values
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Task dengan ID tersebut tidak ditemukan.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const taskId = parseId(req.params.id);

  if (!taskId) {
    return res.status(404).json({
      message: "Task dengan ID tersebut tidak ditemukan.",
    });
  }

  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING id, title, description, is_completed, created_at",
      [taskId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Task dengan ID tersebut tidak ditemukan.",
      });
    }

    res.json({
      message: "Task berhasil dihapus.",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
