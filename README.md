# Stallion Study

A self-paced study app modeling Mansfield ISD's Early College High School (ECHS) program at Timberview / TCC Southeast Campus — four grade-level tabs (9–12), each listing that year's course load, with courses broken into units → lessons → key terms → practice questions.

See `BUILD_PLAN.md` for the full research, curriculum, data model, and phased build plan this app is built from.

## Stack

- React + Vite, Tailwind CSS v4
- React Router for navigation
- Static JSON course content in `src/data/`
- LocalStorage-backed lesson-completion tracking (no backend/login for v1)

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run lint     # oxlint
```

## Project layout

- `src/data/` — `config.json` (endorsement/track config), `gradesMeta.json`, and `grade9.json`–`grade12.json` (course content, one array of Course objects per grade)
- `src/lib/progress.js` — LocalStorage progress tracking helpers
- `src/components/` — `Nav`, `CourseCard`, `CreditBadge`, `ProgressRing`
- `src/pages/` — `Home`, `GradeTab`, `CoursePage`, `LessonPage`

## Status

- **Phase 0 (scaffold)** — done: app shell, routing, data model, all 4 grades' course shells.
- **Phase 1 (Grade 9 content)** — done: full TEKS-aligned units/lessons/practice questions for all 8 Grade 9 courses.
- **Phase 2–4** (Grades 10–12 content, transcript/GPA system, search/flashcard polish) — not yet built.
