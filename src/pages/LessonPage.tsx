import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import topicsData from '../data/topics.json'
import { useProgress } from '../hooks/useProgress'
import { getEmbedUrl } from '../utils/youtube'
import { getSubjectColor } from '../utils/subjects'
import ImportanceBadge from '../components/ImportanceBadge'
import type { Topic, TopicProgress } from '../types'

interface Props {
  mode: 'week' | 'subject'
}

export default function LessonPage({ mode }: Props) {
  const params = useParams()
  const navigate = useNavigate()
  const { getTopicProgress, updateProgress } = useProgress()

  const allTopics = topicsData.topics as Topic[]

  const filtered =
    mode === 'week'
      ? allTopics.filter(t => t.week === Number(params.week))
      : allTopics.filter(t => t.subject === decodeURIComponent(params.subject ?? ''))

  const [selectedId, setSelectedId] = useState<string>(filtered[0]?.id ?? '')

  // Reset selection when route changes
  useEffect(() => {
    if (filtered.length > 0) setSelectedId(filtered[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.week, params.subject])

  const selected = filtered.find(t => t.id === selectedId) ?? filtered[0]

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center flex-1 text-sm" style={{ color: '#7a7590' }}>
        Nenhum tópico encontrado.
      </div>
    )
  }

  const backPath = mode === 'week' ? '/semanas' : '/materias'
  const crumbLabel =
    mode === 'week'
      ? `Semana ${params.week}`
      : decodeURIComponent(params.subject ?? '')

  // const color = selected ? getSubjectColor(selected.subject) : '#e8a020'

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Breadcrumb */}
      <div
        className="flex items-center gap-2 px-5 py-3 border-b text-sm shrink-0"
        style={{ borderColor: '#252538', color: '#7a7590' }}
      >
        <button
          onClick={() => navigate(backPath)}
          className="transition-colors hover:underline"
          style={{ color: '#7a7590' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#e8a020')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#7a7590')}
        >
          {mode === 'week' ? 'Semanas' : 'Matérias'}
        </button>
        <span style={{ color: '#3e3c52' }}>/</span>
        <span style={{ color: '#ece9e0' }}>{crumbLabel}</span>
        {mode === 'subject' && selected && (
          <>
            <span style={{ color: '#3e3c52' }}>/</span>
            <span style={{ color: '#e8a020' }}>Semana {selected.week}</span>
          </>
        )}
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: Video + info ── */}
        <div
          className="flex-1 flex flex-col gap-5 overflow-y-auto p-6"
          style={{ background: '#0d0d12' }}
        >
          {selected && (
            <>
              {/* YouTube embed */}
              <div className="yt-wrap">
                <iframe
                  key={selected.id}
                  src={getEmbedUrl(selected.videoUrl)}
                  title={selected.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Topic info */}
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex-1 min-w-0">
                  {/* badges */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded-md"
                      style={{
                        background: getSubjectColor(selected.subject) + '1a',
                        color: getSubjectColor(selected.subject),
                      }}
                    >
                      {selected.subject}
                    </span>
                    <ImportanceBadge importance={selected.importance} />
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded-md"
                      style={{ background: '#1c1c28', color: '#7a7590' }}
                    >
                      Semana {selected.week}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl leading-snug" style={{ color: '#ece9e0' }}>
                    {selected.title}
                  </h2>
                  {selected.tags && selected.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {selected.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: '#1c1c28', color: '#7a7590' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {selected.exerciseListUrl && (
                  <a
                    href={selected.exerciseListUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs border rounded-lg px-3 py-1.5 transition-colors shrink-0"
                    style={{ color: '#e8a020', borderColor: '#e8a02033' }}
                    onMouseEnter={e => {
                      ;(e.currentTarget as HTMLElement).style.background = '#e8a02015'
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLElement).style.background = ''
                    }}
                  >
                    Lista de exercícios →
                  </a>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Right: Topic list ── */}
        <div
          className="flex flex-col border-l overflow-hidden shrink-0"
          style={{
            width: 320,
            background: '#13131c',
            borderColor: '#252538',
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 border-b shrink-0"
            style={{ borderColor: '#252538' }}
          >
            <div
              className="font-mono text-[10px] uppercase tracking-widest mb-0.5"
              style={{ color: '#3e3c52' }}
            >
              {mode === 'week' ? `Semana ${params.week}` : decodeURIComponent(params.subject ?? '')}
            </div>
            <div className="text-sm" style={{ color: '#ece9e0' }}>
              {filtered.length} tópico{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Topic items */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map(topic => {
              const prog = getTopicProgress(topic.id)
              const count = [prog.exercises, prog.review1, prog.review2].filter(Boolean).length
              const isSelected = topic.id === selectedId

              return (
                <TopicRow
                  key={topic.id}
                  topic={topic}
                  progress={prog}
                  completedCount={count}
                  isSelected={isSelected}
                  showSubject={mode === 'week'}
                  showWeek={mode === 'subject'}
                  onSelect={() => setSelectedId(topic.id)}
                  onCheck={(field, val) => updateProgress(topic.id, field, val)}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── TopicRow ── */
interface RowProps {
  topic: Topic
  progress: TopicProgress
  completedCount: number
  isSelected: boolean
  showSubject: boolean
  showWeek: boolean
  onSelect: () => void
  onCheck: (field: keyof TopicProgress, val: boolean) => void
}

function TopicRow({
  topic,
  progress,
  completedCount,
  isSelected,
  showSubject,
  showWeek,
  onSelect,
  onCheck,
}: RowProps) {
  const allDone = completedCount === 3

  return (
    <div
      className="border-b transition-colors"
      style={{
        borderColor: '#252538',
        background: isSelected ? '#1c1c28' : 'transparent',
      }}
    >
      {/* Clickable title area */}
      <div
        className="px-4 pt-3 pb-2 cursor-pointer"
        onClick={onSelect}
        style={{ borderLeft: isSelected ? `2px solid ${getSubjectColor(topic.subject)}` : '2px solid transparent' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <ImportanceBadge importance={topic.importance} small />
              {showSubject && (
                <span
                  className="text-[10px] font-mono px-1.5 py-px rounded"
                  style={{
                    background: getSubjectColor(topic.subject) + '1a',
                    color: getSubjectColor(topic.subject),
                  }}
                >
                  {topic.subject}
                </span>
              )}
              {showWeek && (
                <span
                  className="text-[10px] font-mono px-1.5 py-px rounded"
                  style={{ background: '#1c1c28', color: '#7a7590' }}
                >
                  S{topic.week}
                </span>
              )}
            </div>
            <p
              className="text-sm leading-snug"
              style={{ color: isSelected ? '#ece9e0' : '#aca8c0' }}
            >
              {topic.title}
            </p>
          </div>
          <span
            className="font-mono text-xs shrink-0 mt-1"
            style={{ color: allDone ? '#4ade80' : '#3e3c52' }}
          >
            {allDone ? '✓' : `${completedCount}/3`}
          </span>
        </div>
      </div>

      {/* Checkboxes */}
      <div
        className="flex gap-1.5 px-4 pb-3"
        onClick={e => e.stopPropagation()}
      >
        {(
          [
            { field: 'exercises', label: 'Exercícios' },
            { field: 'review1',   label: 'Revisão 1'  },
            { field: 'review2',   label: 'Revisão 2'  },
          ] as { field: keyof TopicProgress; label: string }[]
        ).map(({ field, label }) => {
          const checked = progress[field]
          return (
            <label
              key={field}
              className="flex items-center gap-1 text-[11px] rounded-md px-2 py-1 cursor-pointer transition-all"
              style={{
                background: checked ? '#22c55e1a' : '#1c1c28',
                color: checked ? '#4ade80' : '#7a7590',
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={e => onCheck(field, e.target.checked)}
                className="hidden"
              />
              <span>{checked ? '✓' : '○'}</span>
              <span>{label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
