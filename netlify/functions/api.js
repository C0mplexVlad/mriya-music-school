import { randomUUID } from "node:crypto";
import { courses } from "../../server/data.js";
import { validateTrialLesson } from "../../server/validation.js";

const bookings = [];
const functionPrefix = "/.netlify/functions/api";
const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

export async function handler(event) {
  const rawPath = event.path ?? new URL(event.rawUrl).pathname;
  const path = rawPath.startsWith(functionPrefix)
    ? `/api${rawPath.slice(functionPrefix.length) || "/"}`
    : rawPath;

  if (event.httpMethod === "GET" && path === "/api/health") {
    return json(200, { status: "ok" });
  }
  if (event.httpMethod === "GET" && path === "/api/courses") {
    return json(200, courses);
  }
  if (event.httpMethod === "GET" && path.startsWith("/api/courses/")) {
    const id = decodeURIComponent(path.slice("/api/courses/".length));
    const course = courses.find((item) => item.id === id);
    return course
      ? json(200, course)
      : json(404, { message: "Курс не знайдено." });
  }
  if (event.httpMethod !== "POST" || path !== "/api/trial-lessons") {
    return json(404, { message: "Маршрут не знайдено." });
  }

  if (typeof event.body !== "string" || event.body.length > 20_000) {
    return json(413, { message: "Запит завеликий або не містить даних." });
  }

  let body;
  try {
    const content = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf8")
      : event.body;
    body = JSON.parse(content);
  } catch {
    return json(400, { message: "Некоректний формат запиту." });
  }

  const errors = validateTrialLesson(body);
  if (Object.keys(errors).length) {
    return json(400, { message: "Перевірте, будь ласка, введені дані.", errors });
  }

  const booking = {
    id: randomUUID(),
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone.trim(),
    courseId: body.courseId,
    preferredDate: body.preferredDate,
    note: (body.note ?? "").trim(),
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  return json(201, {
    message: "Дякуємо! Ми зв’яжемося з вами, щоб узгодити час пробного уроку.",
    bookingId: booking.id,
  });
}
