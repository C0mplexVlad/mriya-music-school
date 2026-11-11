import express from "express";
import { randomUUID } from "node:crypto";
import { courses } from "./data.js";

export const app = express();
export default app;
const bookings = [];

app.use(express.json({ limit: "20kb" }));

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
  const errors = {};

  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80) {
    errors.name = "Вкажіть ім’я (від 2 до 80 символів).";
  }
  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.email = "Вкажіть коректну електронну адресу.";
  }
  if (typeof phone !== "string" || !/^[+\d\s().-]{9,20}$/.test(phone.trim())) {
    errors.phone = "Вкажіть коректний номер телефону.";
  }
  if (!courses.some((course) => course.id === courseId)) {
    errors.courseId = "Оберіть курс зі списку.";
  }
  const date = typeof preferredDate === "string" ? new Date(`${preferredDate}T00:00:00`) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!date || Number.isNaN(date.getTime()) || date < today) {
    errors.preferredDate = "Оберіть сьогоднішню або майбутню дату.";
  }
  if (typeof note !== "string" || note.length > 500) {
    errors.note = "Коментар має містити не більше 500 символів.";
  }
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
