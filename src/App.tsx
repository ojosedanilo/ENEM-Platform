import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import WeeksPage from './pages/WeeksPage'
import SubjectsPage from './pages/SubjectsPage'
import LessonPage from './pages/LessonPage'
import StatsPage from './pages/StatsPage'
import PlannerPage from './pages/PlannerPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="semanas" element={<WeeksPage />} />
          <Route path="semanas/:week" element={<LessonPage mode="week" />} />
          <Route path="materias" element={<SubjectsPage />} />
          <Route path="materias/:subject" element={<LessonPage mode="subject" />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="planner" element={<PlannerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
