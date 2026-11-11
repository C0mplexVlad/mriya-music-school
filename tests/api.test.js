import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "node:http";
import { app } from "../server/app.js";
import { handler as netlifyHandler } from "../netlify/functions/api.js";

const server = createServer(app);
let baseUrl;

before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("courses endpoint returns the school catalogue", async () => {
  const response = await fetch(`${baseUrl}/api/courses`);
  const courses = await response.json();

  assert.equal(response.status, 200);
  assert.ok(courses.length >= 4);
  assert.ok(courses.some((course) => course.id === "piano"));
});

test("course details returns 404 for an unknown course", async () => {
  const response = await fetch(`${baseUrl}/api/courses/not-a-course`);
  assert.equal(response.status, 404);
  assert.equal((await response.json()).message, "Курс не знайдено.");
});

test("trial booking validates data on the server", async () => {
  const response = await fetch(`${baseUrl}/api/trial-lessons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "X", email: "wrong", phone: "12", courseId: "unknown", preferredDate: "2020-01-01" }),
  });
  const result = await response.json();

  assert.equal(response.status, 400);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.courseId);
  assert.ok(result.errors.preferredDate);
});

test("trial booking accepts valid data", async () => {
  const response = await fetch(`${baseUrl}/api/trial-lessons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Вікторія",
      email: "victoria@example.com",
      phone: "+380 67 123 45 67",
      courseId: "piano",
      preferredDate: "2099-01-01",
      note: "",
    }),
  });
  const result = await response.json();

  assert.equal(response.status, 201);
  assert.ok(result.bookingId);
  assert.match(result.message, /Дякуємо/);
});

test("Netlify function serves the course API", async () => {
  const response = await netlifyHandler({
    rawUrl: "https://example.netlify.app/.netlify/functions/api/courses",
    path: "/.netlify/functions/api/courses",
    httpMethod: "GET",
    headers: {},
    queryStringParameters: {},
    body: null,
    isBase64Encoded: false,
  }, {});
  const courses = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.ok(courses.some((course) => course.id === "piano"));
});
