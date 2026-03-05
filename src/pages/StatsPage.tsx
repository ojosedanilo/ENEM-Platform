import topicsData from '../data/topics.json'
import { useProgress } from '../hooks/useProgress'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { getSubjectColor } from '../utils/subjects'
import type { Importance } from '../types'

const IMPORTANCE_COLORS: Record<Importance, string> = {
  alta:   '#f87171',
  'média':'#fbbf24',
  baixa:  '#4ade80',
}

export default function StatsPage() {
  const topics = topicsData.topics
  const { getCompletionCount } = useProgress()

  /* ── Overall ── */
  const totalChecks = topics.length * 3
  const completedChecks = topics.reduce((acc, t) => acc + getCompletionCount(t.id), 0)
  const overallPct = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0
  const topicsDone = topics.filter(t => getCompletionCount(t.id) === 3).length

  /* ── By week (1-25) ── */
  const weekData = Array.from({ length: 25 }, (_, i) => {
    const week = i + 1
    const wt = topics.filter(t => t.week === week)
    if (wt.length === 0) return { name: `S${week}`, pct: 0, active: false }
    const done = wt.reduce((a, t) => a + getCompletionCount(t.id), 0)
    return {
      name: `S${week}`,
      pct: Math.round((done / (wt.length * 3)) * 100),
      active: true,
    }
  })

  /* ── By subject ── */
  const subjects = [...new Set(topics.map(t => t.subject))].sort()
  const subjectData = subjects.map(s => {
    const st = topics.filter(t => t.subject === s)
    const done = st.reduce((a, t) => a + getCompletionCount(t.id), 0)
    return {
      name: s,
      pct: st.length > 0 ? Math.round((done / (st.length * 3)) * 100) : 0,
      color: getSubjectColor(s),
      count: st.length,
    }
  })

  /* ── By importance ── */
  const importanceData = (['alta', 'média', 'baixa'] as Importance[]).map(imp => {
    const it = topics.filter(t => t.importance === imp)
    const done = it.reduce((a, t) => a + getCompletionCount(t.id), 0)
    return {
      name: imp.charAt(0).toUpperCase() + imp.slice(1),
      value: it.length,
      pct: it.length > 0 ? Math.round((done / (it.length * 3)) * 100) : 0,
      color: IMPORTANCE_COLORS[imp],
    }
  })

  /* ── Tooltip style ── */
  const tooltipStyle = {
    contentStyle: {
      background: '#1c1c28',
      border: '1px solid #252538',
      borderRadius: 8,
      color: '#ece9e0',
      fontSize: 12,
    },
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl mx-auto w-full">
      <h1 className="font-display text-3xl mb-8" style={{ color: '#ece9e0' }}>
        Estatísticas
      </h1>

      {/* ── Overall ── */}
      <Card className="mb-5">
        <h2 className="font-display text-xl mb-5" style={{ color: '#ece9e0' }}>
          Progresso Geral
        </h2>
        <div className="flex items-end gap-6 flex-wrap">
          <div className="font-mono font-bold" style={{ fontSize: 64, lineHeight: 1, color: '#e8a020' }}>
            {overallPct}%
          </div>
          <div className="flex-1 min-w-48 pb-1">
            <div
              className="flex justify-between text-xs mb-1.5 font-mono"
              style={{ color: '#7a7590' }}
            >
              <span>{completedChecks} de {totalChecks} verificações</span>
              <span>{topicsDone}/{topics.length} tópicos completos</span>
            </div>
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ background: '#1c1c28' }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${overallPct}%`, background: '#e8a020' }}
              />
            </div>
          </div>
        </div>

        {/* Mini stats row */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { label: 'Tópicos',    value: topics.length },
            { label: 'Matérias',   value: subjects.length },
            { label: 'Completos',  value: topicsDone },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg p-3 text-center"
              style={{ background: '#1c1c28' }}
            >
              <div className="font-mono font-bold text-2xl" style={{ color: '#ece9e0' }}>
                {value}
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#7a7590' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── By week ── */}
      <Card className="mb-5">
        <h2 className="font-display text-xl mb-5" style={{ color: '#ece9e0' }}>
          Conclusão por Semana
        </h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weekData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: '#3e3c52', fontSize: 9 }}
              interval={4}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#3e3c52', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(v: number) => [`${v}%`, 'Conclusão']}
            />
            <Bar dataKey="pct" radius={[3, 3, 0, 0]}>
              {weekData.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={entry.active ? '#e8a020' : '#1c1c28'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ── Subject + Importance side by side ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* By subject */}
        <Card>
          <h2 className="font-display text-xl mb-4" style={{ color: '#ece9e0' }}>
            Por Matéria
          </h2>
          <div className="space-y-3">
            {subjectData.map(({ name, pct, color, count }) => (
              <div key={name}>
                <div
                  className="flex justify-between text-xs mb-1"
                  style={{ color: '#ece9e0' }}
                >
                  <span>{name}</span>
                  <span className="font-mono" style={{ color: '#7a7590' }}>
                    {pct}%{' '}
                    <span style={{ color: '#3e3c52' }}>({count}t)</span>
                  </span>
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
            ))}
          </div>
        </Card>

        {/* By importance */}
        <Card>
          <h2 className="font-display text-xl mb-4" style={{ color: '#ece9e0' }}>
            Por Importância
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={importanceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={72}
                paddingAngle={3}
              >
                {importanceData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                {...tooltipStyle}
                formatter={(v: number, name: string) => [`${v} tópicos`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-1">
            {importanceData.map(entry => (
              <div
                key={entry.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span style={{ color: '#ece9e0' }}>{entry.name}</span>
                </div>
                <div className="font-mono text-xs" style={{ color: '#7a7590' }}>
                  {entry.value}t ·{' '}
                  <span style={{ color: entry.color }}>{entry.pct}% ✓</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ── Reusable card wrapper ── */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-6 border ${className}`}
      style={{ background: '#13131c', borderColor: '#252538' }}
    >
      {children}
    </div>
  )
}
