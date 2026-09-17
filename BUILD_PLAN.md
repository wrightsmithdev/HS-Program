# Build Plan: "Stallion Study" — A 4-Year Accelerated High School Curriculum App
**Modeled on Mansfield ISD Early College High School (ECHS) at Timberview / TCC Southeast Campus, Mansfield, TX**

This is a hand-off document for Claude Code. It contains the research, the grade-by-grade curriculum, the data model, the app architecture, and a phased build order.

---

## 0. What this app is

A self-paced study app with **four grade-level tabs (9, 10, 11, 12)**. Each tab lists that year's course load. Each course opens into units → lessons → practice questions → resources, so a student (or a parent) can see and work through "everything you'd learn" in that class, at the pace of Mansfield ISD's **Early College High School (ECHS)** — the district's honors/dual-credit accelerated pathway — rather than the regular track.

Because ECHS is a *real, specific campus* with a real partnership (Mansfield ISD + Tarrant County College Southeast Campus, TCCD), the plan below reproduces its actual structure as closely as public information allows, and is explicit about where I filled gaps with the standard MISD "Advanced/Pre-AP" sequence rather than confirmed ECHS-only data.

---

## 1. Research summary (what's real, sourced from district/state sites)

### 1.1 Texas graduation law — Foundation High School Program (FHSP), TEA
- **22 credits minimum** to graduate at all (Foundation Plan, no endorsement).
- **26 credits** = Foundation Plan **+ Endorsement** (the normal college-bound path; MISD defaults students here).
- **Distinguished Level of Achievement (DLA)** = the 26 credits, **plus Algebra II** and a 4th math and 4th science credit. DLA is required for Texas's "Top 10%" automatic college admission rule — this is the track an all-advanced ECHS student is on.
- Minimum subject credits (Foundation):
  - **English** – 4 credits (Eng I, II, III, + an advanced/4th English course)
  - **Math** – 3 credits minimum (Algebra I, Geometry, + one advanced math); **4 with endorsement/DLA**, and Algebra II is required for DLA and for most college admissions/financial aid even though it's technically optional at the bare-minimum 22-credit level
  - **Science** – 3 credits minimum (Biology, then IPC/Chemistry/Physics, + one advanced lab science); **4 with endorsement/DLA**
  - **Social Studies** – 3 credits (World Geography *or* World History, US History, US Government [0.5], Economics [0.5])
  - **Languages Other Than English (LOTE)** – 2 credits of the same language (computer programming can substitute)
  - **Fine Arts** – 1 credit
  - **PE** – 1 credit
  - **Electives** – rounds it out to 26
- **Endorsements** (a student picks one, 4+ coherent credits including one advanced course): STEM, Business & Industry, Public Services, Arts & Humanities, Multidisciplinary Studies.
- Weighted GPA: MISD adds **+10 points** to the numeric average for AP, Pre-AP/Advanced, and approved TCC dual-credit courses.

### 1.2 Mansfield ISD Early College High School (ECHS) — the real campus
- Full name: **TCC Southeast / Mansfield ISD Early College High School at Timberview**. Opened Fall 2017 with a 9th-grade class only, adding a grade each year.
- Mailing address used by the campus: 7700 S. Watson Road, Arlington, TX 76002 (Timberview High School's address — ECHS occupies a dedicated wing of Timberview).
- **Mission**: "develop scholars, thoughtful leaders and engaged citizens to earn their high school diploma and up to sixty hours of college credit and/or associate's degree."
- **Structure**:
  - **9th & 10th grade** — students attend **ECHS-only classes in a wing of Timberview High School**, but have full access to Timberview's clubs/activities.
  - **11th & 12th grade** — students physically attend classes **at TCC Southeast Campus**, blended in with TCC's regular college students (not an ECHS-only classroom). MISD teachers also teach some MISD-required classes on the TCC SE campus.
- Students work toward an **Associate of Arts (AA)** or **Associate of Science (AS)** degree from Tarrant County College alongside the diploma.
- Support model: **AVID** instructional strategies + mentorship throughout all 4 years; students get TCC library, Math Lab, and Reading/Writing Center access.
- Enrollment is small — roughly 300 students across all 4 grades — reflecting the cohort/college-going culture the app should evoke (mentorship, "think/act/lead like a college student").
- District-wide dual-credit rules that apply to ECHS students too: TSI-met testing required before TCC enrollment, an 80+ overall average and 12+ earned high school credits are the standard gate for TCC coursework, TCC courses count as honors-weighted (+10), and MISD supplies the TCC textbooks.

### 1.3 What I could not confirm publicly
Mansfield ISD does not publish a granular, locked "Grade 9 = these exact 5 courses" master schedule for ECHS specifically — that level of detail sits in the counselor-issued 4-year plan each student gets. So the course lists in Section 2 combine:
- **Confirmed structural facts** above (9th/10th on the Timberview ECHS wing, no TCC-campus attendance until 11th; associate-degree-track electives; AVID).
- **The state-mandated FHSP/DLA subject sequence** (Section 1.1), which is fixed by law regardless of campus.
- **The "Advanced" course names** (Advanced English 1, Advanced Geometry, World Geography, Advanced Biology in 9th), which match MISD's actual naming convention for its honors-level courses district-wide (MISD calls its honors track "Advanced" rather than "Honors").
- One adjustment: **TCC Theatre as a 9th-grade course** does not match confirmed ECHS policy — actual TCC (dual-credit) coursework at ECHS begins no earlier than 10th grade district-wide, and ECHS 9th/10th graders take ECHS-only (not TCC-campus) classes. Theatre is kept in **9th grade as "Theatre Arts I (Advanced/Fine Arts credit)"**, with the first real dual-credit TCC course (**TCC Theatre Appreciation, THEA 1310**) moved to **10th grade**, where it satisfies both the Fine Arts requirement and starts the AA/AS elective credit. This is a config value (`tccStartGrade: 10`) so it's a one-line change if paperwork shows otherwise for the current catalog year.

---

## 2. The 4-year course plan (what the app's grade tabs contain)

> **This section was rewritten from the official "TCC SE Mansfield Early College HS Course Crosswalk" (PEIMS Code Edition, March 2022)**, provided directly by a current/former ECHS student — superseding all speculative research and every prior verbal correction in this section. The crosswalk is the source of truth for course names, PEIMS codes, and the semester-by-semester (fall/spring) structure below.
>
> A second official document, the district's "TCC Southeast Mansfield Early College High School at Timberview Course Crosswalk Plan" (older, watermarked SAMPLE, `mansfieldisd.org`), was also found and cross-checked. It confirmed that genuine same-subject fall/spring sequences (English Composition, British Literature, US History, Spanish I/II) are tracked as **one course with Fall/Spring tabs** rather than two separate course entries, and that **Speech (SPCH 1315) and Theatre (DRAM 1310) are two independently-required 9th-grade courses** (they satisfy two different graduation-requirement rows: a dedicated 0.5-credit Speech requirement and the 1-credit Fine Arts requirement) — not a choice between them, and not a fall/spring pair. Where the two documents disagreed (e.g., whether 11th/12th Social Studies is a 3-way choice or two separate mandatory half-credits, and whether 12th grade has its own science course), the more recent PEIMS-code crosswalk was treated as authoritative per direct confirmation.

Endorsement assumed: **STEM** (config value, swappable). Target: **Distinguished Level of Achievement**.

PE is intentionally not tracked as an app course/tab: it's satisfied through the district's self-paced **Online Academics** option (also listed as one of several choices in the Grade 10 Social Studies slot below), and isn't something students need study content for.

### Grade 9 — "Freshman Year"
| Subject | Course | Credit type |
|---|---|---|
| English | Advanced English I (or English II, if already advanced) | State core |
| Math | Advanced Geometry A + B (or Algebra I, if not yet completed) — two 0.5-credit semester courses | State core |
| Science | Advanced Biology | State core |
| Social Studies | World Geography (on-level, not Advanced) | State core |
| AVID/Advisory | AVID I | ECHS program requirement |
| Fine Arts / Elective — **choice** | TCC Introduction to Theatre (DRAM 1310, PEIMS 03251000) *or* TCC Public Speaking (SPCH 1315, PEIMS 13009900/03241100) | Dual credit — Fine Arts/elective + AA/AS elective |

### Grade 10 — "Sophomore Year"
| Subject | Course | Credit type |
|---|---|---|
| English | Advanced English II (or III) | State core |
| Math | Geometry or Advanced Algebra II | State core |
| Science | Advanced Chemistry | State core |
| AVID/Advisory | AVID II | ECHS program requirement |
| LOTE/Dual Credit (Fall) | TCC Spanish I (SPAN 1411, PEIMS 03440100, embedded MISD instructor) | Dual credit — LOTE + AA/AS elective |
| LOTE/Dual Credit (Spring) | TCC Spanish II (SPAN 1412, PEIMS 03440200, embedded MISD instructor) | Dual credit — completes 2-credit LOTE requirement |
| Social Studies — **choice** (Fall) | TCC US History I (HIST 1301, PEIMS 03340100) *or* SOCI 1301 *or* Online PE | Dual credit — Social Studies + AA/AS core |
| Social Studies — **choice** (Spring) | TCC US History II (HIST 1302, PEIMS 03340200) *or* SOCI 1301 *or* Online PE | Dual credit — Social Studies + AA/AS core |

### Grade 11 — "Junior Year"
| Subject | Course | Credit type |
|---|---|---|
| AVID/Advisory | AVID III | ECHS program requirement |
| English/Dual Credit (Fall) | TCC English Composition I (ENGL 1301, PEIMS 03220300) | English requirement + AA/AS core |
| English/Dual Credit (Spring) | TCC English Composition II (ENGL 1302, PEIMS 03220300) | English requirement + AA/AS core |
| Math — **choice** (Fall) | MATH 1314 College Algebra *or* MATH 1342 Elementary Statistics *or* MATH 1324 Business/Social Sciences Math *or* MATH 1332 Contemporary Math | Dual credit — 4th math credit + AA/AS core |
| Math — **choice** (Spring, adds Precalc) | Same list as fall, plus MATH 2412 Precalculus | Dual credit — 4th math credit + AA/AS core |
| Science — **choice** (Fall) | BIOL 1406 Biology (Science Majors) *or* BIOL 1408 (Non-Science) *or* GEOL 1401 Earth Science *or* PHYS 1401 College Physics | Dual credit — 4th science credit + AA/AS core |
| Science — **choice** (Spring) | BIOL 1407 *or* BIOL 1409 *or* GEOL 1401 *or* PHYS 1401 (completes the 2-semester lab science sequence) | Dual credit — 4th science credit + AA/AS core |
| Social Studies/Elective — **choice** (same all year) | GOVT 2306 Texas Government *or* KINE 1164 Kinesiology Activity *or* PSYC 2301 Psychology | Dual credit — Social Studies/elective + AA/AS core |

### Grade 12 — "Senior Year"
| Subject | Course | Credit type |
|---|---|---|
| AVID/Advisory | AVID IV | ECHS program requirement |
| English/Dual Credit (Fall) | TCC English Literature I (ENGL 2322, PEIMS 03220400) | Completes English 4-credit requirement |
| English/Dual Credit (Spring) | TCC English Literature II (ENGL 2323, PEIMS 03220400) | Completes English 4-credit requirement |
| Math — **choice** (same all year, adds Calculus) | MATH 2413 Calculus I *or* MATH 1314 *or* MATH 2412 *or* MATH 1342 *or* MATH 1324 *or* MATH 1332 | Advanced math elective |
| Social Studies/Elective — **choice** | GOVT 2305 Federal Government *or* ECON 2301 Economics | Dual credit — Social Studies + AA/AS core |
| Social Studies/Elective — **choice** (repeated from 11th) | GOVT 2306 Texas Government *or* KINE 1164 *or* PSYC 2301 | Dual credit — Social Studies/elective + AA/AS core |
| Capstone | AA or AS Degree Completion + Diploma | AA needs 18 TCC elective hours + 1 TCC math course; AS needs 18 TCC Math/Science/Engineering/CS hours + Algebra I credit entering 9th grade |

> Several credits above are a **choice of one course from a short list** — a real degree-plan pattern, not unique to this app. The data model tracks one representative course per slot plus an `alternatives` array (title + PEIMS code) shown on that course's page. The app's **Majors & Career Paths** section (a banner above the grade tabs) recommends which option to pick at each choice point based on the student's intended college major (Engineering, Social Sciences, Math, Science, Politics/Law, Business).

---

## 3. Content sourcing rule

**Do not scrape or reproduce Mansfield ISD's, TCC's, or any publisher's actual course materials, textbooks, or STAAR/EOC items.** Those are copyrighted and in some cases security-restricted (STAAR items specifically are legally protected test content). All "what's taught in this course" content is built from:
- **TEKS** (Texas Essential Knowledge and Skills) — the public, legal curriculum standards per course/subject (tea.texas.gov).
- **OpenStax** (openstax.org) — free, openly licensed textbooks for conceptual reference.
- **CK-12** (ck12.org) — free K-12 aligned content, secondary reference for math/science.
- **TCC's public course descriptions** (catalog.tccd.edu) — course titles/credit hours/prerequisites only, no verbatim syllabus copying.

All lesson summaries, key term definitions, and practice questions in this app are original text, not copied from any of the above.

---

## 4. App architecture

### 4.1 Stack
- **Frontend**: React (Vite) + Tailwind CSS.
- **Content**: Static JSON content files per grade (`src/data/grade9.json`–`grade12.json`), not a database.
- **State**: LocalStorage for progress tracking (completed lessons) — per-device, no login required for v1.
- **No backend for v1.**

### 4.2 Data model

```
src/data/config.json          — endorsement, diplomaTrack, tccStartGrade, lotePlan
src/data/gradesMeta.json      — grade label/location/description
src/data/grade9.json..grade12.json — array of Course objects:

Course {
  id, title, subjectArea, creditType ("state-core"|"dual-credit"|"elective"|"program"),
  credits, weighted, collegeCreditHours?, stateCourseStandard, description,
  units: [
    { id, title, lessons: [ { id, title, summary, keyTerms[], practiceQuestions[] } ] }
  ]
}
```

### 4.3 Screens
1. **Home** — 4 grade tabs, overall progress ring, track/endorsement summary.
2. **Grade tab** — course cards for that year (subject icon, credit type badge, % complete).
3. **Course page** — unit accordion → lesson list.
4. **Lesson page** — summary, key terms, practice questions with instant feedback, mark-complete.
5. **Progress / Transcript view** *(future phase)* — credits by subject, weighted GPA, endorsement tracker, TCC credit-hour counter.
6. **Settings** *(future phase)* — toggle endorsement track / config values.

---

## 5. Build phases

- **Phase 0 — Scaffold**: Vite+React+Tailwind project, data model files (course shells for all ~30 courses across 4 grades), Home/Grade tab/Course page/Lesson page as static routes.
- **Phase 1 — Fill Grade 9 content**: TEKS-aligned units (5 units/course), 3 lessons/unit, key terms + 4-5 practice questions per lesson, sourced per §3.
- **Phase 2 — Fill Grade 10, then 11, then 12** (repeat Phase 1's process per grade).
- **Phase 3 — Progress & transcript system**: LocalStorage-backed completion tracking, transcript view computing credits/GPA/endorsement/TCC-hours.
- **Phase 4 — Polish**: search across courses/lessons, flashcard/quiz mode, print-friendly transcript export.

---

## 6. Sources used for this plan
- Mansfield ISD ECHS official site (echs.mansfieldisd.org) — About Us, History/Facts, Academics
- TCC News: "Mansfield Early College High School is Off to a Great Start" (news.tccd.edu)
- Mansfield ISD ECHS Recruitment FAQ PDF (resources.finalsite.net)
- Mansfield ISD Dual Credit pages (mansfieldisd.org/ccmr/dual-credit)
- Mansfield ISD Course Guides & Graduation Requirements page (mansfieldisd.org/departments/guidance-counseling/course-guides-grad-reqs)
- Texas Education Agency, 2025 Graduation Toolkit (tea.texas.gov)
- TEA 19 TAC Chapter 74 Curriculum Requirements (tea.texas.gov)
