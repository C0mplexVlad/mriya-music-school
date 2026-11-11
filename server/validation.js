import { courses } from "./data.js";

export function validateTrialLesson(body) {
  const { name, email, phone, courseId, preferredDate, note = "" } = body ?? {};
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
  return errors;
}
