import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useParams, useSearchParams } from "react-router-dom";

const navItems = [
  { to: "/", label: "Головна" },
  { to: "/courses", label: "Напрями" },
  { to: "/contacts", label: "Контакти" },
];

function useCourses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/courses")
      .then((response) => {
        if (!response.ok) throw new Error("Не вдалося завантажити напрями.");
        return response.json();
      })
      .then((items) => {
        if (active) setCourses(items);
      })
      .catch(() => {
        if (active) setError("Зараз не вдається завантажити курси. Спробуйте оновити сторінку.");
      });
    return () => {
      active = false;
    };
  }, []);

  return { courses, error };
}

function Brand({ footer = false }) {
  return (
    <Link className={`brand${footer ? " brand-footer" : ""}`} to="/" aria-label="Мрія — на головну">
      <span className="brand-mark" aria-hidden="true">м</span>
      <span>мрія<span className="brand-dot">.</span></span>
    </Link>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>
        <nav className={`main-nav${menuOpen ? " is-open" : ""}`} aria-label="Головна навігація">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} onClick={() => setMenuOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <Link className="button button-dark nav-cta" to="/booking" onClick={() => setMenuOpen(false)}>
            Пробний урок <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div>
          <Brand footer />
          <p>Музика, до якої хочеться повертатися.</p>
        </div>
        <div className="footer-links">
          <Link to="/courses">Напрями</Link>
          <Link to="/booking">Пробний урок</Link>
          <Link to="/contacts">Контакти</Link>
        </div>
        <a href="mailto:hello@mriya.music">hello@mriya.music</a>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Музична школа «Мрія»</span>
        <span>Створено з любов’ю до музики ♡</span>
      </div>
    </footer>
  );
}

function CourseCard({ course, index = 0 }) {
  return (
    <article className={`course-card tone-${course.color}`}>
      <Link to={`/courses/${course.id}`} className="course-card-link" aria-label={`Детальніше: ${course.title}`}>
        <div className="course-art" aria-hidden="true">
          <span className="art-sparkle sparkle-one">✳</span>
          <span className="course-emoji">{course.image}</span>
          <span className="art-sparkle sparkle-two">✦</span>
          <span className="art-number">0{index + 1}</span>
        </div>
        <div className="course-card-info">
          <div className="course-meta"><span>{course.category}</span><span>{course.duration}</span></div>
          <div className="course-title-row">
            <h3>{course.title}</h3>
            <span className="round-arrow" aria-hidden="true">↗</span>
          </div>
          <p>{course.teacherRole} · {course.teacher}</p>
        </div>
      </Link>
    </article>
  );
}

function Home() {
  const { courses, error } = useCourses();
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> ТВОЯ МУЗИКА ПОЧИНАЄТЬСЯ ТУТ</span>
            <h1>Знайди свій<br />ритм у <em>«Мрії»</em></h1>
            <p className="hero-lead">Музична школа, де можна бути собою, пробувати нове й закохуватися у звучання.</p>
            <div className="hero-actions">
              <Link to="/booking" className="button button-dark">Записатися на пробний <span aria-hidden="true">↗</span></Link>
              <Link to="/courses" className="text-link">Обрати напрям <span aria-hidden="true">→</span></Link>
            </div>
            <div className="hero-social-proof">
              <div className="avatar-stack" aria-hidden="true"><span>М</span><span>С</span><span>А</span></div>
              <p><strong>120+</strong> учнів уже знайшли<br />своє звучання</p>
            </div>
          </div>
          <div className="hero-art" aria-label="Ілюстрація до музичної школи">
            <div className="hero-art-orbit orbit-one" />
            <div className="hero-art-orbit orbit-two" />
            <div className="hero-note note-one">♪</div>
            <div className="hero-note note-two">♫</div>
            <div className="hero-record"><span className="record-label">мрія</span></div>
            <div className="hero-sticker"><span>ЗВУЧИ<br />ПО-СВОЄМУ</span><b>✳</b></div>
            <div className="hero-caption">уроки, що надихають <span>↗</span></div>
          </div>
        </div>
        <div className="hero-bottom container">
          <span>СЛУХАЙ СЕБЕ</span><span className="hero-bottom-line" /><span>ГРАЙ СМІЛИВО</span><span className="hero-bottom-line" /><span>НАСОЛОДЖУЙСЯ</span>
        </div>
      </section>

      <section className="section courses-section">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">ОБИРАЙ СВОЄ</span><h2>З чого почнемо?</h2></div>
            <Link className="text-link" to="/courses">Усі напрями <span aria-hidden="true">→</span></Link>
          </div>
          {error && <p className="notice" role="alert">{error}</p>}
          {courses.length > 0 && <div className="course-grid">{courses.slice(0, 3).map((course, index) => <CourseCard key={course.id} course={course} index={index} />)}</div>}
        </div>
      </section>

      <section className="manifesto">
        <div className="container manifesto-inner">
          <span className="eyebrow">НЕ ПРО ІДЕАЛЬНО. ПРО ТЕ, ЩО ТВОЄ.</span>
          <h2>Музика — це не про ноти.<br /><em>Це про тебе.</em></h2>
          <p>Тут не треба мати досвід чи «правильний» голос. Достатньо цікавості — усе інше ми зробимо разом.</p>
          <Link to="/booking" className="button button-light">Познайомитися ближче <span aria-hidden="true">↗</span></Link>
          <span className="manifesto-star" aria-hidden="true">✳</span>
        </div>
      </section>

      <section className="section steps-section">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">ЛЕГКО ПОЧАТИ</span><h2>Три кроки до музики</h2></div></div>
          <div className="steps-grid">
            <article className="step-card"><span className="step-number">01</span><span className="step-icon">✉</span><h3>Залиш заявку</h3><p>Обери напрям і зручну дату для першої зустрічі.</p></article>
            <article className="step-card"><span className="step-number">02</span><span className="step-icon">♡</span><h3>Познайомся</h3><p>Викладач розпитає про твої цілі й покаже, як усе працює.</p></article>
            <article className="step-card"><span className="step-number">03</span><span className="step-icon">♫</span><h3>Зазвучиш ти</h3><p>Спробуй перший урок і виріши, чи хочеш продовжувати.</p></article>
          </div>
        </div>
      </section>
    </main>
  );
}

function CoursesPage() {
  const { courses, error } = useCourses();
  const [filter, setFilter] = useState("Усі");
  const filters = ["Усі", "Вокал", "Інструменти"];
  const visibleCourses = filter === "Усі" ? courses : courses.filter((course) => course.category === filter);
  return (
    <main>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">НАПРЯМИ НАВЧАННЯ</span>
          <h1>Обирай те,<br /><em>що звучить</em> у тобі.</h1>
          <p>Заняття для дітей і дорослих, початківців і тих, хто хоче рухатися далі.</p>
        </div>
      </section>
      <section className="section catalog-section">
        <div className="container">
          <div className="filter-row" role="group" aria-label="Фільтр напрямів">
            {filters.map((item) => <button key={item} type="button" className={`filter-button${filter === item ? " active" : ""}`} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}
            <span className="results-count">{visibleCourses.length} {visibleCourses.length === 1 ? "напрям" : "напрями"}</span>
          </div>
          {error && <p className="notice" role="alert">{error}</p>}
          {visibleCourses.length > 0
            ? <div className="course-grid">{visibleCourses.map((course, index) => <CourseCard key={course.id} course={course} index={index} />)}</div>
            : <p className="loading-message">Завантажуємо напрями…</p>}
        </div>
      </section>
      <section className="catalog-cta"><div className="container catalog-cta-inner"><p>Не впевнений/-а, що обрати?</p><Link to="/booking" className="button button-dark">Допоможемо на пробному <span aria-hidden="true">↗</span></Link></div></section>
    </main>
  );
}

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetch(`/api/courses/${encodeURIComponent(id)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error(response.status === 404 ? "Цей напрям не знайдено." : "Не вдалося завантажити інформацію.");
        return response.json();
      })
      .then((item) => { if (active) setCourse(item); })
      .catch((reason) => { if (active) setError(reason.message); });
    return () => { active = false; };
  }, [id]);

  if (error) return <main className="empty-state"><div><span className="eyebrow">УПС!</span><h1>{error}</h1><Link to="/courses" className="button button-dark">До всіх напрямів</Link></div></main>;
  if (!course) return <main className="empty-state"><p className="loading-message">Завантажуємо курс…</p></main>;
  return (
    <main>
      <section className="detail-hero">
        <div className="container detail-grid">
          <div className={`detail-art tone-${course.color}`} aria-hidden="true"><span>{course.image}</span><i>✳</i></div>
          <div className="detail-copy">
            <Link to="/courses" className="back-link">← Усі напрями</Link>
            <span className="eyebrow">{course.category} · {course.level}</span>
            <h1>{course.title}<br /><em>у своєму темпі.</em></h1>
            <p>{course.description}</p>
            <Link to={`/booking?course=${course.id}`} className="button button-dark">Записатися на пробний <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
      <section className="section detail-info-section">
        <div className="container detail-info-grid">
          <div><span className="eyebrow">ТВІЙ ВИКЛАДАЧ</span><h2>{course.teacher}</h2><p>{course.teacherRole} · допоможе тобі знайти власне звучання.</p></div>
          <div className="detail-facts"><div><span>Тривалість</span><strong>{course.duration}</strong></div><div><span>Вартість уроку</span><strong>{course.price} грн</strong></div><div><span>Розклад</span><strong>{course.schedule}</strong></div><div><span>Вік</span><strong>{course.age}</strong></div></div>
        </div>
      </section>
      <section className="detail-bottom-cta"><div className="container"><h2>Спробуємо разом?</h2><p>Перший урок — знайомство без зобов’язань.</p><Link to={`/booking?course=${course.id}`} className="button button-light">Обрати дату <span aria-hidden="true">↗</span></Link></div></section>
    </main>
  );
}

function BookingPage() {
  const { courses, error: coursesError } = useCourses();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", phone: "", courseId: "", preferredDate: "", note: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    if (courses.length) {
      const requested = searchParams.get("course");
      setForm((current) => ({ ...current, courseId: courses.some((course) => course.id === requested) ? requested : current.courseId }));
    }
  }, [courses, searchParams]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Вкажіть ім’я (не менше 2 символів).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Вкажіть коректну електронну адресу.";
    if (!/^[+\d\s().-]{9,20}$/.test(form.phone.trim())) nextErrors.phone = "Вкажіть коректний номер телефону.";
    if (!form.courseId) nextErrors.courseId = "Оберіть напрям.";
    if (!form.preferredDate || form.preferredDate < minDate) nextErrors.preferredDate = "Оберіть сьогоднішню або майбутню дату.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus({ type: "", message: "" });
      return;
    }

    try {
      const response = await fetch("/api/trial-lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.errors ?? {});
        setStatus({ type: "error", message: result.message ?? "Не вдалося надіслати заявку." });
        return;
      }
      setStatus({ type: "success", message: result.message });
      setForm({ name: "", email: "", phone: "", courseId: "", preferredDate: "", note: "" });
      setErrors({});
    } catch {
      setStatus({ type: "error", message: "Не вдалося зв’язатися із сервером. Спробуйте пізніше." });
    }
  };

  const field = (name, label, props = {}) => (
    <div className={`form-field${errors[name] ? " has-error" : ""}`}>
      <label htmlFor={name}>{label}{props.required && <span aria-hidden="true"> *</span>}</label>
      <input id={name} name={name} value={form[name]} onChange={updateField} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} {...props} />
      {errors[name] && <span className="field-error" id={`${name}-error`}>{errors[name]}</span>}
    </div>
  );

  return (
    <main>
      <section className="booking-section">
        <div className="container booking-grid">
          <div className="booking-aside">
            <Link to="/courses" className="back-link">← До напрямів</Link>
            <span className="eyebrow">ПЕРША ЗУСТРІЧ — ЗА НАМИ</span>
            <h1>Зроби перший<br /><em>крок до музики.</em></h1>
            <p>Заповни коротку форму — ми зателефонуємо, відповімо на запитання та разом оберемо час.</p>
            <div className="booking-promise"><span>♡</span><p><strong>Пробний урок — без зобов’язань.</strong><br />Знайомимося, слухаємо й пробуємо.</p></div>
            <div className="booking-note" aria-hidden="true">♫</div>
          </div>
          <form className="booking-form" onSubmit={submit} noValidate>
            <span className="form-step">ЗАПИС НА ПРОБНИЙ УРОК <span>01 / 01</span></span>
            <h2>Розкажи про себе</h2>
            <p className="form-intro">Поля зі зірочкою обов’язкові для заповнення.</p>
            {status.message && <div className={`form-status ${status.type}`} role={status.type === "error" ? "alert" : "status"}>{status.message}</div>}
            {coursesError && <p className="notice" role="alert">{coursesError}</p>}
            <div className="form-row">
              {field("name", "Твоє ім’я", { type: "text", autoComplete: "name", placeholder: "Наприклад, Олена", required: true, maxLength: 80 })}
              {field("phone", "Номер телефону", { type: "tel", autoComplete: "tel", placeholder: "+380 00 000 00 00", required: true, maxLength: 20 })}
            </div>
            {field("email", "Електронна пошта", { type: "email", autoComplete: "email", placeholder: "name@email.com", required: true, maxLength: 254 })}
            <div className="form-row">
              <div className={`form-field${errors.courseId ? " has-error" : ""}`}>
                <label htmlFor="courseId">Напрям *</label>
                <select id="courseId" name="courseId" value={form.courseId} onChange={updateField} aria-invalid={Boolean(errors.courseId)} aria-describedby={errors.courseId ? "courseId-error" : undefined} required>
                  <option value="">Обери напрям</option>
                  {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                </select>
                {errors.courseId && <span className="field-error" id="courseId-error">{errors.courseId}</span>}
              </div>
              {field("preferredDate", "Бажана дата", { type: "date", min: minDate, required: true })}
            </div>
            <div className={`form-field${errors.note ? " has-error" : ""}`}>
              <label htmlFor="note">Що ще нам варто знати? <span className="optional">(необов’язково)</span></label>
              <textarea id="note" name="note" value={form.note} onChange={updateField} placeholder="Наприклад, який у тебе досвід чи улюблена музика" rows="3" maxLength="500" aria-invalid={Boolean(errors.note)} aria-describedby={errors.note ? "note-error" : undefined} />
              {errors.note && <span className="field-error" id="note-error">{errors.note}</span>}
            </div>
            <button type="submit" className="button button-dark submit-button">Надіслати заявку <span aria-hidden="true">↗</span></button>
            <p className="privacy-note">Надсилаючи форму, ти погоджуєшся на зв’язок щодо пробного уроку.</p>
          </form>
        </div>
      </section>
    </main>
  );
}

function ContactsPage() {
  return (
    <main>
      <section className="page-intro contacts-intro">
        <div className="container"><span className="eyebrow">МИ НА ЗВ’ЯЗКУ</span><h1>Поговорімо<br /><em>про музику.</em></h1><p>Маєш питання чи не знаєш, з чого почати? Напиши або завітай до нас.</p></div>
      </section>
      <section className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-card contact-primary"><span className="contact-icon">✉</span><span className="eyebrow">НАПИШИ НАМ</span><a href="mailto:hello@mriya.music">hello@mriya.music</a><p>Зазвичай відповідаємо протягом дня.</p></div>
          <div className="contact-card"><span className="contact-icon">⌖</span><span className="eyebrow">ЗАВІТАЙ У ГОСТІ</span><strong>Львів, Україна</strong><p>Точну адресу та маршрут надішлемо після запису.</p></div>
          <div className="contact-card"><span className="contact-icon">◷</span><span className="eyebrow">ГРАФІК РОБОТИ</span><strong>Пн — Сб</strong><p>10:00 — 20:00<br />За попереднім записом.</p></div>
        </div>
      </section>
      <section className="contact-cta"><div className="container contact-cta-inner"><div><span className="eyebrow">НАВІТЬ ЯКЩО ТИ ЩЕ НЕ ГРАЄШ</span><h2>Тут тобі раді.</h2></div><Link to="/booking" className="button button-dark">Записатися на урок <span aria-hidden="true">↗</span></Link></div></section>
    </main>
  );
}

function NotFound() {
  return <main className="empty-state"><div><span className="eyebrow">404 · СТОРІНКУ НЕ ЗНАЙДЕНО</span><h1>Здається, ця нота загубилася.</h1><Link to="/" className="button button-dark">На головну</Link></div></main>;
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">Перейти до основного вмісту</a>
      <Header />
      <div id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
