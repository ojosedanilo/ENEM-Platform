import { Link } from 'react-router-dom'
import topicsData from '../data/topics.json'
import { useProgress } from '../hooks/useProgress'
import { getUniqueSubjectsByColor, getSubjectMeta } from '../utils/subjects'

export default function WeeksPage() {
  const topics = topicsData.topics
  const { getCompletionCount } = useProgress()

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto w-full">
      <h1 className="font-display text-3xl mb-8" style={{ color: '#ece9e0' }}>
        Semanas
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 25 }, (_, i) => i + 1).map(week => {
          const weekTopics = topics.filter(t => t.week === week)
          const hasTopics = weekTopics.length > 0
          const totalChecks = weekTopics.length * 3
          const completedChecks = weekTopics.reduce(
            (acc, t) => acc + getCompletionCount(t.id),
            0,
          )
          const pct = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0
          const done = pct === 100 && hasTopics
          const subjects = [...new Set(weekTopics.map(t => t.subject))]
          const uniqueSubjects = getUniqueSubjectsByColor(subjects)

          const card = (
            <div
              className="rounded-xl p-4 border transition-all duration-200 select-none"
              style={{
                background: '#13131c',
                borderColor: done ? '#22c55e44' : '#252538',
                opacity: hasTopics ? 1 : 0.35,
                cursor: hasTopics ? 'pointer' : 'default',
              }}
              onMouseEnter={e => {
                if (!hasTopics) return
                ;(e.currentTarget as HTMLElement).style.borderColor = '#e8a02055'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = done ? '#22c55e44' : '#252538'
                ;(e.currentTarget as HTMLElement).style.transform = ''
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#3e3c52' }}>
                  sem.
                </span>
                {done && (
                  <span className="text-xs" style={{ color: '#4ade80' }}>
                    ✓
                  </span>
                )}
              </div>

              {/* Week number */}
              <div className="font-display text-3xl mb-2" style={{ color: '#ece9e0' }}>
                {week}
              </div>

              {hasTopics ? (
                <>
                  <p className="text-xs mb-2" style={{ color: '#7a7590' }}>
                    {weekTopics.length} tópico{weekTopics.length !== 1 ? 's' : ''}
                  </p>
                  {/* Progress bar */}
                  <div
                    className="h-1 rounded-full overflow-hidden mb-2.5"
                    style={{ background: '#1c1c28' }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: done ? '#4ade80' : '#e8a020',
                      }}
                    />
                  </div>
                  {/* Subject dots */}
                  <div className="flex gap-1 flex-wrap">
                    {uniqueSubjects.slice(0, 4).map(s => (
                      <span
                        key={s}
                        className="w-2 h-2 rounded-full"
                        title={s}
                        style={{ backgroundColor: getSubjectMeta(s).color }}
                      />
                    ))}
                  
                    {uniqueSubjects.length > 4 && (
                      <span className="text-[10px]" style={{ color: '#3e3c52' }}>
                        +{uniqueSubjects.length - 4}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-[11px]" style={{ color: '#3e3c52' }}>
                  em breve
                </p>
              )}
            </div>
          )

          return hasTopics ? (
            <Link key={week} to={`/semanas/${week}`} className="block">
              {card}
            </Link>
          ) : (
            <div key={week}>{card}</div>
          )
        })}
      </div>
    </div>
  )
}
