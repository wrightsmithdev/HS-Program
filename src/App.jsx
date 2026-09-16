import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import GradeTab from './pages/GradeTab'
import CoursePage from './pages/CoursePage'
import LessonPage from './pages/LessonPage'
import TestPage from './pages/TestPage'

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-center">
      <p className="text-slate-600 dark:text-slate-300">Page not found.</p>
      <Link to="/" className="text-indigo-600 hover:underline dark:text-indigo-400">
        Back home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/grade/:grade" element={<GradeTab />} />
          <Route path="/grade/:grade/course/:courseId" element={<CoursePage />} />
          <Route path="/grade/:grade/course/:courseId/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/grade/:grade/course/:courseId/test" element={<TestPage />} />
          <Route path="/grade/:grade/course/:courseId/test/unit/:unitId" element={<TestPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
