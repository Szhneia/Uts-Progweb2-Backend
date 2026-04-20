require("dotenv").config();

const assert = require("node:assert/strict");
const app = require("../src/app");
const pool = require("../src/db");

// Helper ini menyederhanakan request JSON untuk pengecekan endpoint.
async function requestJson(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const text = await response.text();
  const json = text ? JSON.parse(text) : null;

  return {
    status: response.status,
    json,
  };
}

async function main() {
  let server;
  let createdTaskId = null;
  let taskDeleted = false;

  try {
    await pool.query("SELECT 1");

    server = await new Promise((resolve, reject) => {
      const instance = app.listen(0, () => resolve(instance));
      instance.on("error", reject);
    });

    const { port } = server.address();
    const baseUrl = `http://127.0.0.1:${port}`;
    const uniqueSuffix = Date.now();

    console.log(`Smoke test running on ${baseUrl}`);

    const rootResponse = await requestJson(baseUrl, "/");
    assert.equal(rootResponse.status, 200);
    assert.equal(rootResponse.json.message, "Task Manager API is running");
    console.log("OK  GET /");

    const listResponse = await requestJson(baseUrl, "/tasks");
    assert.equal(listResponse.status, 200);
    assert.ok(Array.isArray(listResponse.json));
    console.log("OK  GET /tasks");

    const createResponse = await requestJson(baseUrl, "/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `Smoke Test ${uniqueSuffix}`,
        description: "Created by smoke test",
      }),
    });
    assert.equal(createResponse.status, 201);
    assert.equal(createResponse.json.title, `Smoke Test ${uniqueSuffix}`);
    createdTaskId = createResponse.json.id;
    console.log("OK  POST /tasks");

    const detailResponse = await requestJson(baseUrl, `/tasks/${createdTaskId}`);
    assert.equal(detailResponse.status, 200);
    assert.equal(detailResponse.json.id, createdTaskId);
    console.log("OK  GET /tasks/:id");

    const updateResponse = await requestJson(baseUrl, `/tasks/${createdTaskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `Smoke Test Updated ${uniqueSuffix}`,
        description: "Updated by smoke test",
        is_completed: true,
      }),
    });
    assert.equal(updateResponse.status, 200);
    assert.equal(updateResponse.json.title, `Smoke Test Updated ${uniqueSuffix}`);
    assert.equal(updateResponse.json.is_completed, true);
    console.log("OK  PUT /tasks/:id");

    const blankTitleResponse = await requestJson(baseUrl, "/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "   ",
      }),
    });
    assert.equal(blankTitleResponse.status, 400);
    assert.equal(
      blankTitleResponse.json.message,
      "Field title tidak boleh kosong atau hanya berisi spasi."
    );
    console.log("OK  POST /tasks with blank title returns 400");

    const deleteResponse = await requestJson(baseUrl, `/tasks/${createdTaskId}`, {
      method: "DELETE",
    });
    assert.equal(deleteResponse.status, 200);
    assert.equal(deleteResponse.json.data.id, createdTaskId);
    taskDeleted = true;
    console.log("OK  DELETE /tasks/:id");

    const missingDetailResponse = await requestJson(baseUrl, `/tasks/${createdTaskId}`);
    assert.equal(missingDetailResponse.status, 404);
    console.log("OK  GET /tasks/:id returns 404 after delete");

    const missingDeleteResponse = await requestJson(baseUrl, `/tasks/${createdTaskId}`, {
      method: "DELETE",
    });
    assert.equal(missingDeleteResponse.status, 404);
    console.log("OK  DELETE /tasks/:id returns 404 after delete");

    console.log("Smoke test passed.");
  } finally {
    if (createdTaskId !== null && !taskDeleted) {
      try {
        await pool.query("DELETE FROM tasks WHERE id = $1", [createdTaskId]);
      } catch (error) {
        console.error(`Cleanup failed for task ID ${createdTaskId}: ${error.message}`);
      }
    }

    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await pool.end();
  }
}

main().catch((error) => {
  console.error("Smoke test failed.");
  console.error(error.message);
  process.exitCode = 1;
});
