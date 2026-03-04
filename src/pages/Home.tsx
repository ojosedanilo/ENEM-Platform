import { Link } from 'react-router-dom'
import topicsData from '../data/topics.json'
import { useProgress } from '../hooks/useProgress'

export default function Home() {
  const { getCompletionCount } = useProgress()
  const topics = topicsData.topics
  const totalChecks = topics.length * 3
  const completedChecks = topics.reduce((acc, t) => acc + getCompletionCount(t.id), 0)
  const overallPct = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0

  const weeksWithTopics = [...new Set(topics.map(t => t.week))].length
  const subjects = [...new Set(topics.map(t => t.subject))].length

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-16 gap-12">

      {/* Hero */}
      <div className="text-center max-w-xl">
        <h1 className="font-display text-5xl leading-tight mb-3" style={{ color: '#ece9e0' }}>
          Sua jornada para o{' '}
          <span style={{ color: '#e8a020' }}>ENEM</span>
        </h1>
        <p className="font-body text-base" style={{ color: '#7a7590' }}>
          25 semanas · {topics.length} tópicos · {subjects} matérias
        </p>

        {/* Overall progress */}
        <div className="mt-8 max-w-sm mx-auto">
          <div
            className="flex justify-between text-xs font-mono mb-2"
            style={{ color: '#7a7590' }}
          >
            <span>progresso geral</span>
            <span style={{ color: '#e8a020' }}>{overallPct}%</span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: '#1c1c28' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${overallPct}%`, background: '#e8a020' }}
            />
          </div>
          <p className="text-xs mt-1.5" style={{ color: '#3e3c52' }}>
            {completedChecks} / {totalChecks} verificações concluídas
          </p>
        </div>
      </div>

      {/* Navigation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
        <NavCard
          to="/semanas"
          emoji="📅"
          title="Por Semana"
          description={`Acompanhe o cronograma semana a semana. ${weeksWithTopics} semanas com conteúdo disponível.`}
          cta="Explorar semanas"
          accentColor="#3b82f6"
        />
        <NavCard
          to="/materias"
          emoji="📚"
          title="Por Matéria"
          description={`Filtre por disciplina e veja todos os tópicos de cada matéria. ${subjects} matérias no total.`}
          cta="Explorar matérias"
          accentColor="#e8a020"
        />
      </div>

      <Link
        to="/stats"
        className="text-xs font-body transition-colors"
        style={{ color: '#3e3c52' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#e8a020')}
        onMouseLeave={e => (e.currentTarget.style.color = '#3e3c52')}
      >
        ver estatísticas detalhadas →
      </Link>
    </div>
  )
}

interface NavCardProps {
  to: string
  emoji: string
  title: string
  description: string
  cta: string
  accentColor: string
}

function NavCard({ to, emoji, title, description, cta, accentColor }: NavCardProps) {
  return (
    <Link to={to} className="group block" style={{ textDecoration: 'none' }}>
      <div
        className="rounded-2xl p-7 flex flex-col gap-4 border transition-all duration-300 cursor-pointer"
        style={{
          background: '#13131c',
          borderColor: '#252538',
          height: 220,
        }}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLElement).style.borderColor = accentColor + '55'
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px ${accentColor}10`
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLElement).style.borderColor = '#252538'
          ;(e.currentTarget as HTMLElement).style.transform = ''
          ;(e.currentTarget as HTMLElement).style.boxShadow = ''
        }}
      >
        <div style={{ fontSize: 36 }}>{emoji}</div>
        <div>
          <h2 className="font-display text-2xl mb-1.5" style={{ color: '#ece9e0' }}>
            {title}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#7a7590' }}>
            {description}
          </p>
        </div>
        <div
          className="text-sm font-medium flex items-center gap-1.5 mt-auto transition-all duration-200 group-hover:gap-2.5"
          style={{ color: accentColor }}
        >
          {cta} <span>→</span>
        </div>
      </div>
    </Link>
  )
}
