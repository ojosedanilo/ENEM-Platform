import { Link } from 'react-router-dom'
import topicsData from '../data/topics.json'
import { useProgress } from '../hooks/useProgress'
import { getSubjectColor, getSubjectIcon } from '../utils/subjects'

export default function SubjectsPage() {
  const topics = topicsData.topics
  const { getCompletionCount } = useProgress()

  const subjects = [...new Set(topics.map(t => t.subject))].sort()

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 max-w-6xl mx-auto w-full">
      <h1 className="font-display text-3xl mb-8" style={{ color: '#ece9e0' }}>
        Matérias
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(subject => {
          const st = topics.filter(t => t.subject === subject)
          const total = st.length * 3
          const completed = st.reduce((acc, t) => acc + getCompletionCount(t.id), 0)
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0
          const color = getSubjectColor(subject)
          const icon = getSubjectIcon(subject)
          const weeks = [...new Set(st.map(t => t.week))]

          return (
            <Link
              key={subject}
              to={`/materias/${encodeURIComponent(subject)}`}
              className="block group"
            >
              <div
                className="rounded-xl p-5 border transition-all duration-200"
                style={{ background: '#13131c', borderColor: '#252538' }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = color + '55'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = `0 16px 32px ${color}0d`
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#252538'
                  ;(e.currentTarget as HTMLElement).style.transform = ''
                  ;(e.currentTarget as HTMLElement).style.boxShadow = ''
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div
                      className="text-2xl mb-2 w-9 h-9 flex items-center justify-center rounded-lg"
                      style={{ background: color + '18', color }}
                    >
                      {icon}
                    </div>
                    <h2 className="font-display text-xl" style={{ color: '#ece9e0' }}>
                      {subject}
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: '#7a7590' }}>
                      {st.length} tópico{st.length !== 1 ? 's' : ''} · {weeks.length} semana{weeks.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-2xl" style={{ color }}>
                      {pct}%
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: '#3e3c52' }}>
                      concluído
                    </div>
                  </div>
                </div>

                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: '#1c1c28' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
