import { useState, useEffect, useRef } from 'react'

/* ── Constants ── */
const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

const HOURS = Array.from({ length: 18 }, (_, i) => {
  const h = i + 6 // 06:00 → 23:00
  return `${String(h).padStart(2, '0')}:00`
})

const MOODS = [
  { id: 'produtiva',   label: 'Produtiva',   color: '#4ade80', glow: '#4ade8033' },
  { id: 'mediana',     label: 'Mediana',     color: '#facc15', glow: '#facc1533' },
  { id: 'cansativa',   label: 'Cansativa',   color: '#fb923c', glow: '#fb923c33' },
  { id: 'estressante', label: 'Estressante', color: '#f87171', glow: '#f8717133' },
] as const

type MoodId = typeof MOODS[number]['id']

const STORAGE_KEY = 'enem_planner_v1'

interface PlannerData {
  weekOffset: number
  cells: Record<string, string>   // "row-col" → text
  relato: string
  mood: MoodId | null
}

/* ── Helpers ── */
function getMonday(offset = 0): Date {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff + offset * 7)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const fmt = (d: Date) =>
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  return `${fmt(monday)} – ${fmt(sunday)}`
}

/* ── Load / save ── */
function loadAll(): Record<string, PlannerData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveAll(data: Record<string, PlannerData>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

/* ── Cell colors ── */
const CELL_COLORS = [
  { label: 'Sem cor',    bg: 'transparent',  text: 'inherit' },
  { label: 'Azul',       bg: '#3b82f620',    text: '#93c5fd' },
  { label: 'Verde',      bg: '#22c55e20',    text: '#86efac' },
  { label: 'Amarelo',    bg: '#eab30820',    text: '#fde68a' },
  { label: 'Laranja',    bg: '#f9731620',    text: '#fdba74' },
  { label: 'Vermelho',   bg: '#ef444420',    text: '#fca5a5' },
  { label: 'Roxo',       bg: '#a855f720',    text: '#d8b4fe' },
]

/* ── Component ── */
export default function PlannerPage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  const isMobile = windowWidth < 640
  const [all, setAll] = useState<Record<string, PlannerData>>(loadAll)
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ cellKey: string; x: number; y: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const monday = getMonday(weekOffset)
  const weekKey = monday.toISOString().slice(0, 10)

  const current: PlannerData = all[weekKey] ?? {
    weekOffset,
    cells: {},
    relato: '',
    mood: null,
  }

  /* persist whenever all changes */
  useEffect(() => { saveAll(all) }, [all])

  /* focus input when editing */
  useEffect(() => {
    if (editingCell) inputRef.current?.focus()
  }, [editingCell])

  /* close context menu on click outside */
  useEffect(() => {
    const close = () => setContextMenu(null)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [])

  const patch = (partial: Partial<PlannerData>) =>
    setAll(prev => ({
      ...prev,
      [weekKey]: { ...current, ...partial },
    }))

  const setCell = (key: string, value: string) =>
    patch({ cells: { ...current.cells, [key]: value } })

  const setCellColor = (key: string, color: string) => {
    const existing = current.cells[key] ?? ''
    // store color as prefix: "|color|text"
    const text = existing.includes('|COLOR:')
      ? existing.replace(/\|COLOR:[^|]*\|/, '')
      : existing
    patch({ cells: { ...current.cells, [key]: `|COLOR:${color}|${text}` } })
  }

  const getCellText = (raw: string) =>
    raw.replace(/\|COLOR:[^|]*\|/, '')

  const getCellColor = (raw: string): { bg: string; text: string } => {
    const m = raw.match(/\|COLOR:([^|]*)\|/)
    if (!m) return { bg: 'transparent', text: 'inherit' }
    return CELL_COLORS.find(c => c.bg === m[1]) ?? { bg: m[1], text: 'inherit' }
  }

  const dayDates = DAYS.map((_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.getDate()
  })

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden select-none"
      onClick={() => setContextMenu(null)}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b shrink-0"
        style={{ borderColor: '#252538', background: '#0d0d12' }}
      >
        {/* Week nav */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setWeekOffset(w => w - 1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors"
            style={{ background: '#1c1c28', color: '#ece9e0' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#252538')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#1c1c28')}
          >
            ‹
          </button>
          <div className="text-center">
            <div className="text-xs font-mono" style={{ color: '#7a7590' }}>semana</div>
            <div className="text-sm font-body" style={{ color: '#ece9e0' }}>
              {formatWeekRange(monday)}
            </div>
          </div>
          <button
            onClick={() => setWeekOffset(w => w + 1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors"
            style={{ background: '#1c1c28', color: '#ece9e0' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#252538')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#1c1c28')}
          >
            ›
          </button>
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="text-xs px-2 py-1 rounded-lg transition-colors"
              style={{ background: '#1c1c28', color: '#7a7590' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#e8a020')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#7a7590')}
            >
              hoje
            </button>
          )}
        </div>

        {/* Title */}
        <span className="font-display text-lg hidden sm:block" style={{ color: '#ece9e0' }}>
          Planejamento Semanal
        </span>

        {/* Clear week */}
        <button
          onClick={() => {
            if (confirm('Limpar toda a semana?'))
              patch({ cells: {}, relato: '', mood: null })
          }}
          className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
          style={{ borderColor: '#252538', color: '#7a7590' }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLElement).style.borderColor = '#f8717155'
            ;(e.currentTarget as HTMLElement).style.color = '#f87171'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLElement).style.borderColor = '#252538'
            ;(e.currentTarget as HTMLElement).style.color = '#7a7590'
          }}
        >
          Limpar semana
        </button>
      </div>

      {/* ── Main area ── */}
      <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">

        {/* ── Grid + relato ── */}
        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">

          {/* Scrollable grid */}
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse" style={{ minWidth: 600 }}>
              <thead>
                <tr style={{ background: '#13131c' }}>
                  {/* Clock header */}
                  <th
                    className="border text-center align-middle"
                    style={{
                      borderColor: '#252538',
                      width: 56,
                      height: 40,
                      color: '#7a7590',
                      fontSize: 16,
                    }}
                  >
                    ⏱
                  </th>
                  {DAYS.map((day, di) => {
                    const isToday =
                      weekOffset === 0 && new Date().getDay() === (di === 6 ? 0 : di + 1)
                    return (
                      <th
                        key={day}
                        className="border font-body font-semibold text-xs uppercase tracking-widest text-center py-3"
                        style={{
                          borderColor: '#252538',
                          color: isToday ? '#e8a020' : '#ece9e0',
                          background: isToday ? '#e8a02008' : 'transparent',
                        }}
                      >
                        <div>{day}</div>
                        <div
                          className="font-mono font-normal mt-0.5"
                          style={{ color: '#3e3c52', fontSize: 10 }}
                        >
                          {dayDates[di]}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {HOURS.map((hour, ri) => (
                  <tr key={hour}>
                    {/* Hour label */}
                    <td
                      className="border text-center font-mono align-middle shrink-0"
                      style={{
                        borderColor: '#252538',
                        fontSize: 10,
                        color: '#3e3c52',
                        width: 56,
                        background: '#13131c',
                      }}
                    >
                      {hour}
                    </td>
                    {DAYS.map((_, ci) => {
                      const cellKey = `${ri}-${ci}`
                      const raw = current.cells[cellKey] ?? ''
                      const text = getCellText(raw)
                      const { bg, text: textColor } = getCellColor(raw)
                      const isEditing = editingCell === cellKey

                      return (
                        <td
                          key={ci}
                          className="border align-top relative"
                          style={{
                            borderColor: '#252538',
                            height: 36,
                            minWidth: 80,
                            background: bg !== 'transparent' ? bg : '#0d0d12',
                            transition: 'background 0.15s',
                          }}
                          onContextMenu={e => {
                            e.preventDefault()
                            setContextMenu({ cellKey, x: e.clientX, y: e.clientY })
                          }}
                        >
                          {isEditing ? (
                            <input
                              ref={inputRef}
                              value={text}
                              onChange={e => {
                                /*
                                const newRaw = raw.includes('|COLOR:')
                                  ? raw.replace(/\|COLOR:[^|]*\|/, match => match) + e.target.value.replace(/^.*\|/, '')
                                  : e.target.value
                                */
                                // simpler: just store color prefix + new text
                                const colorPrefix = raw.match(/(\|COLOR:[^|]*\|)/)?.[0] ?? ''
                                setCell(cellKey, `${colorPrefix}${e.target.value}`)
                              }}
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === 'Escape') {
                                  setEditingCell(null)
                                }
                                // Tab → next cell
                                if (e.key === 'Tab') {
                                  e.preventDefault()
                                  const nextCol = ci + 1 < DAYS.length ? ci + 1 : 0
                                  const nextRow = ci + 1 < DAYS.length ? ri : ri + 1
                                  if (nextRow < HOURS.length) {
                                    setEditingCell(`${nextRow}-${nextCol}`)
                                  } else {
                                    setEditingCell(null)
                                  }
                                }
                              }}
                              className="w-full h-full px-2 text-xs outline-none bg-transparent"
                              style={{ color: textColor !== 'inherit' ? textColor : '#ece9e0', minHeight: 36 }}
                              placeholder="Digite aqui…"
                            />
                          ) : (
                            <div
                              className="px-2 py-1 text-xs w-full h-full cursor-text overflow-hidden"
                              style={{
                                color: textColor !== 'inherit' ? textColor : (text ? '#ece9e0' : '#3e3c52'),
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                              }}
                              onClick={() => setEditingCell(cellKey)}
                            >
                              {text || ''}
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Relato Semanal ── */}
          <div
            className="flex flex-col border-l border-t sm:border-t-0 shrink-0 overflow-hidden"
            style={{
              borderColor: '#252538',
              background: '#13131c',
              width: isMobile ? '100%' : 220,
              maxHeight: isMobile ? 180 : undefined,
            }}
          >
            <div
              className="px-4 py-3 border-b shrink-0"
              style={{ borderColor: '#252538' }}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#3e3c52' }}>
                Relato Semanal
              </div>
            </div>
            <textarea
              className="flex-1 resize-none text-sm p-4 outline-none font-body leading-relaxed"
              style={{
                background: 'transparent',
                color: '#ece9e0',
                caretColor: '#e8a020',
              }}
              placeholder="Como foi sua semana de estudos? O que conseguiu? O que pode melhorar?"
              value={current.relato}
              onChange={e => patch({ relato: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom bar: Como foi minha semana ── */}
      <div
        className="shrink-0 border-t flex flex-col items-center gap-3 py-4"
        style={{ borderColor: '#252538', background: '#13131c' }}
      >
        <div
          className="font-body font-semibold text-sm uppercase tracking-widest"
          style={{ color: '#ece9e0' }}
        >
          Como foi minha semana
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {MOODS.map(mood => {
            const selected = current.mood === mood.id
            return (
              <button
                key={mood.id}
                onClick={() => patch({ mood: selected ? null : mood.id })}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium font-body transition-all duration-200"
                style={{
                  background: selected ? mood.glow : '#1c1c28',
                  color: selected ? mood.color : '#7a7590',
                  border: `1.5px solid ${selected ? mood.color : '#252538'}`,
                  boxShadow: selected ? `0 0 16px ${mood.color}33` : 'none',
                  transform: selected ? 'scale(1.05)' : 'scale(1)',
                }}
                onMouseEnter={e => {
                  if (!selected) {
                    ;(e.currentTarget as HTMLElement).style.borderColor = mood.color + '66'
                    ;(e.currentTarget as HTMLElement).style.color = mood.color
                  }
                }}
                onMouseLeave={e => {
                  if (!selected) {
                    ;(e.currentTarget as HTMLElement).style.borderColor = '#252538'
                    ;(e.currentTarget as HTMLElement).style.color = '#7a7590'
                  }
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: mood.color }}
                />
                {mood.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Context menu (right-click cell color) ── */}
      {contextMenu && (
        <div
          className="fixed z-50 rounded-xl border p-2 shadow-2xl"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            background: '#1c1c28',
            borderColor: '#252538',
            minWidth: 160,
          }}
          onClick={e => e.stopPropagation()}
        >
          <div className="text-[10px] uppercase tracking-widest px-2 mb-1.5" style={{ color: '#3e3c52' }}>
            Cor da célula
          </div>
          {CELL_COLORS.map(c => (
            <button
              key={c.label}
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition-colors text-left"
              style={{ color: '#ece9e0' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#252538')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              onClick={() => {
                setCellColor(contextMenu.cellKey, c.bg)
                setContextMenu(null)
              }}
            >
              <span
                className="w-3.5 h-3.5 rounded shrink-0 border"
                style={{
                  backgroundColor: c.bg,
                  borderColor: c.text !== 'inherit' ? c.text + '66' : '#252538',
                }}
              />
              {c.label}
            </button>
          ))}
          <div className="border-t my-1.5" style={{ borderColor: '#252538' }} />
          <button
            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition-colors text-left"
            style={{ color: '#f87171' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#f8717115')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            onClick={() => {
              const raw = current.cells[contextMenu.cellKey] ?? ''
              const text = getCellText(raw)
              setCell(contextMenu.cellKey, text)
              setContextMenu(null)
            }}
          >
            <span className="w-3.5 h-3.5 rounded shrink-0 border" style={{ borderColor: '#f8717155' }} />
            Limpar célula
          </button>
        </div>
      )}
    </div>
  )
}
