import express from "express";
import { randomUUID } from "node:crypto";
import { courses } from "./data.js";
import { validateTrialLesson } from "./validation.js";

export const app = express();
export default app;
const bookings = [];

app.use(express.json({ limit: "20kb" }));

app.use((request, _response, next) => {
  const functionPrefix = "/.netlify/functions/api";
  if (request.url.startsWith(functionPrefix)) {
    request.url = `/api${request.url.slice(functionPrefix.length) || "/"}`;
  }
  next();
});

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/courses", (_request, response) => {
  response.json(courses);
});

app.get("/api/courses/:id", (request, response) => {
  const course = courses.find((item) => item.id === request.params.id);
  if (!course) {
    return response.status(404).json({ message: "Курс не знайдено." });
  }
  return response.json(course);
});

app.post("/api/trial-lessons", (request, response) => {
  const { name, email, phone, courseId, preferredDate, note = "" } = request.body ?? {};
  const errors = validateTrialLesson(request.body);
  if (Object.keys(errors).length) {
    return response.status(400).json({ message: "Перевірте, будь ласка, введені дані.", errors });
  }

  const booking = {
    id: randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    courseId,
    preferredDate,
    note: note.trim(),
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  return response.status(201).json({
    message: "Дякуємо! Ми зв’яжемося з вами, щоб узгодити час пробного уроку.",
    bookingId: booking.id,
  });
});

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return response.status(400).json({ message: "Некоректний формат запиту." });
  }
  console.error(error);
  return response.status(500).json({ message: "Сталася помилка сервера." });
});
